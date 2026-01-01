import { X, UserPlus, PieChart, FileBarChart, Bell, MessageCircle, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

interface MoreOptionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const moreOptions = [
  { icon: UserPlus, label: "Invite Party", path: "/parties/invite", color: "bg-gradient-to-br from-blue-400 to-indigo-500" },
  { icon: PieChart, label: "Partywise P&L", path: "/parties/pnl", color: "bg-gradient-to-br from-green-400 to-emerald-500" },
  { icon: FileBarChart, label: "All Parties Report", path: "/parties/report", color: "bg-gradient-to-br from-purple-400 to-violet-500" },
  { icon: Bell, label: "Reminder Settings", path: "/parties/reminders", color: "bg-gradient-to-br from-amber-400 to-orange-500" },
  { icon: MessageCircle, label: "WhatsApp Marketing", path: "/parties/whatsapp", color: "bg-gradient-to-br from-green-500 to-teal-500" },
  { icon: Upload, label: "Import Party", path: "/parties/import", color: "bg-gradient-to-br from-pink-400 to-rose-500" },
];

export const MoreOptionsSheet = ({ open, onOpenChange }: MoreOptionsSheetProps) => {
  const navigate = useNavigate();

  const handleOptionClick = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="flex items-center justify-between border-b pb-4">
          <DrawerTitle className="text-lg font-semibold">More Options</DrawerTitle>
          <DrawerClose asChild>
            <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors active:scale-95">
              <X className="w-4 h-4" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="p-4 grid grid-cols-3 gap-4">
          {moreOptions.map((option, index) => (
            <button
              key={option.path}
              onClick={() => handleOptionClick(option.path)}
              className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-accent/50 transition-all active:scale-95 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-14 h-14 rounded-xl ${option.color} flex items-center justify-center shadow-lg`}>
                <option.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-foreground text-center leading-tight">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
