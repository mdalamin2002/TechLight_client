import React from "react";
import { Send } from "lucide-react";

export default function ChatInput({ input, setInput, onSend, isFullscreen }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`bg-card border-t border-border/30 flex-shrink-0 ${
      isFullscreen ? "px-6 py-4 md:px-12 md:py-6" : "px-6 py-4"
    }`}>
      <div className={`flex gap-2 items-center ${isFullscreen ? "md:max-w-5xl md:mx-auto md:gap-3" : ""}`}>
        <div className="flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            rows="1"
            className={`w-full bg-background border border-border/70 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition resize-none ${
              isFullscreen ? "px-3 py-2.5 text-sm md:px-4 md:py-3 md:text-base" : "px-3 py-2.5 text-sm"
            }`}
            style={{ minHeight: isFullscreen ? "44px" : "44px", maxHeight: "120px" }}
          />
        </div>
        <button
          onClick={onSend}
          disabled={!input.trim()}
          className={`bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20 ${
            isFullscreen ? "min-w-[44px] min-h-[44px] w-11 h-11 md:min-w-[52px] md:min-h-[52px] md:w-[52px] md:h-[52px]" : "min-w-[44px] min-h-[44px] w-11 h-11"
          }`}
        >
          <Send className={`${isFullscreen ? "w-5 h-5 md:w-6 md:h-6" : "w-5 h-5"}`} />
        </button>
      </div>
    </div>
  );
}
