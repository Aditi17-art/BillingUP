import { ChevronRight, CreditCard, Bell, UserCircle, Receipt, IndianRupee, ToggleLeft } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface SettingOption {
  icon: React.ElementType;
  label: string;
  description: string;
  type: "toggle" | "link";
  defaultValue?: boolean;
}

const partySettingsOptions: SettingOption[] = [
  { 
    icon: CreditCard, 
    label: "Credit Limit", 
    description: "Set default credit limit for new parties",
    type: "link"
  },
  { 
    icon: Bell, 
    label: "Payment Reminders", 
    description: "Auto-send payment reminders to parties",
    type: "toggle",
    defaultValue: true
  },
  { 
    icon: UserCircle, 
    label: "Default Party Type", 
    description: "Set default type for new parties",
    type: "link"
  },
  { 
    icon: Receipt, 
    label: "GST/Tax Preferences", 
    description: "Configure GST settings for parties",
    type: "link"
  },
  { 
    icon: IndianRupee, 
    label: "Opening Balance", 
    description: "Allow opening balance while adding party",
    type: "toggle",
    defaultValue: true
  },
  { 
    icon: ToggleLeft, 
    label: "Show Inactive Parties", 
    description: "Display inactive parties in lists",
    type: "toggle",
    defaultValue: false
  },
];

const PartySettings = () => {
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    partySettingsOptions.forEach((opt) => {
      if (opt.type === "toggle") {
        initial[opt.label] = opt.defaultValue ?? false;
      }
    });
    return initial;
  });

  const handleToggle = (label: string) => {
    setToggleStates((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <MobileLayout companyName="Party Settings" showBackButton>
      <div className="px-4 py-4">
        <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-fade-in">
          <div className="divide-y divide-border">
            {partySettingsOptions.map((option, index) => (
              <div
                key={option.label}
                className="flex items-center justify-between px-4 py-4 hover:bg-accent/50 transition-colors group animate-slide-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <option.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-foreground block">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </div>
                </div>
                {option.type === "toggle" ? (
                  <Switch
                    checked={toggleStates[option.label]}
                    onCheckedChange={() => handleToggle(option.label)}
                  />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default PartySettings;
