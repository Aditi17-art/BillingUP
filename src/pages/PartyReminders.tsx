import { useState } from "react";
import { Bell, Clock, MessageCircle, Mail, ChevronRight } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReminderSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const PartyReminders = () => {
  const [settings, setSettings] = useState<ReminderSetting[]>([
    { id: "auto", label: "Auto Reminders", description: "Automatically send reminders for overdue payments", enabled: true },
    { id: "whatsapp", label: "WhatsApp Reminders", description: "Send reminders via WhatsApp", enabled: true },
    { id: "sms", label: "SMS Reminders", description: "Send reminders via SMS", enabled: false },
    { id: "email", label: "Email Reminders", description: "Send reminders via Email", enabled: false },
  ]);

  const [reminderDays, setReminderDays] = useState([7, 15, 30]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    toast.success("Setting updated!");
  };

  const handleSaveSchedule = () => {
    toast.success("Reminder schedule saved!");
  };

  return (
    <MobileLayout companyName="Reminder Settings" showBackButton>
      <div className="px-4 py-4 space-y-4">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <span className="font-medium">Payment Reminders</span>
          </div>
          <p className="text-sm opacity-90">
            Configure when and how reminders are sent to your parties for pending payments
          </p>
        </div>

        {/* Reminder Channels */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-slide-up">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">Reminder Channels</h3>
          </div>
          <div className="divide-y divide-border">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    {setting.id === "whatsapp" && <MessageCircle className="w-5 h-5 text-green-600" />}
                    {setting.id === "sms" && <MessageCircle className="w-5 h-5 text-blue-600" />}
                    {setting.id === "email" && <Mail className="w-5 h-5 text-purple-600" />}
                    {setting.id === "auto" && <Bell className="w-5 h-5 text-amber-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{setting.label}</p>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </div>
                </div>
                <Switch checked={setting.enabled} onCheckedChange={() => toggleSetting(setting.id)} />
              </div>
            ))}
          </div>
        </div>

        {/* Reminder Schedule */}
        <div className="bg-card rounded-2xl shadow-card p-4 space-y-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Reminder Schedule
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Send reminders after these many days of payment due date:
          </p>
          <div className="flex gap-2">
            {reminderDays.map((day, index) => (
              <div
                key={index}
                className="flex-1 bg-accent rounded-xl p-3 text-center"
              >
                <p className="text-2xl font-bold text-primary">{day}</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
            ))}
          </div>
          <Button onClick={handleSaveSchedule} className="w-full">
            Save Schedule
          </Button>
        </div>

        {/* Reminder Templates */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: "150ms" }}>
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">Reminder Templates</h3>
          </div>
          <button className="w-full flex items-center justify-between px-4 py-4 hover:bg-accent/50 transition-colors">
            <div>
              <p className="font-medium text-foreground text-left">Customize Message</p>
              <p className="text-xs text-muted-foreground">Edit reminder message template</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default PartyReminders;
