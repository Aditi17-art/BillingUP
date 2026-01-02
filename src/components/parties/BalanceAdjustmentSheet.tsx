import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBalanceAdjustments, BalanceAdjustment } from "@/hooks/useBalanceAdjustments";
import { Party } from "@/hooks/useParties";
import { format } from "date-fns";
import { ArrowUpCircle, ArrowDownCircle, History } from "lucide-react";

interface BalanceAdjustmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  party: Party | null;
}

export const BalanceAdjustmentSheet = ({
  open,
  onOpenChange,
  party,
}: BalanceAdjustmentSheetProps) => {
  const [adjustmentType, setAdjustmentType] = useState<"opening_balance" | "current_balance">("current_balance");
  const [newBalance, setNewBalance] = useState("");
  const [reason, setReason] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const { adjustments, createAdjustment, isLoading } = useBalanceAdjustments(party?.id);

  const currentValue = adjustmentType === "opening_balance" 
    ? party?.opening_balance || 0 
    : party?.current_balance || 0;

  const handleSubmit = async () => {
    if (!party || !newBalance) return;

    await createAdjustment.mutateAsync({
      party_id: party.id,
      adjustment_type: adjustmentType,
      previous_balance: currentValue,
      new_balance: parseFloat(newBalance),
      reason: reason.trim() || undefined,
    });

    setNewBalance("");
    setReason("");
    onOpenChange(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAdjustmentDiff = (adjustment: BalanceAdjustment) => {
    const diff = adjustment.adjustment_amount;
    if (diff > 0) {
      return (
        <span className="text-green-600 flex items-center gap-1">
          <ArrowUpCircle className="h-3 w-3" />
          +{formatCurrency(diff)}
        </span>
      );
    } else if (diff < 0) {
      return (
        <span className="text-red-600 flex items-center gap-1">
          <ArrowDownCircle className="h-3 w-3" />
          {formatCurrency(diff)}
        </span>
      );
    }
    return <span className="text-muted-foreground">No change</span>;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
        <SheetHeader className="pb-4">
          <SheetTitle>Adjust Balance - {party?.name}</SheetTitle>
        </SheetHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={!showHistory ? "default" : "outline"}
            size="sm"
            onClick={() => setShowHistory(false)}
          >
            Adjust
          </Button>
          <Button
            variant={showHistory ? "default" : "outline"}
            size="sm"
            onClick={() => setShowHistory(true)}
          >
            <History className="h-4 w-4 mr-1" />
            History
          </Button>
        </div>

        {!showHistory ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Balance Type</Label>
              <RadioGroup
                value={adjustmentType}
                onValueChange={(v) => setAdjustmentType(v as "opening_balance" | "current_balance")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current_balance" id="current" />
                  <Label htmlFor="current" className="font-normal cursor-pointer">
                    Current Balance
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="opening_balance" id="opening" />
                  <Label htmlFor="opening" className="font-normal cursor-pointer">
                    Opening Balance
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="text-lg font-semibold">{formatCurrency(currentValue)}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newBalance">New Balance (₹)</Label>
              <Input
                id="newBalance"
                type="number"
                placeholder="Enter new balance"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
              />
              {newBalance && (
                <p className="text-sm text-muted-foreground">
                  Difference: {formatCurrency(parseFloat(newBalance) - currentValue)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for adjustment..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={!newBalance || createAdjustment.isPending}
            >
              {createAdjustment.isPending ? "Saving..." : "Save Adjustment"}
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[calc(85vh-180px)]">
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : adjustments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No adjustment history found
              </p>
            ) : (
              <div className="space-y-3">
                {adjustments.map((adj) => (
                  <div
                    key={adj.id}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {adj.adjustment_type.replace("_", " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(adj.created_at), "dd MMM yyyy, hh:mm a")}
                        </p>
                      </div>
                      {getAdjustmentDiff(adj)}
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">
                        From: {formatCurrency(adj.previous_balance)}
                      </span>
                      <span>→</span>
                      <span className="font-medium">
                        To: {formatCurrency(adj.new_balance)}
                      </span>
                    </div>
                    {adj.reason && (
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        {adj.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );
};
