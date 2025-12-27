import { Printer, Share2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Transaction {
  id: string;
  partyName: string;
  type: "SALE" | "PURCHASE" | "PAYMENT" | "RECEIPT";
  totalAmount: number;
  balanceDue: number;
  date: string;
  invoiceNumber: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  className?: string;
}

const typeStyles = {
  SALE: "bg-success/10 text-success",
  PURCHASE: "bg-warning/10 text-warning",
  PAYMENT: "bg-primary/10 text-primary",
  RECEIPT: "bg-accent text-foreground",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const TransactionCard = ({ transaction, className }: TransactionCardProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-2xl p-4 shadow-card border border-border/50 animate-slide-up",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <span className="text-sm font-semibold text-foreground">
              {transaction.partyName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{transaction.partyName}</h3>
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase",
                typeStyles[transaction.type]
              )}
            >
              {transaction.type}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon-sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Amount</span>
          <span className="font-semibold text-foreground">
            {formatCurrency(transaction.totalAmount)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Balance Due</span>
          <span className={cn(
            "font-semibold",
            transaction.balanceDue > 0 ? "text-primary" : "text-success"
          )}>
            {formatCurrency(transaction.balanceDue)}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{transaction.date}</span>
          <span>#{transaction.invoiceNumber}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Button variant="outline" size="sm" className="flex-1 gap-2">
          <Printer className="w-4 h-4" />
          Print
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>
    </div>
  );
};
