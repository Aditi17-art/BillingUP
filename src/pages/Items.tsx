import { useState } from "react";
import { Search, Plus, Package, MoreVertical, Filter, Trash2, Edit } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useItems } from "@/hooks/useItems";
import { AddItemDialog } from "@/components/items/AddItemDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const Items = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { items, loading, lowStockCount, deleteItem } = useItems();

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  return (
    <MobileLayout companyName="Items">
      <div className="px-4 py-4 space-y-4">
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3">
          <div className="flex-1 bg-card rounded-xl p-3 shadow-card">
            <p className="text-xs text-muted-foreground">Total Items</p>
            <p className="text-lg font-bold text-foreground">{items.length}</p>
          </div>
          <div className="flex-1 bg-card rounded-xl p-3 shadow-card">
            <p className="text-xs text-muted-foreground">Low Stock</p>
            <p className="text-lg font-bold text-warning">{lowStockCount}</p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Items List */}
        {!loading && (
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-card rounded-xl p-4 shadow-card border border-border/50 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                        {item.hsn_code && (
                          <span className="text-[10px] text-muted-foreground">HSN: {item.hsn_code}</span>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Sale Price</p>
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(item.sale_price)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Stock</p>
                        <p className={`text-sm font-semibold ${item.stock_quantity < 10 ? "text-warning" : "text-foreground"}`}>
                          {item.stock_quantity} {item.unit || "PCS"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-1">
              {items.length === 0 ? "No items yet" : "No items found"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {items.length === 0 ? "Add your first item to get started" : "Try a different search term"}
            </p>
            {items.length === 0 && (
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <Button 
          variant="floating" 
          size="icon-lg" 
          className="rounded-full shadow-glow"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Add Item Dialog */}
      <AddItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </MobileLayout>
  );
};

export default Items;
