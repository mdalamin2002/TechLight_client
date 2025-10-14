import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/ui/tabs";
import {
  Input
} from "@/Components/ui/input";
import {
  Label
} from "@/Components/ui/label";
import {
  Switch
} from "@/Components/ui/switch";
import {
  Button
} from "@/Components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/Components/ui/avatar";

import {
  Moon, Sun, Bell, UserCog, Lock, Trash
} from "lucide-react";

const UserSettings = () => {
  return (
    <section className="">
      <div className="bg-card p-6 md:p-10 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <UserCog className="w-6 h-6" />
          User Settings
        </h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="profile"><UserCog className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
            <TabsTrigger value="password"><Lock className="w-4 h-4 mr-2" /> Password</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
            <TabsTrigger value="appearance"><Sun className="w-4 h-4 mr-2" /> Theme</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Avatar</Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
              </div>
              <Button className="mt-4">Save Changes</Button>
            </div>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <Button className="mt-4">Update Password</Button>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-muted-foreground text-sm">Receive updates via email</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-muted-foreground text-sm">Allow browser notifications</p>
                </div>
                <Switch />
              </div>
              <Button className="mt-4">Save Preferences</Button>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Dark Mode</Label>
                <Switch
                  onCheckedChange={(checked) => {
                    document.documentElement.classList.toggle("dark", checked);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>System Theme</Label>
                <Switch
                  onCheckedChange={(checked) => {
                    // system theme logic (optional)
                    console.log("System theme toggle:", checked);
                  }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Danger Zone */}
        <div className="mt-10 border-t pt-6">
          <h3 className="text-xl font-semibold text-destructive mb-2">Danger Zone</h3>
          <p className="text-muted-foreground mb-4">Once deleted, your account cannot be recovered.</p>
          <Button variant="destructive" className="flex items-center gap-2">
            <Trash className="w-4 h-4" />
            Delete Account
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UserSettings;
