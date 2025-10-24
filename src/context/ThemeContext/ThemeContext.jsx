import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem("theme");
    if (stored && (stored === "light" || stored === "dark")) {
      return stored;
    }
    
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    
    return "light";
  });

  const [systemTheme, setSystemTheme] = useState(() => {
    const stored = localStorage.getItem("useSystemTheme");
    return stored === "true";
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (systemTheme) {
      // Use system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      // Use manual theme
      root.classList.toggle("dark", theme === "dark");
    }
  }, [theme, systemTheme]);

  // Listen to system theme changes
  useEffect(() => {
    if (!systemTheme) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [systemTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    setSystemTheme(false);
    localStorage.setItem("useSystemTheme", "false");
  };

  const setManualTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    setSystemTheme(false);
    localStorage.setItem("useSystemTheme", "false");
  };

  const enableSystemTheme = (enabled) => {
    setSystemTheme(enabled);
    localStorage.setItem("useSystemTheme", String(enabled));
    
    if (enabled) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  };

  const value = {
    theme,
    systemTheme,
    toggleTheme,
    setTheme: setManualTheme,
    enableSystemTheme,
    isDark: systemTheme 
      ? window.matchMedia("(prefers-color-scheme: dark)").matches 
      : theme === "dark",
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
