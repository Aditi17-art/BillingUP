import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParties, Party } from "@/hooks/useParties";
import { Loader2 } from "lucide-react";

interface AddPartySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editParty?: Party | null;
}

export const AddPartySheet = ({ open, onOpenChange, editParty }: AddPartySheetProps) => {
  const { createParty, updateParty } = useParties();
  const [formData, setFormData] = useState({
    name: editParty?.name || "",
    phone: editParty?.phone || "",
    email: editParty?.email || "",
    address: editParty?.address || "",
    gstin: editParty?.gstin || "",
    party_type: editParty?.party_type || "customer",
    opening_balance: editParty?.opening_balance?.toString() || "0",
  });

  const isLoading = createParty.isPending || updateParty.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const partyData = {
      name: formData.name,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      gstin: formData.gstin || undefined,
      party_type: formData.party_type,
      opening_balance: parseFloat(formData.opening_balance) || 0,
    };

    if (editParty) {
      await updateParty.mutateAsync({ id: editParty.id, ...partyData });
    } else {
      await createParty.mutateAsync(partyData);
    }

    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      gstin: "",
      party_type: "customer",
      opening_balance: "0",
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>{editParty ? "Edit Party" : "Add New Party"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 overflow-y-auto pb-6">
          <div className="space-y-2">
            <Label htmlFor="name">Party Name *</Label>
            <Input
              id="name"
              placeholder="Enter party name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="party_type">Party Type</Label>
            <Select
              value={formData.party_type}
              onValueChange={(value) => setFormData({ ...formData, party_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstin">GSTIN</Label>
            <Input
              id="gstin"
              placeholder="Enter GSTIN"
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="opening_balance">Opening Balance (₹)</Label>
            <Input
              id="opening_balance"
              type="number"
              placeholder="0"
              value={formData.opening_balance}
              onChange={(e) => setFormData({ ...formData, opening_balance: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Positive = To Receive, Negative = To Pay
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !formData.name}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {editParty ? "Update Party" : "Add Party"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
