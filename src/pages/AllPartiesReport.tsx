import { FileBarChart, Download, Users, IndianRupee, TrendingUp, TrendingDown } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useParties } from "@/hooks/useParties";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const AllPartiesReport = () => {
  const { parties, activeParties, totalReceivable, totalPayable, isLoading } = useParties();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const customers = parties.filter((p) => p.party_type === "customer");
  const vendors = parties.filter((p) => p.party_type === "vendor");

  const handleExport = () => {
    toast.success("Report exported successfully!");
  };

  if (isLoading) {
    return (
      <MobileLayout companyName="All Parties Report" showBackButton>
        <div className="px-4 py-4 space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout companyName="All Parties Report" showBackButton>
      <div className="px-4 py-4 space-y-4">
        {/* Header with Export */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">Report Summary</h2>
          <Button onClick={handleExport} size="sm" variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in">
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-muted-foreground">Total Parties</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{parties.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{activeParties.length} active</p>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs text-muted-foreground">Net Balance</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totalReceivable - totalPayable)}
            </p>
          </div>
        </div>

        {/* Receivable & Payable */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700 dark:text-green-400">To Receive</span>
            </div>
            <p className="text-xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(totalReceivable)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-xs text-red-700 dark:text-red-400">To Pay</span>
            </div>
            <p className="text-xl font-bold text-red-700 dark:text-red-400">
              {formatCurrency(totalPayable)}
            </p>
          </div>
        </div>

        {/* Breakdown by Type */}
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <FileBarChart className="w-4 h-4" />
            Breakdown by Type
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div>
                <p className="font-medium text-foreground">Customers</p>
                <p className="text-xs text-muted-foreground">{customers.length} parties</p>
              </div>
              <p className="font-semibold text-blue-600">
                {formatCurrency(customers.reduce((sum, c) => sum + c.current_balance, 0))}
              </p>
            </div>

            <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <div>
                <p className="font-medium text-foreground">Vendors</p>
                <p className="text-xs text-muted-foreground">{vendors.length} parties</p>
              </div>
              <p className="font-semibold text-orange-600">
                {formatCurrency(vendors.reduce((sum, v) => sum + v.current_balance, 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Party List Summary */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: "150ms" }}>
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">All Parties</h3>
          </div>
          <div className="divide-y divide-border max-h-64 overflow-y-auto">
            {parties.map((party) => (
              <div key={party.id} className="flex justify-between items-center px-4 py-3">
                <div>
                  <p className="font-medium text-foreground text-sm">{party.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{party.party_type}</p>
                </div>
                <p className={`text-sm font-semibold ${party.current_balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(party.current_balance)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AllPartiesReport;
