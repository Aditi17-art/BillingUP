-- Create items/inventory table
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sale_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  purchase_price DECIMAL(12, 2) DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT DEFAULT 'PCS',
  hsn_code TEXT,
  gst_rate DECIMAL(5, 2) DEFAULT 0,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- RLS policies for items
CREATE POLICY "Users can view their own items"
ON public.items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items"
ON public.items FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
ON public.items FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
ON public.items FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();