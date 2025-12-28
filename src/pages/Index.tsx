import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { QuickLinksCard } from "@/components/home/QuickLinksCard";
import { TransactionCard, Transaction } from "@/components/home/TransactionCard";
import { FloatingActionButton } from "@/components/home/FloatingActionButton";
import { TabSelector } from "@/components/home/TabSelector";
import { AddTransactionSheet } from "@/components/home/AddTransactionSheet";

const tabs = [
  { id: "transactions", label: "Transaction Details" },
  { id: "parties", label: "Party Details" },
];

const sampleTransactions: Transaction[] = [
  {
    id: "1",
    partyName: "Khushi Enterprises",
    type: "SALE",
    totalAmount: 150000,
    balanceDue: 50000,
    date: "27 Dec 2024",
    invoiceNumber: "INV-001",
  },
  {
    id: "2",
    partyName: "Sharma Traders",
    type: "PURCHASE",
    totalAmount: 75000,
    balanceDue: 0,
    date: "26 Dec 2024",
    invoiceNumber: "PUR-042",
  },
  {
    id: "3",
    partyName: "Raj Electronics",
    type: "SALE",
    totalAmount: 225000,
    balanceDue: 100000,
    date: "25 Dec 2024",
    invoiceNumber: "INV-003",
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  return (
    <MobileLayout companyName="BillingUP">
      <div className="px-4 py-4 space-y-4">
        {/* Tab Selector */}
        <TabSelector tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Quick Links */}
        <QuickLinksCard onAddTransaction={() => setShowAddTransaction(true)} />

        {/* Section Title */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Recent Transactions</h2>
          <button className="text-xs text-primary font-medium">View All</button>
        </div>

        {/* Transactions List */}
        <div className="space-y-3 pb-16">
          {sampleTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setShowAddTransaction(true)} />

      {/* Add Transaction Sheet */}
      <AddTransactionSheet 
        open={showAddTransaction} 
        onOpenChange={setShowAddTransaction} 
      />
    </MobileLayout>
  );
};

export default Index;
