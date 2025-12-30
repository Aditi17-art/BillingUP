import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParties, Party } from "@/hooks/useParties";
import { PartyCard } from "./PartyCard";
import { AddPartySheet } from "./AddPartySheet";
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
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!parties.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Users className="w-12 h-12 mb-3 opacity-50" />
        <p className="text-sm">No parties added yet</p>
        <p className="text-xs">Add your first customer or vendor</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {parties.map((party) => (
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

      <AddPartySheet
        open={showEditSheet}
        onOpenChange={setShowEditSheet}
        editParty={editParty}
      />
    </>
  );
};
