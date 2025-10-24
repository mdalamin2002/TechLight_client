import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { Globe, Shield, Download, Eye, MapPin } from "lucide-react";
import { toast } from "react-toastify";

const PrivacySettings = () => {
  const [language, setLanguage] = useState(() => localStorage.getItem("preferredLanguage") || "en");
  const [currency, setCurrency] = useState(() => localStorage.getItem("preferredCurrency") || "USD");
  const [profileVisibility, setProfileVisibility] = useState(() => 
    localStorage.getItem("profileVisibility") !== "false"
  );
  const [showOrderHistory, setShowOrderHistory] = useState(() => 
    localStorage.getItem("showOrderHistory") !== "false"
  );

  const handleLanguageChange = (value) => {
    setLanguage(value);
    localStorage.setItem("preferredLanguage", value);
    toast.success(`Language changed to ${LANGUAGES.find(l => l.value === value)?.label}`);
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    localStorage.setItem("preferredCurrency", value);
    toast.success(`Currency changed to ${value}`);
  };

  const handleProfileVisibilityToggle = (checked) => {
    setProfileVisibility(checked);
    localStorage.setItem("profileVisibility", String(checked));
    toast.success(checked ? "Profile is now public" : "Profile is now private");
  };

  const handleOrderHistoryToggle = (checked) => {
    setShowOrderHistory(checked);
    localStorage.setItem("showOrderHistory", String(checked));
    toast.success(checked ? "Order history visible" : "Order history hidden");
  };

  const handleDownloadData = () => {
    toast.info("Preparing your data... This may take a few minutes.");
    // TODO: Implement actual data download when backend API is ready
    // await axiosSecure.get('/users/data-export');
  };

  return (
    <div className="space-y-6">
      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Language & Region
          </CardTitle>
          <CardDescription>
            Set your preferred language and currency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy Controls
          </CardTitle>
          <CardDescription>
            Manage your profile visibility and data sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-base">Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Allow other users to view your profile
                </p>
              </div>
            </div>
            <Switch
              checked={profileVisibility}
              onCheckedChange={handleProfileVisibilityToggle}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-base">Show Order History</Label>
                <p className="text-sm text-muted-foreground">
                  Display your purchase history on your profile
                </p>
              </div>
            </div>
            <Switch
              checked={showOrderHistory}
              onCheckedChange={handleOrderHistoryToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Download or manage your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Download Your Data</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Request a copy of your personal information, orders, and account activity. 
              You'll receive a download link via email within 24-48 hours.
            </p>
            <Button variant="outline" onClick={handleDownloadData}>
              <Download className="w-4 h-4 mr-2" />
              Request Data Export
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Data Retention</h3>
            <p className="text-sm text-muted-foreground">
              We retain your data for as long as your account is active. 
              You can request account deletion from the Account section below.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Language options
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
  { value: "ar", label: "العربية" },
];

// Currency options
const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "INR", label: "INR - Indian Rupee" },
];

export default PrivacySettings;
