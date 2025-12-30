import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Transaction, TransactionType } from "./useTransactions";

export interface PartyTransactionFilters {
  partyName?: string;
  partyPhone?: string;
  startDate?: string;
  endDate?: string;
  transactionType?: TransactionType | "all";
}

// Helper to convert DB response to Transaction type
const parseTransactionRecord = (data: any): Transaction => ({
  ...data,
  items: Array.isArray(data.items) ? data.items : [],
});

export const usePartyTransactions = (filters: PartyTransactionFilters) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["party-transactions", user?.id, filters],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false });

      // Filter by party name or phone
      if (filters.partyName) {
        query = query.ilike("party_name", `%${filters.partyName}%`);
      }

      if (filters.partyPhone) {
        query = query.eq("party_phone", filters.partyPhone);
      }

      // Filter by date range
      if (filters.startDate) {
        query = query.gte("transaction_date", filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte("transaction_date", filters.endDate);
      }

      // Filter by transaction type
      if (filters.transactionType && filters.transactionType !== "all") {
        query = query.eq("transaction_type", filters.transactionType);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []).map(parseTransactionRecord);
    },
    enabled: !!user && !!(filters.partyName || filters.partyPhone),
  });
};

export const calculatePartyTotals = (transactions: Transaction[]) => {
  const credits = transactions
    .filter((t) =>
      ["sale_invoice", "payment_in", "purchase_return"].includes(t.transaction_type)
    )
    .reduce((sum, t) => sum + t.total_amount, 0);

  const debits = transactions
    .filter((t) =>
      ["purchase", "payment_out", "sale_return", "expense"].includes(t.transaction_type)
    )
    .reduce((sum, t) => sum + t.total_amount, 0);

  return {
    credits,
    debits,
    balance: credits - debits,
    totalTransactions: transactions.length,
  };
};
