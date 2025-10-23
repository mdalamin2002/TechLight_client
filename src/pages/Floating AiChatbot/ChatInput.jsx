import React from "react";
import { Send } from "lucide-react";

export default function ChatInput({ input, setInput, onSend }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="px-6 py-4 bg-card border-t border-border/30 flex-shrink-0">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            rows="1"
            className="w-full px-3 py-2.5 bg-background border border-border/70 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 outline-none transition resize-none"
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
        </div>
        <button
          onClick={onSend}
          disabled={!input.trim()}
          className="w-11 h-11 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
