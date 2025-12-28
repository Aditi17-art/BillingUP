import { useState, useMemo } from "react";
import {
  Upload,
  Share2,
  Phone,
  Mail,
  MapPin,
  Building2,
  FileText,
} from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const initialData = {
  businessName: "BillingUP",
  gstin: "",
  showGst: true,
  phone1: "+91 98765 43210",
  phone2: "",
  email: "contact@billingup.in",
  address: "Shop No. 12, Main Market, Sector 22, Gurugram, Haryana",
  pincode: "122001",
  logo: "",
};

const BusinessProfile = () => {
  const [data, setData] = useState(initialData);
  const [savedData, setSavedData] = useState(initialData);

  /* ---------------- PROFILE COMPLETION ---------------- */
  const profileCompletion = useMemo(() => {
    const fields = [
      data.businessName,
      data.phone1,
      data.email,
      data.address,
      data.pincode,
      data.gstin,
      data.logo,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [data]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (key: string, value: string | boolean) => {
    setData({ ...data, [key]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setData({ ...data, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSavedData(data);
    alert("Profile saved successfully ✅");
  };

  const handleCancel = () => {
    setData(savedData);
  };

  const handleShare = async () => {
    const text = `
${data.businessName}
📞 ${data.phone1}
📧 ${data.email}
📍 ${data.address} - ${data.pincode}
    `;
    if (navigator.share) {
      await navigator.share({ title: data.businessName, text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Business card copied to clipboard 📋");
    }
  };

  return (
    <MobileLayout companyName="Business Profile">
      <div className="px-4 py-4 space-y-4">
        {/* ---------------- CARD PREVIEW ---------------- */}
        <div className="bg-card rounded-2xl p-5 shadow-card border">
          <div className="flex gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
              {data.logo ? (
                <img src={data.logo} className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-foreground font-bold text-2xl">
                  {data.businessName.charAt(0)}
                </span>
              )}
            </div>

            <div>
              <h2 className="font-bold text-lg">{data.businessName}</h2>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3 h-3" /> {data.phone1}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-3 h-3" /> {data.email}
              </p>
            </div>
          </div>

          <p className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 mt-0.5" />
            {data.address} - {data.pincode}
          </p>

          <div className="flex gap-2">
            <label className="flex-1">
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleLogoUpload}
              />
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Upload className="w-4 h-4" /> Upload Logo
              </Button>
            </label>

            <Button size="sm" className="flex-1 gap-2" onClick={handleShare}>
              <Share2 className="w-4 h-4" /> Share Card
            </Button>
          </div>
        </div>

        {/* ---------------- PROFILE COMPLETION ---------------- */}
        <div className="bg-card rounded-xl p-4 shadow-card">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm font-bold text-primary">
              {profileCompletion}%
            </span>
          </div>
          <Progress value={profileCompletion} />
        </div>

        {/* ---------------- EDIT FORM ---------------- */}
        <div className="bg-card rounded-2xl p-4 shadow-card space-y-4">
          <h3 className="font-semibold flex gap-2">
            <Building2 className="w-4 h-4" /> Business Details
          </h3>

          <div className="space-y-3">
            <Label>Business Name</Label>
            <Input
              value={data.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
            />

            <div className="flex justify-between items-center">
              <Label className="flex gap-2">
                <FileText className="w-4 h-4" /> GSTIN
              </Label>
              <Switch
                checked={data.showGst}
                onCheckedChange={(v) => handleChange("showGst", v)}
              />
            </div>
            <Input
              placeholder="15-digit GSTIN"
              value={data.gstin}
              onChange={(e) => handleChange("gstin", e.target.value)}
            />

            <Label>Phone Number 1</Label>
            <Input
              value={data.phone1}
              onChange={(e) => handleChange("phone1", e.target.value)}
            />

            <Label>Phone Number 2</Label>
            <Input
              value={data.phone2}
              onChange={(e) => handleChange("phone2", e.target.value)}
            />

            <Label>Email</Label>
            <Input
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Label>Address</Label>
            <Input
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />

            <Label>Pincode</Label>
            <Input
              value={data.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
            />

            <div className="flex gap-3 pt-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave}>
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
