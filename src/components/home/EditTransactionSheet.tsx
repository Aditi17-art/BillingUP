import { useState, useMemo, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, User, ChevronDown } from "lucide-react";
import { Transaction, TransactionItem, useTransactions } from "@/hooks/useTransactions";
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

interface EditTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);

export const EditTransactionSheet = ({
  open,
  onOpenChange,
  transaction,
}: EditTransactionSheetProps) => {
  const { updateTransaction } = useTransactions();
  const { parties, isLoading: partiesLoading } = useParties();

  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);
  const [partySearchOpen, setPartySearchOpen] = useState(false);
  const [items, setItems] = useState<SaleItem[]>([]);

  // Reset form when transaction changes
  useEffect(() => {
    if (transaction) {
      setSelectedPartyId(transaction.party_id);
      setItems(
        transaction.items.length > 0
          ? transaction.items.map((item, idx) => ({
              id: `${idx}-${Date.now()}`,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              gstRate: item.tax_rate || 0,
            }))
          : [{ id: Date.now().toString(), name: "", quantity: 1, price: 0, gstRate: 18 }]
      );
    }
  }, [transaction]);

  const selectedParty = useMemo(() => {
    return parties.find((p) => p.id === selectedPartyId);
  }, [parties, selectedPartyId]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: "", quantity: 1, price: 0, gstRate: 18 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof SaleItem, value: string | number) => {
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

  const handleSave = async () => {
    if (!transaction) return;
    if (items.some((item) => !item.name.trim())) return;

    const transactionItems: TransactionItem[] = items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      tax_rate: item.gstRate,
      total: item.quantity * item.price * (1 + item.gstRate / 100),
    }));

    await updateTransaction.mutateAsync({
      id: transaction.id,
      party_id: selectedPartyId,
      party_name: selectedParty?.name || null,
      party_phone: selectedParty?.phone || null,
      subtotal: calculateSubtotal(),
      tax_amount: calculateGst(),
      total_amount: calculateTotal(),
      items: transactionItems,
    });

    onOpenChange(false);
  };

  if (!transaction) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Transaction</SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-4">
          {/* Party Selection */}
          <div className="bg-muted/50 p-4 rounded-xl">
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
                          <p className="text-xs text-muted-foreground">
                            {selectedParty.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Select a party...</span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search parties..." />
                  <CommandList>
                    <CommandEmpty>
                      {partiesLoading ? "Loading..." : "No party found."}
                    </CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="none"
                        onSelect={() => {
                          setSelectedPartyId(null);
                          setPartySearchOpen(false);
                        }}
                      >
                        <span className="text-muted-foreground">No party</span>
                      </CommandItem>
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
                                <p className="text-xs text-muted-foreground">
                                  {party.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Items */}
          <div className="bg-muted/50 p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Items</h3>
              <Button variant="ghost" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={item.id} className="bg-background p-3 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Item #{index + 1}</span>
                  {items.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(item.id)}
                    >
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
          <div className="bg-muted/50 p-4 rounded-xl space-y-2">
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
              <span className="text-primary">{formatCurrency(calculateTotal())}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={updateTransaction.isPending}
            >
              {updateTransaction.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
