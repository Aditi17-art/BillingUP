import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface BalanceAdjustment {
  id: string;
  user_id: string;
  party_id: string;
  adjustment_type: "opening_balance" | "current_balance";
  previous_balance: number;
  new_balance: number;
  adjustment_amount: number;
  reason: string | null;
  created_at: string;
}

export interface CreateAdjustmentInput {
  party_id: string;
  adjustment_type: "opening_balance" | "current_balance";
  previous_balance: number;
  new_balance: number;
  reason?: string;
}

export const useBalanceAdjustments = (partyId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const adjustmentsQuery = useQuery({
    queryKey: ["balance_adjustments", partyId],
    queryFn: async () => {
      if (!user?.id || !partyId) return [];
      
      const { data, error } = await supabase
        .from("party_balance_adjustments")
        .select("*")
        .eq("party_id", partyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BalanceAdjustment[];
    },
    enabled: !!user?.id && !!partyId,
  });

  const createAdjustment = useMutation({
    mutationFn: async (input: CreateAdjustmentInput) => {
      if (!user?.id) throw new Error("User not authenticated");

      const adjustmentAmount = input.new_balance - input.previous_balance;

      // Insert adjustment record
      const { error: adjustmentError } = await supabase
        .from("party_balance_adjustments")
        .insert({
          user_id: user.id,
          party_id: input.party_id,
          adjustment_type: input.adjustment_type,
          previous_balance: input.previous_balance,
          new_balance: input.new_balance,
          adjustment_amount: adjustmentAmount,
          reason: input.reason || null,
        });

      if (adjustmentError) throw adjustmentError;

      // Update party balance
      const updateField = input.adjustment_type === "opening_balance" 
        ? { opening_balance: input.new_balance }
        : { current_balance: input.new_balance };

      const { error: partyError } = await supabase
        .from("parties")
        .update(updateField)
        .eq("id", input.party_id);

      if (partyError) throw partyError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balance_adjustments"] });
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      toast.success("Balance adjusted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to adjust balance: ${error.message}`);
    },
  });

  return {
    adjustments: adjustmentsQuery.data || [],
    isLoading: adjustmentsQuery.isLoading,
    error: adjustmentsQuery.error,
    createAdjustment,
  };
};
