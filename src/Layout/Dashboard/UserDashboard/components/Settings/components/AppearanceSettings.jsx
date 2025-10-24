import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Button } from "@/Components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import { toast } from "react-toastify";

const AppearanceSettings = () => {
  const { theme, systemTheme, setTheme, enableSystemTheme, isDark } = useTheme();

  const handleSystemThemeToggle = (checked) => {
    enableSystemTheme(checked);
    toast.success(checked ? "Using system theme" : "Using manual theme");
  };

  const handleManualThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(`${newTheme === "dark" ? "Dark" : "Light"} mode enabled`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          Appearance
        </CardTitle>
        <CardDescription>
          Customize how TechLight looks on your device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Theme Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Monitor className="w-5 h-5 text-muted-foreground" />
            <div>
              <Label className="text-base">Use System Theme</Label>
              <p className="text-sm text-muted-foreground">
                Automatically switch between light and dark mode based on your system settings
              </p>
            </div>
          </div>
          <Switch
            checked={systemTheme}
            onCheckedChange={handleSystemThemeToggle}
          />
        </div>

        {/* Manual Theme Selection */}
        {!systemTheme && (
          <div className="space-y-3">
            <Label className="text-base">Choose Theme</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="h-auto py-4 flex-col gap-2"
                onClick={() => handleManualThemeChange("light")}
              >
                <Sun className="w-6 h-6" />
                <span>Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="h-auto py-4 flex-col gap-2"
                onClick={() => handleManualThemeChange("dark")}
              >
                <Moon className="w-6 h-6" />
                <span>Dark</span>
              </Button>
            </div>
          </div>
        )}

        {/* Current Theme Info */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Current theme: <span className="font-medium text-foreground">
              {systemTheme ? "System (" + (isDark ? "Dark" : "Light") + ")" : (theme === "dark" ? "Dark" : "Light")}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
