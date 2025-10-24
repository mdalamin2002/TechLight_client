import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Button } from "@/Components/ui/button";
import { Bell, Mail, MessageSquare, Package, Tag } from "lucide-react";
import { toast } from "react-toastify";

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState(() => {
    // Load from localStorage
    const stored = localStorage.getItem("notificationPreferences");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return getDefaultPreferences();
      }
    }
    return getDefaultPreferences();
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Save to localStorage whenever preferences change
    localStorage.setItem("notificationPreferences", JSON.stringify(preferences));
  }, [preferences]);

  const handleToggle = (category, type) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: When backend API is ready, send preferences to server
    // await axiosSecure.patch('/users/preferences/notifications', preferences);
    
    toast.success("Notification preferences saved!");
    setHasChanges(false);
  };

  const handleReset = () => {
    setPreferences(getDefaultPreferences());
    toast.info("Reset to default preferences");
    setHasChanges(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Manage how you receive updates about your orders, promotions, and account activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Updates */}
        <NotificationCategory
          icon={<Package className="w-5 h-5" />}
          title="Order Updates"
          description="Notifications about your orders and deliveries"
        >
          <NotificationOption
            label="Email Notifications"
            description="Receive order updates via email"
            checked={preferences.orders.email}
            onChange={() => handleToggle("orders", "email")}
          />
          <NotificationOption
            label="Browser Notifications"
            description="Get push notifications in your browser"
            checked={preferences.orders.push}
            onChange={() => handleToggle("orders", "push")}
          />
        </NotificationCategory>

        {/* Promotions & Offers */}
        <NotificationCategory
          icon={<Tag className="w-5 h-5" />}
          title="Promotions & Offers"
          description="Special deals, discounts, and new arrivals"
        >
          <NotificationOption
            label="Email Notifications"
            description="Receive promotional emails"
            checked={preferences.promotions.email}
            onChange={() => handleToggle("promotions", "email")}
          />
          <NotificationOption
            label="Browser Notifications"
            description="Get notified about flash sales"
            checked={preferences.promotions.push}
            onChange={() => handleToggle("promotions", "push")}
          />
        </NotificationCategory>

        {/* Account Activity */}
        <NotificationCategory
          icon={<MessageSquare className="w-5 h-5" />}
          title="Account Activity"
          description="Security alerts and account changes"
        >
          <NotificationOption
            label="Email Notifications"
            description="Security alerts and login notifications"
            checked={preferences.account.email}
            onChange={() => handleToggle("account", "email")}
          />
          <NotificationOption
            label="Browser Notifications"
            description="Instant security alerts"
            checked={preferences.account.push}
            onChange={() => handleToggle("account", "push")}
          />
        </NotificationCategory>

        {/* Newsletter */}
        <NotificationCategory
          icon={<Mail className="w-5 h-5" />}
          title="Newsletter"
          description="Tech news, buying guides, and product reviews"
        >
          <NotificationOption
            label="Weekly Newsletter"
            description="Curated tech content every week"
            checked={preferences.newsletter.weekly}
            onChange={() => handleToggle("newsletter", "weekly")}
          />
        </NotificationCategory>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} disabled={!hasChanges}>
            Save Preferences
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
        </div>

        {/* Info Note */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Browser notifications require permission. Click "Allow" when prompted by your browser.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper Component for Category Section
const NotificationCategory = ({ icon, title, description, children }) => (
  <div className="space-y-3 p-4 border rounded-lg">
    <div className="flex items-center gap-2">
      <div className="text-primary">{icon}</div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="space-y-3 pl-7">{children}</div>
  </div>
);

// Helper Component for Individual Option
const NotificationOption = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <Label className="text-sm font-medium">{label}</Label>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

// Default preferences
function getDefaultPreferences() {
  return {
    orders: {
      email: true,
      push: true,
    },
    promotions: {
      email: true,
      push: false,
    },
    account: {
      email: true,
      push: true,
    },
    newsletter: {
      weekly: false,
    },
  };
}

export default NotificationSettings;
