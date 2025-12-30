import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calculator,
  Percent,
  IndianRupee,
} from "lucide-react";
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

interface Sale {
  id: string;
  partyName: string;
  items: SaleItem[];
  subtotal: number;
  gst: number;
  total: number;
  date: string;
  type: "SALE";
}

const AddSale = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [partyName, setPartyName] = useState("");
  const [items, setItems] = useState<SaleItem[]>([
    {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      price: 0,
      gstRate: 18,
    },
  ]);

  /* ----------------- ITEM HANDLERS ----------------- */

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        quantity: 1,
        price: 0,
        gstRate: 18,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof SaleItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  /* ----------------- CALCULATIONS ----------------- */

  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const calculateGst = () =>
    items.reduce(
      (sum, item) => sum + (item.quantity * item.price * item.gstRate) / 100,
      0
    );

  const calculateTotal = () => calculateSubtotal() + calculateGst();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  /* ----------------- SAVE SALE ----------------- */

  const handleSave = () => {
    if (!partyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter party name",
        variant: "destructive",
      });
      return;
    }

    if (items.some((item) => !item.name.trim())) {
      toast({
        title: "Error",
        description: "Please enter all item names",
        variant: "destructive",
      });
      return;
    }

    const sale: Sale = {
      id: Date.now().toString(),
      partyName,
      items,
      subtotal: calculateSubtotal(),
      gst: calculateGst(),
      total: calculateTotal(),
      date: new Date().toISOString(),
      type: "SALE",
    };

    const existingSales: Sale[] = JSON.parse(
      localStorage.getItem("sales") || "[]"
    );

    localStorage.setItem("sales", JSON.stringify([...existingSales, sale]));

    toast({
      title: "Sale Created Successfully",
      description: `${partyName} • ${formatCurrency(sale.total)}`,
    });

    navigate("/");
  };

  /* ----------------- UI ----------------- */

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b">
        <div className="flex items-center gap-3 h-14 px-4">
          <Link to="/">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-semibold">Add New Sale</h1>
        </div>
      </header>

      <main className="px-4 py-4 pb-32 space-y-4">
        {/* Party */}
        <div className="bg-card p-4 rounded-2xl shadow">
          <Label>Party Name *</Label>
          <Input
            className="mt-2"
            placeholder="Customer name"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
          />
        </div>

        {/* Items */}
        <div className="bg-card p-4 rounded-2xl shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Items</h3>
            <Button variant="ghost" size="sm" onClick={addItem}>
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <div
              key={item.id}
              className="bg-accent/50 p-3 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs">Item #{index + 1}</span>
                {items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeItem(item.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>

              <Input
                placeholder="Item name"
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
              />

              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, "quantity", Number(e.target.value) || 1)
                  }
                />
                <Input
                  type="number"
                  min={0}
                  value={item.price}
                  onChange={(e) =>
                    updateItem(item.id, "price", Number(e.target.value) || 0)
                  }
                />
                <Input
                  type="number"
                  min={0}
                  max={28}
                  value={item.gstRate}
                  onChange={(e) =>
                    updateItem(item.id, "gstRate", Number(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card p-4 rounded-2xl shadow space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(calculateSubtotal())}</span>
          </div>
          <div className="flex justify-between">
            <span>GST</span>
            <span>{formatCurrency(calculateGst())}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">
              {formatCurrency(calculateTotal())}
            </span>
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 max-w-lg mx-auto">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button className="flex-1 gap-2" onClick={handleSave}>
            <IndianRupee className="w-4 h-4" />
            Save Sale
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddSale;
