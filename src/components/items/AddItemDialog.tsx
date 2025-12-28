import { useState } from "react";
import { Plus, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useItems, NewItem } from "@/hooks/useItems";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddItemDialog = ({ open, onOpenChange }: AddItemDialogProps) => {
  const { addItem } = useItems();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<NewItem>({
    name: "",
    sale_price: 0,
    stock_quantity: 0,
    unit: "PCS",
    purchase_price: 0,
    hsn_code: "",
    gst_rate: 18,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    const { error } = await addItem(formData);
    setIsLoading(false);

    if (!error) {
      setFormData({
        name: "",
        sale_price: 0,
        stock_quantity: 0,
        unit: "PCS",
        purchase_price: 0,
        hsn_code: "",
        gst_rate: 18,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Add New Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              placeholder="Enter item name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price (₹)</Label>
              <Input
                id="salePrice"
                type="number"
                placeholder="0"
                value={formData.sale_price || ""}
                onChange={(e) => setFormData({ ...formData, sale_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
              <Input
                id="purchasePrice"
                type="number"
                placeholder="0"
                value={formData.purchase_price || ""}
                onChange={(e) => setFormData({ ...formData, purchase_price: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                value={formData.stock_quantity || ""}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                placeholder="PCS"
                value={formData.unit || ""}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="hsn">HSN Code</Label>
              <Input
                id="hsn"
                placeholder="e.g., 8517"
                value={formData.hsn_code || ""}
                onChange={(e) => setFormData({ ...formData, hsn_code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst">GST Rate (%)</Label>
              <Input
                id="gst"
                type="number"
                placeholder="18"
                value={formData.gst_rate || ""}
                onChange={(e) => setFormData({ ...formData, gst_rate: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading || !formData.name.trim()}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
