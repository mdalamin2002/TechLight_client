import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Settings, Lock, Bell, Palette, Shield, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import PasswordSettings from "./components/PasswordSettings";
import NotificationSettings from "./components/NotificationSettings";
import AppearanceSettings from "./components/AppearanceSettings";
import PrivacySettings from "./components/PrivacySettings";
import AccountManagement from "./components/AccountManagement";

const UserSettings = () => {
  return (
    <section className=" mx-auto">
      <div className="bg-card p-6 md:p-8 rounded-xl shadow-md space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Settings className="w-7 h-7" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Profile Quick Link */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserIcon className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-medium">Profile Information</h3>
                <p className="text-sm text-muted-foreground">
                  Update your name, photo, and contact details
                </p>
              </div>
            </div>
            <Link to="/dashboard/my-profile">
              <span className="text-sm font-medium text-primary hover:underline">
                Go to Profile →
              </span>
            </Link>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-6">
            <TabsTrigger value="password">
              <Lock className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Password</span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="col-span-2 md:col-span-1">
              <UserIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          {/* Password Tab */}
          <TabsContent value="password">
            <PasswordSettings />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <PrivacySettings />
          </TabsContent>

          {/* Account Management Tab */}
          <TabsContent value="account">
            <AccountManagement />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default UserSettings;
