import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { Header } from "./Header";

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  companyName?: string;
}

export const MobileLayout = ({ 
  children, 
  showHeader = true,
  companyName 
}: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      {showHeader && <Header companyName={companyName} />}
      <main className="pb-20 scroll-smooth">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};
