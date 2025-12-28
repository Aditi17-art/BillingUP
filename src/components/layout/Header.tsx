import { Bell, Settings, Pencil, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  companyName?: string;
  showEdit?: boolean;
}

export const Header = ({ companyName, showEdit = true }: HeaderProps) => {
  const { signOut, user } = useAuth();
  const { profile } = useProfile(); // ✅ FIXED

  const displayName = profile?.business_name || companyName || "BillingUP";

  const logoUrl = profile?.logo_url; // change if field name is different

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-primary-foreground font-bold text-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-52">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <Settings className="w-4 h-4 mr-2" />
                  Business Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={signOut}
                className="text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1">
            <h1 className="font-semibold text-foreground truncate max-w-[160px]">
              {displayName}
            </h1>

            {showEdit && (
              <Link
                to="/profile"
                className="p-1 text-muted-foreground hover:text-primary">
                <Pencil className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT */}
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
