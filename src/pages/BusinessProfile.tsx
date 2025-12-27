import { useState } from "react";
import { Upload, Share2, Phone, Mail, MapPin, Building2, FileText } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const BusinessProfile = () => {
  const [showGstOnCard, setShowGstOnCard] = useState(true);
  const profileCompletion = 16;

  return (
    <MobileLayout companyName="Business Profile">
      <div className="px-4 py-4 space-y-4">
        {/* Business Card Preview */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border animate-fade-in">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-2xl">B</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">BillingUP</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Phone className="w-3 h-3" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <Mail className="w-3 h-3" />
                <span>contact@billingup.in</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Shop No. 12, Main Market, Sector 22, Gurugram, Haryana - 122001</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-2">
              <Upload className="w-4 h-4" />
              Upload Logo
            </Button>
            <Button variant="default" size="sm" className="flex-1 gap-2">
              <Share2 className="w-4 h-4" />
              Share Card
            </Button>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-card rounded-xl p-4 shadow-card animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Profile Completion</span>
            <span className="text-sm font-bold text-primary">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Complete your profile to build trust with customers
          </p>
        </div>

        {/* Edit Form */}
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-4 animate-slide-up">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Business Details
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" defaultValue="BillingUP" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="gstin" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  GSTIN
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Show on card</span>
                  <Switch checked={showGstOnCard} onCheckedChange={setShowGstOnCard} />
                </div>
              </div>
              <Input id="gstin" placeholder="Enter 15-digit GSTIN" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone1">Phone Number 1</Label>
              <Input id="phone1" type="tel" defaultValue="+91 98765 43210" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone2">Phone Number 2 (Optional)</Label>
              <Input id="phone2" type="tel" placeholder="Enter alternate number" />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button variant="default" className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default BusinessProfile;
