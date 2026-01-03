import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, Filter, Download, Calendar, TrendingUp, TrendingDown, Wallet, Scale } from "lucide-react";
import { useParties } from "@/hooks/useParties";
import { usePartyTransactions, calculatePartyTotals } from "@/hooks/usePartyTransactions";
import { TransactionType, Transaction } from "@/hooks/useTransactions";
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
    partyId: selectedPartyId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    transactionType: transactionTypeFilter,
  });

  const totals = useMemo(() => calculatePartyTotals(transactions), [transactions]);

  // Calculate running balance for each transaction (oldest to newest)
  const transactionsWithBalance = useMemo(() => {
    if (!selectedParty) return [];
    
    const openingBalance = selectedParty.opening_balance || 0;
    
    // Sort by date ascending for running balance calculation
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
    );
    
    let runningBalance = openingBalance;
    const withBalance = sorted.map((t) => {
      // Credits increase balance, debits decrease
      const creditTypes = ["sale_invoice", "payment_in", "purchase_return"];
      const isCredit = creditTypes.includes(t.transaction_type);
      const balanceChange = isCredit ? t.total_amount : -t.total_amount;
      runningBalance += balanceChange;
      
      return {
        ...t,
        runningBalance,
        balanceChange,
      };
    });
    
    // Return in descending order (newest first) for display
    return withBalance.reverse();
  }, [transactions, selectedParty]);

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
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 bg-muted/50 border-border">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Scale className="h-4 w-4" />
                  <span className="text-xs font-medium">Opening Bal.</span>
                </div>
                <p className={`text-sm font-bold ${(selectedParty.opening_balance || 0) >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {formatCurrency(Math.abs(selectedParty.opening_balance || 0))}
                  <span className="text-xs font-normal ml-1">
                    {(selectedParty.opening_balance || 0) >= 0 ? "Rcv" : "Pay"}
                  </span>
                </p>
              </Card>

              <Card className="p-3 bg-primary/10 border-primary/20">
                <div className="flex items-center gap-1.5 text-primary mb-1">
                  <Wallet className="h-4 w-4" />
                  <span className="text-xs font-medium">Current Bal.</span>
                </div>
                <p className={`text-sm font-bold ${(selectedParty.current_balance || 0) >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {formatCurrency(Math.abs(selectedParty.current_balance || 0))}
                  <span className="text-xs font-normal ml-1">
                    {(selectedParty.current_balance || 0) >= 0 ? "Rcv" : "Pay"}
                  </span>
                </p>
              </Card>
            </div>
          )}

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
                  <span className="text-xs font-medium">Net Change</span>
                </div>
                <p className={`text-sm font-bold ${totals.balance >= 0 ? "text-green-800" : "text-red-800"}`}>
                  {formatCurrency(Math.abs(totals.balance))}
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
            ) : transactionsWithBalance.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No transactions found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your filters
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {/* Opening Balance Row */}
                {selectedParty && (
                  <Card className="p-3 bg-muted/30 border-dashed">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Opening Balance</span>
                      </div>
                      <p className={`font-semibold ${(selectedParty.opening_balance || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(Math.abs(selectedParty.opening_balance || 0))}
                        <span className="text-xs font-normal ml-1">
                          {(selectedParty.opening_balance || 0) >= 0 ? "Rcv" : "Pay"}
                        </span>
                      </p>
                    </div>
                  </Card>
                )}

                {transactionsWithBalance.map((transaction) => (
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
                          {transaction.balanceChange >= 0 ? "+" : "-"}
                          {formatCurrency(Math.abs(transaction.total_amount))}
                        </p>
                        <p className={`text-xs font-medium mt-1 ${transaction.runningBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                          Bal: {formatCurrency(Math.abs(transaction.runningBalance))}
                          <span className="text-[10px] ml-0.5">
                            {transaction.runningBalance >= 0 ? "Rcv" : "Pay"}
                          </span>
                        </p>
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
