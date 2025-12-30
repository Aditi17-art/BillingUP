import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, Filter, Download, Calendar, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useParties } from "@/hooks/useParties";
import { usePartyTransactions, calculatePartyTotals } from "@/hooks/usePartyTransactions";
import { TransactionType } from "@/hooks/useTransactions";
import { format } from "date-fns";

const transactionTypeLabels: Record<TransactionType, string> = {
  sale_invoice: "Sale Invoice",
  payment_in: "Payment In",
  sale_return: "Sale Return",
  delivery_challan: "Delivery Challan",
  estimate: "Estimate",
  sale_order: "Sale Order",
  purchase: "Purchase",
  payment_out: "Payment Out",
  purchase_return: "Purchase Return",
  purchase_order: "Purchase Order",
  expense: "Expense",
  p2p_transfer: "P2P Transfer",
};

const PartyStatement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const partyIdFromUrl = searchParams.get("partyId");

  const { parties, isLoading: partiesLoading } = useParties();
  const [selectedPartyId, setSelectedPartyId] = useState<string>(partyIdFromUrl || "");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<TransactionType | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const selectedParty = useMemo(
    () => parties.find((p) => p.id === selectedPartyId),
    [parties, selectedPartyId]
  );

  const { data: transactions = [], isLoading: transactionsLoading } = usePartyTransactions({
    partyName: selectedParty?.name,
    partyPhone: selectedParty?.phone,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    transactionType: transactionTypeFilter,
  });

  const totals = useMemo(() => calculatePartyTotals(transactions), [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTransactionTypeColor = (type: TransactionType) => {
    const creditTypes = ["sale_invoice", "payment_in", "purchase_return"];
    return creditTypes.includes(type) ? "text-green-600" : "text-red-600";
  };

  return (
    <MobileLayout companyName="BillingUP" showBottomNav={false}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Party Statement</h1>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Party Selector */}
          <Card className="p-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Select Party</label>
            <Select value={selectedPartyId} onValueChange={setSelectedPartyId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a party..." />
              </SelectTrigger>
              <SelectContent>
                {parties.map((party) => (
                  <SelectItem key={party.id} value={party.id}>
                    {party.name} {party.phone && `(${party.phone})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Filters */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Filter className="h-4 w-4" />
              Filters
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">From Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">To Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Transaction Type</label>
              <Select
                value={transactionTypeFilter}
                onValueChange={(value) => setTransactionTypeFilter(value as TransactionType | "all")}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(transactionTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Summary Cards */}
          {selectedParty && (
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 bg-green-50 border-green-200">
                <div className="flex items-center gap-1.5 text-green-700 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium">Credits</span>
                </div>
                <p className="text-sm font-bold text-green-800">{formatCurrency(totals.credits)}</p>
              </Card>
              
              <Card className="p-3 bg-red-50 border-red-200">
                <div className="flex items-center gap-1.5 text-red-700 mb-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-xs font-medium">Debits</span>
                </div>
                <p className="text-sm font-bold text-red-800">{formatCurrency(totals.debits)}</p>
              </Card>
              
              <Card className="p-3 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-1.5 text-blue-700 mb-1">
                  <Wallet className="h-4 w-4" />
                  <span className="text-xs font-medium">Balance</span>
                </div>
                <p className={`text-sm font-bold ${totals.balance >= 0 ? "text-green-800" : "text-red-800"}`}>
                  {formatCurrency(Math.abs(totals.balance))}
                  <span className="text-xs font-normal ml-1">
                    {totals.balance >= 0 ? "Rcv" : "Pay"}
                  </span>
                </p>
              </Card>
            </div>
          )}

          {/* Party Info */}
          {selectedParty && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{selectedParty.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedParty.phone || "No phone"}</p>
                  {selectedParty.gstin && (
                    <p className="text-xs text-muted-foreground">GSTIN: {selectedParty.gstin}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedParty.party_type === "customer" 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {selectedParty.party_type}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Transactions List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Transactions ({totals.totalTransactions})
              </h3>
              {transactions.length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              )}
            </div>

            {!selectedParty ? (
              <Card className="p-8 text-center">
                <Search className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Select a party to view transactions</p>
              </Card>
            ) : transactionsLoading ? (
              <Card className="p-8 text-center">
                <div className="animate-pulse text-muted-foreground">Loading transactions...</div>
              </Card>
            ) : transactions.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No transactions found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your filters
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            getTransactionTypeColor(transaction.transaction_type) === "text-green-600"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {transactionTypeLabels[transaction.transaction_type]}
                          </span>
                          {transaction.transaction_number && (
                            <span className="text-xs text-muted-foreground">
                              #{transaction.transaction_number}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(transaction.transaction_date), "dd MMM yyyy")}
                        </p>
                        {transaction.notes && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {transaction.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getTransactionTypeColor(transaction.transaction_type)}`}>
                          {getTransactionTypeColor(transaction.transaction_type) === "text-green-600" ? "+" : "-"}
                          {formatCurrency(transaction.total_amount)}
                        </p>
                        {transaction.payment_status && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            transaction.payment_status === "paid"
                              ? "bg-green-100 text-green-700"
                              : transaction.payment_status === "partial"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {transaction.payment_status}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default PartyStatement;
