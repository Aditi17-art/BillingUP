import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export type TransactionType = 
  | 'sale_invoice'
  | 'payment_in'
  | 'sale_return'
  | 'delivery_challan'
  | 'estimate'
  | 'sale_order'
  | 'purchase'
  | 'payment_out'
  | 'purchase_return'
  | 'purchase_order'
  | 'expense'
  | 'p2p_transfer';

export type PaymentStatus = 'paid' | 'unpaid' | 'partial';

export interface TransactionItem {
  item_id?: string;
  name: string;
  quantity: number;
  price: number;
  tax_rate?: number;
  total: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: TransactionType;
  transaction_number: string | null;
  transaction_date: string;
  party_name: string | null;
  party_phone: string | null;
  subtotal: number;
  discount_amount: number | null;
  tax_amount: number | null;
  total_amount: number;
  payment_status: PaymentStatus | null;
  payment_mode: string | null;
  notes: string | null;
  items: TransactionItem[];
  created_at: string;
  updated_at: string;
}

export interface NewTransaction {
  transaction_type: TransactionType;
  transaction_number?: string;
  transaction_date?: string;
  party_name?: string;
  party_phone?: string;
  subtotal?: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  payment_status?: PaymentStatus;
  payment_mode?: string;
  notes?: string;
  items?: TransactionItem[];
}

// Helper to convert DB response to Transaction type
const parseTransaction = (data: any): Transaction => ({
  ...data,
  items: Array.isArray(data.items) ? data.items : [],
});

export const useTransactions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return (data || []).map(parseTransaction);
    },
    enabled: !!user,
  });

  const addTransaction = useMutation({
    mutationFn: async (newTransaction: NewTransaction) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          transaction_type: newTransaction.transaction_type,
          transaction_number: newTransaction.transaction_number,
          transaction_date: newTransaction.transaction_date,
          party_name: newTransaction.party_name,
          party_phone: newTransaction.party_phone,
          subtotal: newTransaction.subtotal,
          discount_amount: newTransaction.discount_amount,
          tax_amount: newTransaction.tax_amount,
          total_amount: newTransaction.total_amount,
          payment_status: newTransaction.payment_status,
          payment_mode: newTransaction.payment_mode,
          notes: newTransaction.notes,
          user_id: user.id,
          items: (newTransaction.items || []) as unknown as Json,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
      toast.success('Transaction added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add transaction: ' + error.message);
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async ({ id, items, ...updates }: Partial<Transaction> & { id: string }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          ...updates,
          items: items ? (items as unknown as Json) : undefined,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
      toast.success('Transaction updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update transaction: ' + error.message);
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
      toast.success('Transaction deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete transaction: ' + error.message);
    },
  });

  // Get transactions by type
  const getTransactionsByType = (type: TransactionType) => {
    return transactions.filter(t => t.transaction_type === type);
  };

  // Calculate totals
  const totals = {
    sales: transactions
      .filter(t => ['sale_invoice', 'payment_in'].includes(t.transaction_type))
      .reduce((sum, t) => sum + t.total_amount, 0),
    purchases: transactions
      .filter(t => ['purchase', 'payment_out'].includes(t.transaction_type))
      .reduce((sum, t) => sum + t.total_amount, 0),
    expenses: transactions
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + t.total_amount, 0),
  };

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    totals,
  };
};
