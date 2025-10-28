import React, { useRef, useEffect } from "react";
import { GripVertical } from "lucide-react";
import ChatHeader from "./ChatHeader";
import MessagesArea from "./MessagesArea";
import ChatInput from "./ChatInput";

export default function ChatSidebar({
  isOpen,
  isFullscreen,
  setIsFullscreen,
  messages,
  isTyping,
  input,
  setInput,
  onSend,
  onClose,
  sidebarWidth,
  setSidebarWidth,
  onSupportClick,
}) {
  const [isResizing, setIsResizing] = React.useState(false);
  const sidebarRef = useRef(null);

  // Resize functionality
  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      // Min width 350px, max width 800px
      setSidebarWidth(Math.max(350, Math.min(newWidth, 800)));
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 h-full bg-card border-l border-border shadow-2xl transition-all duration-300 z-[9998] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } ${isFullscreen ? "left-0 w-full" : "w-full md:w-auto"}`}
      style={!isFullscreen && typeof window !== 'undefined' && window.innerWidth >= 768 ? { width: `${sidebarWidth}px` } : {}}
    >
      {/* Resize Handle - hidden in fullscreen and on mobile */}
      {!isFullscreen && (
        <div
          onMouseDown={handleMouseDown}
          className={`hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-border hover:bg-primary cursor-ew-resize group transition-colors ${
            isResizing ? "bg-primary" : ""
          }`}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-12 bg-muted/50 group-hover:bg-primary/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
          </div>
        </div>
      )}

      {/* Sidebar Content */}
      <div className="h-full flex flex-col">
        <ChatHeader
          isFullscreen={isFullscreen}
          setIsFullscreen={setIsFullscreen}
          onClose={onClose}
          onSupportClick={onSupportClick}
        />

        <MessagesArea messages={messages} isTyping={isTyping} isFullscreen={isFullscreen} />

        <ChatInput input={input} setInput={setInput} onSend={onSend} isFullscreen={isFullscreen} />
      </div>
    </div>
  );
}
