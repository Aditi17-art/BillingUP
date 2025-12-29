import { TrendingUp, IndianRupee, ArrowUpRight } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const salesData = [
  { month: "Oct", sales: 45000 },
  { month: "Nov", sales: 72000 },
  { month: "Dec", sales: 150000 },
];

const formatCurrency = (amount: number) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount}`;
};

const Dashboard = () => {
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);

  return (
    <MobileLayout companyName="Dashboard">
      <div className="px-4 py-4 space-y-4">
        {/* Sales Overview Card */}
        <div className="bg-card rounded-2xl p-5 shadow-card animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">
              Monthly Sales Overview
            </h2>
            <span className="text-xs text-muted-foreground">
              Oct - Dec 2024
            </span>
          </div>

          {/* Chart */}
          <div className="h-40 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Sales",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Total Sales</p>
              <p className="text-xl font-bold text-foreground flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {(totalSales / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="flex items-center gap-1 bg-success/10 text-success px-3 py-1.5 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">↑ 100% growth</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 shadow-card animate-slide-up">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <IndianRupee className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">
              Total Receivable
            </p>
            <p className="text-lg font-bold text-foreground">₹1.5L</p>
          </div>
          <div
            className="bg-card rounded-xl p-4 shadow-card animate-slide-up"
            style={{ animationDelay: "50ms" }}>
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Total Profit</p>
            <p className="text-lg font-bold text-success">₹45K</p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Billing on BillingUP
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Create professional GST invoices fast & easy. Share instantly
                via WhatsApp, Email or PDF.
              </p>
              <Link to="/add-sale">
                <Button size="sm" className="w-full">
                  Add Sale Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
