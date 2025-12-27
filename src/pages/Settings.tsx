import {
  Settings2,
  FileText,
  Printer,
  Receipt,
  Users,
  MessageSquare,
  Bell,
  UserCircle,
  Package,
  ChevronRight,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Link } from "react-router-dom";

interface SettingItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string;
}

const settingsItems: SettingItem[] = [
  { icon: Settings2, label: "General", path: "/settings/general", badge: "NEW" },
  { icon: FileText, label: "Transaction", path: "/settings/transaction", badge: "NEW" },
  { icon: Printer, label: "Invoice Print", path: "/settings/print" },
  { icon: Receipt, label: "Taxes & GST", path: "/settings/gst", badge: "NEW" },
  { icon: Users, label: "User Management", path: "/settings/users" },
  { icon: MessageSquare, label: "Transaction SMS", path: "/settings/sms" },
  { icon: Bell, label: "Reminders", path: "/settings/reminders" },
  { icon: UserCircle, label: "Party", path: "/settings/party" },
  { icon: Package, label: "Item", path: "/settings/item" },
];

const Settings = () => {
  return (
    <MobileLayout companyName="Settings">
      <div className="px-4 py-4">
        <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-fade-in">
          <div className="divide-y divide-border">
            {settingsItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center justify-between px-4 py-4 hover:bg-accent/50 transition-colors group animate-slide-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-medium text-foreground">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Settings;
