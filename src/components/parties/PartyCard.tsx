import { Phone, MoreVertical, Calculator } from "lucide-react";
import { Party } from "@/hooks/useParties";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PartyCardProps {
  party: Party;
  isActive?: boolean;
  onEdit?: (party: Party) => void;
  onDelete?: (id: string) => void;
  onViewStatement?: (party: Party) => void;
  onAdjustBalance?: (party: Party) => void;
}

export const PartyCard = ({ 
  party, 
  isActive = false, 
  onEdit, 
  onDelete,
  onViewStatement,
  onAdjustBalance 
}: PartyCardProps) => {
  const balanceColor = party.current_balance >= 0 ? "text-success" : "text-destructive";
  const balanceLabel = party.current_balance >= 0 ? "To Receive" : "To Pay";
  const balanceAmount = Math.abs(party.current_balance);

  return (
    <div 
      className={`bg-card rounded-xl p-4 shadow-card transition-all duration-200 ${
        isActive 
          ? "ring-2 ring-destructive/50 bg-destructive/5" 
          : "hover:shadow-lg"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">
              {party.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Party Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm truncate">
              {party.name}
            </h3>
            {party.phone && (
              <div className="flex items-center gap-1 text-muted-foreground text-xs mt-0.5">
                <Phone className="w-3 h-3" />
                <span>{party.phone}</span>
              </div>
            )}
            <span className="text-[10px] text-muted-foreground capitalize">
              {party.party_type}
            </span>
          </div>
        </div>

        {/* Balance & Actions */}
        <div className="flex items-start gap-2">
          <div className="text-right">
            <p className={`font-bold text-sm ${balanceColor}`}>
              ₹{balanceAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-muted-foreground">{balanceLabel}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewStatement?.(party)}>
                View Statement
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAdjustBalance?.(party)}>
                <Calculator className="w-4 h-4 mr-2" />
                Adjust Balance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(party)}>
                Edit Party
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(party.id)}
                className="text-destructive"
              >
                Delete Party
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
