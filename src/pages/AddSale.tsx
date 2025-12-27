import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Calculator, Percent, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
}

const AddSale = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [partyName, setPartyName] = useState("");
  const [items, setItems] = useState<SaleItem[]>([
    { id: "1", name: "", quantity: 1, price: 0, gstRate: 18 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: "", quantity: 1, price: 0, gstRate: 18 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof SaleItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const calculateGst = () => {
    return items.reduce(
      (sum, item) => sum + (item.quantity * item.price * item.gstRate) / 100,
      0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGst();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = () => {
    if (!partyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter party name",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Sale Created!",
      description: `Invoice for ${partyName} - ${formatCurrency(calculateTotal())}`,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon-sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-semibold text-foreground">Add New Sale</h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 pb-32 space-y-4">
        {/* Party Details */}
        <div className="bg-card rounded-2xl p-4 shadow-card animate-fade-in">
          <Label htmlFor="party" className="text-sm font-semibold text-foreground">
            Party Name *
          </Label>
          <Input
            id="party"
            placeholder="Enter customer/supplier name"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* Items */}
        <div className="bg-card rounded-2xl p-4 shadow-card animate-slide-up space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Items</h3>
            <Button variant="ghost" size="sm" onClick={addItem} className="text-primary gap-1">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-3 bg-accent/50 rounded-xl space-y-3 animate-scale-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Item #{index + 1}
                </span>
                {items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <Input
                placeholder="Item name"
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
              />

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, "quantity", parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Price (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(item.id, "price", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">GST %</Label>
                  <Input
                    type="number"
                    min="0"
                    max="28"
                    value={item.gstRate}
                    onChange={(e) =>
                      updateItem(item.id, "gstRate", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-2xl p-4 shadow-card animate-slide-up space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Percent className="w-3 h-3" />
                GST
              </span>
              <span className="font-medium">{formatCurrency(calculateGst())}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-primary text-lg">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border p-4 max-w-lg mx-auto pb-safe">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button variant="floating" className="flex-1 gap-2" onClick={handleSave}>
            <IndianRupee className="w-4 h-4" />
            Save Sale
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddSale;
