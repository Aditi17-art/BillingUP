import { Download, Share2, MoreVertical, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const typeStyles = {
  SALE: "bg-success/10 text-success",
  PURCHASE: "bg-warning/10 text-warning",
  PAYMENT: "bg-primary/10 text-primary",
  RECEIPT: "bg-accent text-foreground",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);

export const TransactionCard = ({
  transaction,
  className,
  onDelete,
  onEdit,
}: TransactionCardProps) => {
  /* 🔽 DOWNLOAD PDF */
  const handleDownload = () => {
    const pdf = new jsPDF();
    pdf.text("Invoice Details", 20, 20);
    pdf.text(`Party: ${transaction.partyName}`, 20, 35);
    pdf.text(`Type: ${transaction.type}`, 20, 45);
    pdf.text(
      `Total Amount: ${formatCurrency(transaction.totalAmount)}`,
      20,
      55
    );
    pdf.text(`Balance Due: ${formatCurrency(transaction.balanceDue)}`, 20, 65);
    pdf.text(`Invoice No: ${transaction.invoiceNumber}`, 20, 75);
    pdf.text(`Date: ${transaction.date}`, 20, 85);

    pdf.save(`Invoice-${transaction.invoiceNumber}.pdf`);
  };

  /* 🔗 SHARE */
  const handleShare = async () => {
    const shareText = `
Invoice: ${transaction.invoiceNumber}
Party: ${transaction.partyName}
Total: ${formatCurrency(transaction.totalAmount)}
Balance: ${formatCurrency(transaction.balanceDue)}
`;

    if (navigator.share) {
      await navigator.share({
        title: "BillingUP Invoice",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Invoice details copied to clipboard");
    }
  };

  /* 🗑 DELETE */
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      onDelete?.(transaction.id);
    }
  };

  return (
    <div
      className={cn(
        "bg-card rounded-2xl p-4 shadow-card border border-border/50",
        className
      )}>
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <span className="text-sm font-semibold">
              {transaction.partyName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold">{transaction.partyName}</h3>
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                typeStyles[transaction.type]
              )}>
              {transaction.type}
            </span>
          </div>
        </div>

        {/* 3 DOT MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="gap-2"
              onClick={() => onEdit?.(transaction.id)}>
              <Pencil className="w-4 h-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive gap-2"
              onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* DETAILS */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Total Amount</span>
          <span className="font-semibold">
            {formatCurrency(transaction.totalAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Balance Due</span>
          <span
            className={cn(
              "font-semibold",
              transaction.balanceDue > 0 ? "text-primary" : "text-success"
            )}>
            {formatCurrency(transaction.balanceDue)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{transaction.date}</span>
          <span>#{transaction.invoiceNumber}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 pt-3 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={handleDownload}>
          <Download className="w-4 h-4" />
          Download
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>
    </div>
  );
};
