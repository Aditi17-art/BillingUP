import { useState } from "react";
import { Share2, MessageCircle, Copy, Check, Link as LinkIcon, Users } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const InviteParty = () => {
  const [copied, setCopied] = useState(false);
  const inviteLink = `${window.location.origin}/invite?ref=user123`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(`Join me on BillingUP for easy business transactions! ${inviteLink}`);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join BillingUP",
          text: "Join me on BillingUP for easy business transactions!",
          url: inviteLink,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <MobileLayout companyName="Invite Party" showBackButton>
      <div className="px-4 py-6 space-y-6">
        {/* Header Illustration */}
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Invite Your Business Partners</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Share your invite link with customers and vendors to connect with them on BillingUP
          </p>
        </div>

        {/* Invite Link Section */}
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-4 animate-slide-up">
          <h3 className="font-semibold text-foreground">Your Invite Link</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={inviteLink}
                readOnly
                className="pl-10 pr-4 h-11 rounded-xl bg-muted/50 text-sm"
              />
            </div>
            <Button
              onClick={handleCopyLink}
              size="icon"
              variant="outline"
              className="h-11 w-11 rounded-xl shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Share Options */}
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h3 className="font-semibold text-foreground">Share Via</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleShareWhatsApp}
              variant="outline"
              className="h-14 rounded-xl flex items-center gap-3 justify-start px-4"
            >
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">WhatsApp</span>
            </Button>
            <Button
              onClick={handleNativeShare}
              variant="outline"
              className="h-14 rounded-xl flex items-center gap-3 justify-start px-4"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Share</span>
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-card rounded-2xl p-4 shadow-card animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h3 className="font-semibold text-foreground mb-3">Benefits of Connecting</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              Instant invoice sharing
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              Real-time payment updates
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              Easy balance reconciliation
            </li>
          </ul>
        </div>
      </div>
    </MobileLayout>
  );
};

export default InviteParty;
