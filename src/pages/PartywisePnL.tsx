import { useState, useMemo } from "react";
import { PieChart, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useParties } from "@/hooks/useParties";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type SortOption = "name" | "profit" | "balance";

const PartywisePnL = () => {
  const { parties, isLoading } = useParties();
  const [sortBy, setSortBy] = useState<SortOption>("balance");

  // Mock P&L data - in real app, this would come from transactions
  const partyPnLData = useMemo(() => {
    return parties.map((party) => ({
      ...party,
      sales: Math.floor(Math.random() * 100000) + 10000,
      purchases: Math.floor(Math.random() * 50000) + 5000,
      profit: 0,
    })).map((p) => ({
      ...p,
      profit: p.sales - p.purchases,
    }));
  }, [parties]);

  const sortedData = useMemo(() => {
    return [...partyPnLData].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "profit") return b.profit - a.profit;
      return b.current_balance - a.current_balance;
    });
  }, [partyPnLData, sortBy]);

  const totalProfit = partyPnLData.reduce((sum, p) => sum + p.profit, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <MobileLayout companyName="Partywise P&L" showBackButton>
        <div className="px-4 py-4 space-y-4">
          <Skeleton className="h-24 rounded-xl" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout companyName="Partywise P&L" showBackButton>
      <div className="px-4 py-4 space-y-4">
        {/* Summary Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="font-medium opacity-90">Total Profit/Loss</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalProfit)}</p>
          <p className="text-sm opacity-75 mt-1">Across {parties.length} parties</p>
        </div>

        {/* Sort Options */}
        <div className="flex gap-2">
          <Button
            variant={sortBy === "balance" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("balance")}
            className="rounded-full text-xs"
          >
            <ArrowUpDown className="w-3 h-3 mr-1" />
            Balance
          </Button>
          <Button
            variant={sortBy === "profit" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("profit")}
            className="rounded-full text-xs"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Profit
          </Button>
          <Button
            variant={sortBy === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("name")}
            className="rounded-full text-xs"
          >
            Name
          </Button>
        </div>

        {/* Party List */}
        <div className="space-y-3">
          {sortedData.map((party, index) => (
            <div
              key={party.id}
              className="bg-card rounded-xl p-4 shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{party.name}</h4>
                  <p className="text-xs text-muted-foreground capitalize">{party.party_type}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${party.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {party.profit >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {formatCurrency(Math.abs(party.profit))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                  <p className="text-muted-foreground">Sales</p>
                  <p className="font-semibold text-green-600">{formatCurrency(party.sales)}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 text-center">
                  <p className="text-muted-foreground">Purchases</p>
                  <p className="font-semibold text-red-600">{formatCurrency(party.purchases)}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
                  <p className="text-muted-foreground">Balance</p>
                  <p className="font-semibold text-blue-600">{formatCurrency(party.current_balance)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedData.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <PieChart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No party data available</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default PartywisePnL;
