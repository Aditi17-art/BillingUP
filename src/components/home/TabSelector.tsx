import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabSelector = ({ tabs, activeTab, onTabChange }: TabSelectorProps) => {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === tab.id
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
