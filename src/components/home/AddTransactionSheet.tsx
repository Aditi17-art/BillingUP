import { X, ArrowDownLeft, RotateCcw, Truck, FileText, ClipboardList, Receipt, ShoppingBag, ArrowUpRight, Package, CreditCard, Users } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useNavigate } from "react-router-dom";

interface TransactionOption {
  icon: React.ElementType;
  label: string;
  path: string;
}

const saleTransactions: TransactionOption[] = [
  { icon: ArrowDownLeft, label: "Payment-In", path: "/add-sale?type=payment-in" },
  { icon: RotateCcw, label: "Sale Return", path: "/add-sale?type=sale-return" },
  { icon: Truck, label: "Delivery Challan", path: "/add-sale?type=delivery-challan" },
  { icon: FileText, label: "Estimate / Quotation", path: "/add-sale?type=estimate" },
  { icon: ClipboardList, label: "Sale Order", path: "/add-sale?type=sale-order" },
  { icon: Receipt, label: "Sale Invoice", path: "/add-sale?type=sale-invoice" },
];

const purchaseTransactions: TransactionOption[] = [
  { icon: ShoppingBag, label: "Purchase", path: "/add-sale?type=purchase" },
  { icon: ArrowUpRight, label: "Payment-Out", path: "/add-sale?type=payment-out" },
  { icon: RotateCcw, label: "Purchase Return", path: "/add-sale?type=purchase-return" },
  { icon: Package, label: "Purchase Order", path: "/add-sale?type=purchase-order" },
];

const otherTransactions: TransactionOption[] = [
  { icon: CreditCard, label: "Expenses", path: "/add-sale?type=expenses" },
  { icon: Users, label: "P2P Transfer", path: "/add-sale?type=p2p-transfer" },
];

interface AddTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransactionGrid = ({ 
  options, 
  onSelect 
}: { 
  options: TransactionOption[]; 
  onSelect: (path: string) => void;
}) => (
  <div className="grid grid-cols-3 gap-3">
    {options.map((option, index) => (
      <button
        key={option.label}
        onClick={() => onSelect(option.path)}
        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-all active:scale-95 animate-fade-in"
        style={{ animationDelay: `${index * 30}ms` }}
      >
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
          <option.icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xs text-center text-foreground font-medium leading-tight">
          {option.label}
        </span>
      </button>
    ))}
  </div>
);

export const AddTransactionSheet = ({ open, onOpenChange }: AddTransactionSheetProps) => {
  const navigate = useNavigate();

  const handleSelect = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="flex items-center justify-between border-b border-border pb-4">
          <DrawerTitle className="text-lg font-semibold">Add Transaction</DrawerTitle>
          <DrawerClose asChild>
            <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <div className="px-4 py-4 space-y-6 overflow-y-auto">
          {/* Sale Transactions */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-success rounded-full" />
              Sale Transactions
            </h3>
            <TransactionGrid options={saleTransactions} onSelect={handleSelect} />
          </div>

          {/* Purchase Transactions */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              Purchase Transactions
            </h3>
            <TransactionGrid options={purchaseTransactions} onSelect={handleSelect} />
          </div>

          {/* Other Transactions */}
          <div className="pb-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-warning rounded-full" />
              Other Transactions
            </h3>
            <TransactionGrid options={otherTransactions} onSelect={handleSelect} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
