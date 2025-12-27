import {
  Building2,
  HardDrive,
  Wrench,
  CreditCard,
  Monitor,
  TrendingUp,
  Settings,
  HelpCircle,
  Star,
  ChevronRight,
  Shield,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Link } from "react-router-dom";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
  badgeColor?: string;
}

const companyItems: MenuItem[] = [
  { icon: Building2, label: "Manage Companies", path: "/companies" },
  { icon: HardDrive, label: "Backup / Restore", path: "/backup" },
  { icon: Wrench, label: "Utilities", path: "/utilities", badge: "NEW", badgeColor: "bg-primary text-primary-foreground" },
];

const otherItems: MenuItem[] = [
  { icon: CreditCard, label: "Plans & Pricing", path: "/pricing" },
  { icon: Monitor, label: "Get Desktop Billing Software", path: "/desktop" },
  { icon: TrendingUp, label: "Grow Your Business", path: "/grow" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: HelpCircle, label: "Help & Support", path: "/help" },
  { icon: Star, label: "Rate This App", path: "/rate" },
];

const MenuSection = ({ title, items }: { title: string; items: MenuItem[] }) => (
  <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-fade-in">
    <div className="px-4 py-3 bg-muted/50 border-b border-border">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</h2>
    </div>
    <div className="divide-y divide-border">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="flex items-center justify-between px-4 py-3.5 hover:bg-accent/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="font-medium text-foreground">{item.label}</span>
            {item.badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                {item.badge}
              </span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      ))}
    </div>
  </div>
);

const Menu = () => {
  return (
    <MobileLayout companyName="Menu">
      <div className="px-4 py-4 space-y-4">
        {/* Company Card */}
        <div className="bg-card rounded-2xl p-4 shadow-card animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">BillingUP</h2>
              <p className="text-xs text-muted-foreground">Free Plan • GST Ready</p>
            </div>
            <div className="flex items-center gap-1 text-success text-xs font-medium">
              <Shield className="w-4 h-4" />
              Active
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <MenuSection title="Company Management" items={companyItems} />
        <MenuSection title="Others" items={otherItems} />

        {/* Footer */}
        <div className="text-center py-4 space-y-2">
          <p className="text-xs text-muted-foreground">App Version 1.0.0</p>
          <button className="text-xs text-primary font-medium">Privacy Policy</button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Menu;
