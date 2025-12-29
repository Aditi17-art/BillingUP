-- Create enum for transaction types
CREATE TYPE public.transaction_type AS ENUM (
  'sale_invoice',
  'payment_in',
  'sale_return',
  'delivery_challan',
  'estimate',
  'sale_order',
  'purchase',
  'payment_out',
  'purchase_return',
  'purchase_order',
  'expense',
  'p2p_transfer'
);

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM (
  'paid',
  'unpaid',
  'partial'
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type public.transaction_type NOT NULL,
  transaction_number TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  party_name TEXT,
  party_phone TEXT,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  payment_status public.payment_status DEFAULT 'unpaid',
  payment_mode TEXT,
  notes TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own transactions"
ON public.transactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
ON public.transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
ON public.transactions
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
ON public.transactions
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;