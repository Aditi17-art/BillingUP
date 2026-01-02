import { useState, useMemo } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  IndianRupee,
  Search,
  ChevronDown,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTransactions, TransactionType } from "@/hooks/useTransactions";
import { useParties } from "@/hooks/useParties";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
}

const transactionTypeMap: Record<string, TransactionType> = {
  "payment-in": "payment_in",
  "sale-return": "sale_return",
  "delivery-challan": "delivery_challan",
  "estimate": "estimate",
  "sale-order": "sale_order",
  "sale-invoice": "sale_invoice",
  "purchase": "purchase",
  "payment-out": "payment_out",
  "purchase-return": "purchase_return",
  "purchase-order": "purchase_order",
  "expenses": "expense",
  "p2p-transfer": "p2p_transfer",
};

const transactionTitles: Record<string, string> = {
  "payment-in": "Payment In",
  "sale-return": "Sale Return",
  "delivery-challan": "Delivery Challan",
  "estimate": "Estimate / Quotation",
  "sale-order": "Sale Order",
  "sale-invoice": "Sale Invoice",
  "purchase": "Purchase",
  "payment-out": "Payment Out",
  "purchase-return": "Purchase Return",
  "purchase-order": "Purchase Order",
  "expenses": "Expense",
  "p2p-transfer": "P2P Transfer",
};

const AddSale = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transactionTypeParam = searchParams.get("type") || "sale-invoice";
  const transactionType = transactionTypeMap[transactionTypeParam] || "sale_invoice";
  const pageTitle = transactionTitles[transactionTypeParam] || "Add Transaction";

  const { addTransaction } = useTransactions();
  const { parties, isLoading: partiesLoading } = useParties();

  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);
  const [partySearchOpen, setPartySearchOpen] = useState(false);
  const [items, setItems] = useState<SaleItem[]>([
    {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      price: 0,
      gstRate: 18,
    },
  ]);

  const selectedParty = useMemo(() => {
    return parties.find(p => p.id === selectedPartyId);
  }, [parties, selectedPartyId]);

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

  const handleSave = async () => {
    if (items.some((item) => !item.name.trim())) {
      return;
    }

    const transactionItems = items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      tax_rate: item.gstRate,
      total: item.quantity * item.price * (1 + item.gstRate / 100),
    }));

    await addTransaction.mutateAsync({
      transaction_type: transactionType,
      party_id: selectedPartyId || undefined,
      party_name: selectedParty?.name,
      party_phone: selectedParty?.phone,
      subtotal: calculateSubtotal(),
      tax_amount: calculateGst(),
      total_amount: calculateTotal(),
      items: transactionItems,
      payment_status: "unpaid",
    });

    navigate("/");
  };

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
          <h1 className="font-semibold">{pageTitle}</h1>
        </div>
      </header>

      <main className="px-4 py-4 pb-32 space-y-4">
        {/* Party Selection */}
        <div className="bg-card p-4 rounded-2xl shadow">
          <Label>Select Party</Label>
          <Popover open={partySearchOpen} onOpenChange={setPartySearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={partySearchOpen}
                className="w-full justify-between mt-2"
              >
                {selectedParty ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{selectedParty.name}</p>
                      {selectedParty.phone && (
                        <p className="text-xs text-muted-foreground">{selectedParty.phone}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Select a party...</span>
                )}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] max-w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Search parties..." />
                <CommandList>
                  <CommandEmpty>
                    {partiesLoading ? "Loading..." : "No party found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {parties.map((party) => (
                      <CommandItem
                        key={party.id}
                        value={party.name}
                        onSelect={() => {
                          setSelectedPartyId(party.id);
                          setPartySearchOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{party.name}</p>
                            {party.phone && (
                              <p className="text-xs text-muted-foreground">{party.phone}</p>
                            )}
                          </div>
                          <div className={`text-sm font-medium ${party.current_balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {formatCurrency(Math.abs(party.current_balance))}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {selectedParty && (
            <div className="mt-2 p-2 bg-muted/50 rounded-lg flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Balance</span>
              <span className={`font-medium ${selectedParty.current_balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                {selectedParty.current_balance >= 0 ? 'To Receive: ' : 'To Pay: '}
                {formatCurrency(Math.abs(selectedParty.current_balance))}
              </span>
            </div>
          )}
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
                <div>
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, "quantity", Number(e.target.value) || 1)
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Price</Label>
                  <Input
                    type="number"
                    min={0}
                    value={item.price}
                    onChange={(e) =>
                      updateItem(item.id, "price", Number(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">GST %</Label>
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
          <Button 
            className="flex-1 gap-2" 
            onClick={handleSave}
            disabled={addTransaction.isPending}
          >
            <IndianRupee className="w-4 h-4" />
            {addTransaction.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddSale;