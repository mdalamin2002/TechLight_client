import React from "react";
import { Bot, X, Maximize2, Minimize2, MessageCircle } from "lucide-react";

export default function ChatHeader({ isFullscreen, setIsFullscreen, onClose, onSupportClick }) {
  return (
    <div className={`bg-gradient-to-r from-primary via-primary/90 to-primary/80 flex-shrink-0 ${
      isFullscreen ? "px-6 py-4 md:px-12 md:py-6" : "px-6 py-4"
    }`}>
      <div className={`flex items-center justify-between ${isFullscreen ? "md:max-w-5xl md:mx-auto" : ""}`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ${
            isFullscreen ? "w-10 h-10 md:w-12 md:h-12" : "w-10 h-10"
          }`}>
            <Bot className={`text-primary-foreground ${isFullscreen ? "w-5 h-5 md:w-6 md:h-6" : "w-5 h-5"}`} />
          </div>
          <div>
            <h3 className={`font-semibold text-primary-foreground flex items-center gap-2 ${
              isFullscreen ? "text-base md:text-lg" : "text-base"
            }`}>
              TechLight Assistant
              <span className={`bg-white/20 rounded-full ${
                isFullscreen ? "px-2 py-0.5 md:px-3 md:py-1 text-xs" : "px-2 py-0.5 text-xs"
              }`}>
                BETA
              </span>
            </h3>
            <div className="flex items-center gap-1.5">
              <div className={`rounded-full bg-emerald-400 animate-pulse ${
                isFullscreen ? "w-1.5 h-1.5 md:w-2 md:h-2" : "w-1.5 h-1.5"
              }`} />
              <p className={`text-primary-foreground/90 ${isFullscreen ? "text-xs md:text-sm" : "text-xs"}`}>
                Online now
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onSupportClick && (
            <button
              onClick={onSupportClick}
              className={`hover:bg-white/10 rounded-lg transition flex items-center gap-2 ${isFullscreen ? "px-3 py-2 md:px-4 md:py-2.5" : "px-3 py-2"}`}
              title="Contact Support"
            >
              <MessageCircle className={`text-primary-foreground ${isFullscreen ? "w-4 h-4 md:w-5 md:h-5" : "w-4 h-4"}`} />
              <span className={`text-primary-foreground font-medium ${isFullscreen ? "text-xs md:text-sm" : "text-xs hidden sm:inline"}`}>
                Support
              </span>
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`hover:bg-white/10 rounded-lg transition ${isFullscreen ? "p-2 md:p-3" : "p-2"}`}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className={`text-primary-foreground ${isFullscreen ? "w-5 h-5 md:w-6 md:h-6" : "w-5 h-5"}`} />
            ) : (
              <Maximize2 className="w-5 h-5 text-primary-foreground" />
            )}
          </button>
          <button
            onClick={onClose}
            className={`hover:bg-white/10 rounded-lg transition ${isFullscreen ? "p-2 md:p-3" : "p-2"}`}
          >
            <X className={`text-primary-foreground ${isFullscreen ? "w-5 h-5 md:w-6 md:h-6" : "w-5 h-5"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
