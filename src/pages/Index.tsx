import { useState, useMemo } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { QuickLinksCard } from "@/components/home/QuickLinksCard";
import { TransactionCard, Transaction as UITransaction } from "@/components/home/TransactionCard";
import { FloatingActionButton } from "@/components/home/FloatingActionButton";
import { TabSelector } from "@/components/home/TabSelector";
import { AddTransactionSheet } from "@/components/home/AddTransactionSheet";
import { PartyQuickLinks } from "@/components/parties/PartyQuickLinks";
import { PartyList } from "@/components/parties/PartyList";
import { AddPartySheet } from "@/components/parties/AddPartySheet";
import { EditTransactionSheet } from "@/components/home/EditTransactionSheet";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { format } from "date-fns";

const tabs = [
  { id: "transactions", label: "Transaction Details" },
  { id: "parties", label: "Party Details" },
];

const mapTransactionType = (type: string): UITransaction["type"] => {
  if (type.includes("sale") || type === "payment_in" || type === "delivery_challan" || type === "estimate" || type === "sale_order") {
    return "SALE";
  }
  if (type.includes("purchase") || type === "payment_out" || type === "purchase_order") {
    return "PURCHASE";
  }
  if (type === "expense") {
    return "PURCHASE";
  }
  return "SALE";
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddParty, setShowAddParty] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState<string | undefined>();
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [showEditSheet, setShowEditSheet] = useState(false);

  const { transactions, deleteTransaction } = useTransactions();

  const isPartiesTab = activeTab === "parties";

  const uiTransactions: UITransaction[] = useMemo(() => {
    return transactions.map((t) => ({
      id: t.id,
      partyName: t.party_name || "Walk-in Customer",
      type: mapTransactionType(t.transaction_type),
      totalAmount: t.total_amount,
      balanceDue: t.payment_status === "paid" ? 0 : t.total_amount,
      date: format(new Date(t.transaction_date), "dd MMM yyyy"),
      invoiceNumber: t.transaction_number || t.id.slice(0, 8).toUpperCase(),
    }));
  }, [transactions]);

  const handleDelete = (id: string) => {
    deleteTransaction.mutate(id);
  };

  const handleEdit = (id: string) => {
    const txn = transactions.find((t) => t.id === id);
    if (txn) {
      setEditTransaction(txn);
      setShowEditSheet(true);
    }
  };

  return (
    <MobileLayout companyName="BillingUP">
      <div className="px-4 py-4 space-y-4">
        {/* Tab Selector */}
        <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Quick Links - Different for each tab */}
        {isPartiesTab ? (
          <PartyQuickLinks />
        ) : (
          <QuickLinksCard onAddTransaction={() => setShowAddTransaction(true)} />
        )}

        {/* Section Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {isPartiesTab ? "Your Parties" : "Recent Transactions"}
          </h2>
          <button className="text-xs text-primary font-medium">View All</button>
        </div>

        {/* Content based on active tab */}
        <div className="pb-16">
          {isPartiesTab ? (
            <PartyList selectedPartyId={selectedPartyId} />
          ) : (
            <div className="space-y-3">
              {uiTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No transactions yet. Create your first transaction!
                </p>
              ) : (
                uiTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={() => isPartiesTab ? setShowAddParty(true) : setShowAddTransaction(true)} 
      />

      {/* Add Transaction Sheet */}
      <AddTransactionSheet 
        open={showAddTransaction} 
        onOpenChange={setShowAddTransaction} 
      />

      {/* Edit Transaction Sheet */}
      <EditTransactionSheet
        open={showEditSheet}
        onOpenChange={setShowEditSheet}
        transaction={editTransaction}
      />

      {/* Add Party Sheet */}
      <AddPartySheet
        open={showAddParty}
        onOpenChange={setShowAddParty}
      />
    </MobileLayout>
  );
};

export default Index;
