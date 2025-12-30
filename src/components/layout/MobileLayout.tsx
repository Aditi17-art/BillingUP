import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { Header } from "./Header";

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
  companyName?: string;
}

export const MobileLayout = ({
  children,
  showHeader = true,
  showBottomNav = true,
  companyName,
}: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      {showHeader && <Header companyName={companyName} />}
      <main className={showBottomNav ? "pb-20 scroll-smooth" : "scroll-smooth"}>{children}</main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};
