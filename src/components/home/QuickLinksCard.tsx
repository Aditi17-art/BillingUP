import { Plus, BarChart3, Settings, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { icon: Plus, label: "Add Transaction", path: "#add-transaction", color: "bg-primary/10 text-primary" },
  { icon: BarChart3, label: "Sale Report", path: "/dashboard", color: "bg-success/10 text-success" },
  { icon: Settings, label: "Transaction Settings", path: "/settings", color: "bg-warning/10 text-warning" },
  { icon: ArrowRight, label: "Show All", path: "/dashboard", color: "bg-accent text-foreground" },
];

interface QuickLinksCardProps {
  onAddTransaction?: () => void;
}

export const QuickLinksCard = ({ onAddTransaction }: QuickLinksCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-card animate-fade-in">
      <div className="grid grid-cols-4 gap-3">
        {quickLinks.map((link, index) => {
          if (link.path === "#add-transaction") {
            return (
              <button
                key={link.path}
                onClick={onAddTransaction}
                className="flex flex-col items-center gap-2 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-center text-muted-foreground font-medium leading-tight">
                  {link.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={link.path}
              to={link.path}
              className="flex flex-col items-center gap-2 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95`}>
                <link.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-center text-muted-foreground font-medium leading-tight">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
