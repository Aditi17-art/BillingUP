import { useState } from "react";
import { MessageCircle, Send, Users, Image, FileText, Plus } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParties } from "@/hooks/useParties";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const WhatsAppMarketing = () => {
  const { parties, isLoading } = useParties();
  const [message, setMessage] = useState("");
  const [selectedParties, setSelectedParties] = useState<string[]>([]);

  const toggleParty = (partyId: string) => {
    setSelectedParties((prev) =>
      prev.includes(partyId)
        ? prev.filter((id) => id !== partyId)
        : [...prev, partyId]
    );
  };

  const selectAll = () => {
    if (selectedParties.length === parties.length) {
      setSelectedParties([]);
    } else {
      setSelectedParties(parties.map((p) => p.id));
    }
  };

  const handleSendBroadcast = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    if (selectedParties.length === 0) {
      toast.error("Please select at least one party");
      return;
    }

    // Open WhatsApp with first selected party
    const selectedParty = parties.find((p) => p.id === selectedParties[0]);
    if (selectedParty?.phone) {
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${selectedParty.phone}?text=${encodedMessage}`, "_blank");
    }
    
    toast.success(`Broadcast ready for ${selectedParties.length} parties`);
  };

  const templates = [
    { id: "1", label: "New Year Greetings", preview: "Wishing you a Happy New Year! 🎉" },
    { id: "2", label: "Payment Reminder", preview: "Gentle reminder about pending payment..." },
    { id: "3", label: "Festive Offer", preview: "Special discount for our valued customers! 🎁" },
  ];

  return (
    <MobileLayout companyName="WhatsApp Marketing" showBackButton>
      <div className="px-4 py-4 space-y-4">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-5 text-white animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="font-medium">WhatsApp Broadcast</span>
          </div>
          <p className="text-sm opacity-90">
            Send promotional messages to multiple parties at once
          </p>
        </div>

        {/* Message Composer */}
        <div className="bg-card rounded-2xl shadow-card p-4 space-y-4 animate-slide-up">
          <h3 className="font-semibold text-foreground">Compose Message</h3>
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Image className="w-4 h-4" />
              Image
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <FileText className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="bg-card rounded-2xl shadow-card p-4 space-y-3 animate-slide-up" style={{ animationDelay: "50ms" }}>
          <h3 className="font-semibold text-foreground">Quick Templates</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setMessage(template.preview)}
                className="shrink-0 px-4 py-2 bg-accent rounded-full text-sm font-medium hover:bg-accent/80 transition-colors"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        {/* Select Parties */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Select Parties ({selectedParties.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={selectAll}>
              {selectedParties.length === parties.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
          <div className="divide-y divide-border max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Loading...</div>
            ) : parties.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No parties found</div>
            ) : (
              parties.map((party) => (
                <label
                  key={party.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedParties.includes(party.id)}
                    onCheckedChange={() => toggleParty(party.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{party.name}</p>
                    <p className="text-xs text-muted-foreground">{party.phone || "No phone"}</p>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendBroadcast}
          className="w-full h-12 gap-2"
          disabled={!message.trim() || selectedParties.length === 0}
        >
          <Send className="w-4 h-4" />
          Send to {selectedParties.length} Parties
        </Button>
      </div>
    </MobileLayout>
  );
};

export default WhatsAppMarketing;
