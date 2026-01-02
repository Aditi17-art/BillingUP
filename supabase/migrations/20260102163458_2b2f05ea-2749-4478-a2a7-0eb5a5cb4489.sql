-- Add party_id column to transactions table
ALTER TABLE public.transactions 
ADD COLUMN party_id UUID REFERENCES public.parties(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_transactions_party_id ON public.transactions(party_id);

-- Create function to update party balance on transaction changes
CREATE OR REPLACE FUNCTION public.update_party_balance_on_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  balance_change NUMERIC;
  target_party_id UUID;
  old_balance_change NUMERIC;
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    IF NEW.party_id IS NOT NULL THEN
      -- Calculate balance change based on transaction type
      -- Sales/Payment-In increase receivable (positive), Purchases/Payment-Out increase payable (negative)
      CASE NEW.transaction_type
        WHEN 'sale_invoice' THEN balance_change := NEW.total_amount;
        WHEN 'payment_in' THEN balance_change := -NEW.total_amount; -- Payment received reduces receivable
        WHEN 'sale_return' THEN balance_change := -NEW.total_amount;
        WHEN 'delivery_challan' THEN balance_change := NEW.total_amount;
        WHEN 'estimate' THEN balance_change := 0; -- Estimates don't affect balance
        WHEN 'sale_order' THEN balance_change := 0; -- Orders don't affect balance
        WHEN 'purchase' THEN balance_change := -NEW.total_amount; -- Purchase increases payable
        WHEN 'payment_out' THEN balance_change := NEW.total_amount; -- Payment made reduces payable
        WHEN 'purchase_return' THEN balance_change := NEW.total_amount;
        WHEN 'purchase_order' THEN balance_change := 0;
        ELSE balance_change := 0;
      END CASE;
      
      IF balance_change != 0 THEN
        UPDATE public.parties 
        SET current_balance = current_balance + balance_change,
            updated_at = now()
        WHERE id = NEW.party_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  -- Handle UPDATE
  IF TG_OP = 'UPDATE' THEN
    -- Reverse old transaction effect if party was linked
    IF OLD.party_id IS NOT NULL THEN
      CASE OLD.transaction_type
        WHEN 'sale_invoice' THEN old_balance_change := -OLD.total_amount;
        WHEN 'payment_in' THEN old_balance_change := OLD.total_amount;
        WHEN 'sale_return' THEN old_balance_change := OLD.total_amount;
        WHEN 'delivery_challan' THEN old_balance_change := -OLD.total_amount;
        WHEN 'purchase' THEN old_balance_change := OLD.total_amount;
        WHEN 'payment_out' THEN old_balance_change := -OLD.total_amount;
        WHEN 'purchase_return' THEN old_balance_change := -OLD.total_amount;
        ELSE old_balance_change := 0;
      END CASE;
      
      IF old_balance_change != 0 THEN
        UPDATE public.parties 
        SET current_balance = current_balance + old_balance_change,
            updated_at = now()
        WHERE id = OLD.party_id;
      END IF;
    END IF;
    
    -- Apply new transaction effect
    IF NEW.party_id IS NOT NULL THEN
      CASE NEW.transaction_type
        WHEN 'sale_invoice' THEN balance_change := NEW.total_amount;
        WHEN 'payment_in' THEN balance_change := -NEW.total_amount;
        WHEN 'sale_return' THEN balance_change := -NEW.total_amount;
        WHEN 'delivery_challan' THEN balance_change := NEW.total_amount;
        WHEN 'purchase' THEN balance_change := -NEW.total_amount;
        WHEN 'payment_out' THEN balance_change := NEW.total_amount;
        WHEN 'purchase_return' THEN balance_change := NEW.total_amount;
        ELSE balance_change := 0;
      END CASE;
      
      IF balance_change != 0 THEN
        UPDATE public.parties 
        SET current_balance = current_balance + balance_change,
            updated_at = now()
        WHERE id = NEW.party_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    IF OLD.party_id IS NOT NULL THEN
      CASE OLD.transaction_type
        WHEN 'sale_invoice' THEN old_balance_change := -OLD.total_amount;
        WHEN 'payment_in' THEN old_balance_change := OLD.total_amount;
        WHEN 'sale_return' THEN old_balance_change := OLD.total_amount;
        WHEN 'delivery_challan' THEN old_balance_change := -OLD.total_amount;
        WHEN 'purchase' THEN old_balance_change := OLD.total_amount;
        WHEN 'payment_out' THEN old_balance_change := -OLD.total_amount;
        WHEN 'purchase_return' THEN old_balance_change := -OLD.total_amount;
        ELSE old_balance_change := 0;
      END CASE;
      
      IF old_balance_change != 0 THEN
        UPDATE public.parties 
        SET current_balance = current_balance + old_balance_change,
            updated_at = now()
        WHERE id = OLD.party_id;
      END IF;
    END IF;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

-- Create trigger for automatic balance updates
CREATE TRIGGER trigger_update_party_balance
AFTER INSERT OR UPDATE OR DELETE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_party_balance_on_transaction();