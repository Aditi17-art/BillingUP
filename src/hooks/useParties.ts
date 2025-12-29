import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Party {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  gstin?: string;
  party_type: string;
  opening_balance: number;
  current_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePartyInput {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  gstin?: string;
  party_type?: string;
  opening_balance?: number;
}

export interface UpdatePartyInput extends Partial<CreatePartyInput> {
  id: string;
  is_active?: boolean;
  current_balance?: number;
}

export const useParties = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const partiesQuery = useQuery({
    queryKey: ["parties", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("parties")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Party[];
    },
    enabled: !!user?.id,
  });

  const createParty = useMutation({
    mutationFn: async (input: CreatePartyInput) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("parties")
        .insert({
          ...input,
          user_id: user.id,
          current_balance: input.opening_balance || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      toast.success("Party created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create party: ${error.message}`);
    },
  });

  const updateParty = useMutation({
    mutationFn: async ({ id, ...input }: UpdatePartyInput) => {
      const { data, error } = await supabase
        .from("parties")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      toast.success("Party updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update party: ${error.message}`);
    },
  });

  const deleteParty = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("parties")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parties"] });
      toast.success("Party deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete party: ${error.message}`);
    },
  });

  const activeParties = partiesQuery.data?.filter(p => p.is_active) || [];
  const totalReceivable = activeParties.reduce((sum, p) => sum + Math.max(0, p.current_balance), 0);
  const totalPayable = activeParties.reduce((sum, p) => sum + Math.abs(Math.min(0, p.current_balance)), 0);

  return {
    parties: partiesQuery.data || [],
    activeParties,
    isLoading: partiesQuery.isLoading,
    error: partiesQuery.error,
    createParty,
    updateParty,
    deleteParty,
    totalReceivable,
    totalPayable,
  };
};
