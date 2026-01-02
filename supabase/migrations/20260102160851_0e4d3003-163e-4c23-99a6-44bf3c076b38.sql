-- Create balance adjustments table for audit trail
CREATE TABLE public.party_balance_adjustments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  party_id UUID NOT NULL REFERENCES public.parties(id) ON DELETE CASCADE,
  adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('opening_balance', 'current_balance')),
  previous_balance NUMERIC NOT NULL DEFAULT 0,
  new_balance NUMERIC NOT NULL DEFAULT 0,
  adjustment_amount NUMERIC NOT NULL DEFAULT 0,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.party_balance_adjustments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own adjustments"
ON public.party_balance_adjustments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own adjustments"
ON public.party_balance_adjustments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own adjustments"
ON public.party_balance_adjustments
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_party_balance_adjustments_party_id ON public.party_balance_adjustments(party_id);
CREATE INDEX idx_party_balance_adjustments_user_id ON public.party_balance_adjustments(user_id);