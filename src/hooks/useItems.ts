import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Item {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  sale_price: number;
  purchase_price: number | null;
  stock_quantity: number;
  unit: string | null;
  hsn_code: string | null;
  gst_rate: number | null;
  category: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface NewItem {
  name: string;
  description?: string;
  sale_price: number;
  purchase_price?: number;
  stock_quantity: number;
  unit?: string;
  hsn_code?: string;
  gst_rate?: number;
  category?: string;
}

export const useItems = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchItems();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchItems = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching items",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setItems((data as Item[]) || []);
    }
    setLoading(false);
  };

  const addItem = async (item: NewItem) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("items")
      .insert({
        ...item,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding item",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    setItems((prev) => [data as Item, ...prev]);
    toast({
      title: "Item added",
      description: `${item.name} has been added to your inventory.`,
    });
    return { error: null, data };
  };

  const updateItem = async (id: string, updates: Partial<NewItem>) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase
      .from("items")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    await fetchItems();
    toast({
      title: "Item updated",
      description: "Changes saved successfully.",
    });
    return { error: null };
  };

  const deleteItem = async (id: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase
      .from("items")
      .update({ is_active: false })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Item deleted",
      description: "Item has been removed from your inventory.",
    });
    return { error: null };
  };

  const lowStockCount = items.filter((item) => item.stock_quantity < 10).length;

  return { 
    items, 
    loading, 
    addItem, 
    updateItem, 
    deleteItem, 
    refetch: fetchItems,
    lowStockCount 
  };
};
