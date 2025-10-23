import React from "react";
import { Bot, X, Maximize2, Minimize2 } from "lucide-react";

export default function ChatHeader({ isFullscreen, setIsFullscreen, onClose }) {
  return (
    <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground flex items-center gap-2">
              TechLight Assistant
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                BETA
              </span>
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-primary-foreground/90">Online now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-primary-foreground" />
            ) : (
              <Maximize2 className="w-5 h-5 text-primary-foreground" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
