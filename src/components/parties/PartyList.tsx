import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useParties, Party } from "@/hooks/useParties";
import { PartyCard } from "./PartyCard";
import { AddPartySheet } from "./AddPartySheet";
import { PartySearchFilter, BalanceFilter } from "./PartySearchFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

interface PartyListProps {
  selectedPartyId?: string;
}

export const PartyList = ({ selectedPartyId }: PartyListProps) => {
  const navigate = useNavigate();
  const { parties, isLoading, deleteParty } = useParties();
  const [editParty, setEditParty] = useState<Party | null>(null);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [balanceFilter, setBalanceFilter] = useState<BalanceFilter>("all");

  const filteredParties = useMemo(() => {
    return parties.filter((party) => {
      // Search filter
      const matchesSearch = 
        party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (party.phone && party.phone.includes(searchQuery));

      // Balance filter
      let matchesBalance = true;
      if (balanceFilter === "receivable") {
        matchesBalance = party.current_balance > 0;
      } else if (balanceFilter === "payable") {
        matchesBalance = party.current_balance < 0;
      } else if (balanceFilter === "zero") {
        matchesBalance = party.current_balance === 0;
      }

      return matchesSearch && matchesBalance;
    });
  }, [parties, searchQuery, balanceFilter]);

  const handleEdit = (party: Party) => {
    setEditParty(party);
    setShowEditSheet(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this party?")) {
      await deleteParty.mutateAsync(id);
    }
  };

  const handleViewStatement = (party: Party) => {
    navigate(`/parties/statement?partyId=${party.id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-11 rounded-xl" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <PartySearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          balanceFilter={balanceFilter}
          onBalanceFilterChange={setBalanceFilter}
        />

        {filteredParties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">
              {parties.length === 0 ? "No parties added yet" : "No parties match your search"}
            </p>
            <p className="text-xs">
              {parties.length === 0 ? "Add your first customer or vendor" : "Try different search terms"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredParties.map((party) => (
              <PartyCard
                key={party.id}
                party={party}
                isActive={party.id === selectedPartyId}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewStatement={handleViewStatement}
              />
            ))}
          </div>
        )}
      </div>

      <AddPartySheet
        open={showEditSheet}
        onOpenChange={setShowEditSheet}
        editParty={editParty}
      />
    </>
  );
};
