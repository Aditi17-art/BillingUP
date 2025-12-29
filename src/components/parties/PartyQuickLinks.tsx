import { Network, FileText, Settings, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const partyQuickLinks = [
  { icon: Network, label: "Network", path: "/parties", color: "bg-gradient-to-br from-purple-400 to-pink-400 text-white" },
  { icon: FileText, label: "Party Statement", path: "/parties/statement", color: "bg-gradient-to-br from-blue-400 to-cyan-400 text-white" },
  { icon: Settings, label: "Party Settings", path: "/settings", color: "bg-gradient-to-br from-amber-400 to-orange-400 text-white" },
  { icon: ArrowRight, label: "Show All", path: "/parties", color: "bg-gradient-to-br from-emerald-400 to-teal-400 text-white" },
];

export const PartyQuickLinks = () => {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-card animate-fade-in">
      <h3 className="text-sm font-semibold text-foreground mb-3">Quick Links</h3>
      <div className="grid grid-cols-4 gap-3">
        {partyQuickLinks.map((link, index) => (
          <Link
            key={link.path + index}
            to={link.path}
            className="flex flex-col items-center gap-2 group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95 shadow-md`}>
              <link.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-center text-muted-foreground font-medium leading-tight">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
