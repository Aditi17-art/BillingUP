import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { TabSelector } from "@/components/home/TabSelector";

const tabs = [
  { id: "app", label: "App Notifications" },
  { id: "transactions", label: "All Transactions" },
];

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("app");

  return (
    <MobileLayout companyName="Notifications">
      <div className="px-4 py-4 space-y-4">
        {/* Tab Selector */}
        <TabSelector
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <BellOff className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            No notifications yet
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6 max-w-[250px]">
            You'll see payment reminders, due invoices, and app updates here.
          </p>
          <Button variant="default" className="gap-2">
            <Bell className="w-4 h-4" />
            Enable Notifications
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Notifications;
