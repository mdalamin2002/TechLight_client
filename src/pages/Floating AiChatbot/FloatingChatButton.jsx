import React from "react";
import { Bot } from "lucide-react";

export default function FloatingChatButton({ isOpen, setIsOpen, showHelp }) {
  if (isOpen) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      {/* Help Text Bubble */}
      {showHelp && (
        <div className="absolute bottom-full right-full  animate-bounce">
          <div className="bg-card border border-border shadow-lg rounded-2xl px-4 py-3 w-64">
            <p className="text-sm text-foreground font-medium">Need help? 👋</p>
            <p className="text-xs text-muted-foreground mt-1">
              Ask me about products!
            </p>
          </div>
          <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-card" />
        </div>
      )}

      {/* Chat Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative w-16 h-16 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce"
        style={{ animationDuration: "3s" }}
      >
        <Bot
          className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform"
          strokeWidth={2.5}
        />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
          <span className="text-xs font-bold text-white">1</span>
        </div>
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
      </button>
    </div>
  );
}
