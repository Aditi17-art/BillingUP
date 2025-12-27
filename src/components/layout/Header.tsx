import { Bell, Settings, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps {
  companyName?: string;
  showEdit?: boolean;
}

export const Header = ({ companyName = "BillingUP", showEdit = true }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </div>
          <div className="flex items-center gap-1">
            <h1 className="font-semibold text-foreground">{companyName}</h1>
            {showEdit && (
              <button className="p-1 text-muted-foreground hover:text-primary transition-colors">
                <Pencil className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Link to="/notifications">
            <Button variant="ghost" size="icon-sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </Link>
          <Link to="/settings">
            <Button variant="ghost" size="icon-sm">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
