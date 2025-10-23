import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Send,
  Sparkles,
  Bot,
  User,
  X,
  MessageCircle,
  GripVertical,
  Maximize2,
  Minimize2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function TechLightChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: "Hello! Welcome to TechLight. I'm your shopping assistant. How can I help you find the perfect gadget today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const messagesEndRef = useRef(null);
  const sidebarRef = useRef(null);

  // Apply margin to body when sidebar is open (but not in fullscreen)
  useEffect(() => {
    if (isOpen && !isFullscreen) {
      document.body.style.marginRight = `${sidebarWidth}px`;
      document.body.style.transition = "margin-right 0.3s ease";
    } else {
      document.body.style.marginRight = "0";
    }

    return () => {
      document.body.style.marginRight = "0";
      document.body.style.transition = "";
    };
  }, [isOpen, sidebarWidth, isFullscreen]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Help text animation
  useEffect(() => {
    if (!isOpen) {
      const timer = setInterval(() => {
        setShowHelp((prev) => !prev);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

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

  // Send message and connect to backend
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/ai/chat", {
        message: input,
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        text: res.data.reply || "Sorry, I couldn’t understand that.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 2,
        type: "ai",
        text: "Oops! Something went wrong connecting to the AI service.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          {/* Help Text Bubble */}
          {showHelp && (
            <div className="absolute bottom-full right-0 mb-3 mr-2 animate-bounce">
              <div className="bg-card border border-border shadow-lg rounded-2xl px-4 py-3 max-w-xs">
                <p className="text-sm text-foreground font-medium">
                  Need help? 👋
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ask me about products!
                </p>
              </div>
              <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-card" />
            </div>
          )}

          {/* Chat Icon Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="group relative w-16 h-16 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce"
            style={{ animationDuration: "3s" }}
          >
            <MessageCircle className="w-7 h-7 text-primary-foreground group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center">
              <span className="text-xs font-bold text-white">1</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
          </button>
        </div>
      )}

      {/* Sidebar Chat */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full bg-card border-l border-border shadow-2xl transition-all duration-300 z-[9998] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${
          isFullscreen ? "left-0 w-full" : ""
        }`}
        style={!isFullscreen ? { width: `${sidebarWidth}px` } : { width: "100%" }}
      >
        {/* Resize Handle - hidden in fullscreen */}
        {!isFullscreen && (
          <div
            onMouseDown={handleMouseDown}
            className={`absolute left-0 top-0 bottom-0 w-1 bg-border hover:bg-primary cursor-ew-resize group transition-colors ${
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
          {/* Header */}
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
                    <p className="text-xs text-primary-foreground/90">
                      Online now
                    </p>
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
                  onClick={() => {
                    setIsOpen(false);
                    setIsFullscreen(false);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-primary-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-background/30">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "ai" && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`flex flex-col ${
                      message.type === "user" ? "items-end" : "items-start"
                    } max-w-[75%]`}
                  >
                    <div
                      className={`px-3 py-2 rounded-2xl ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-card border border-border/50 text-foreground rounded-bl-sm shadow-sm"
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => (
                            <p className={`text-sm leading-relaxed mb-2 ${
                              message.type === "user" ? "text-primary-foreground" : "text-foreground"
                            }`}>
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className={`font-semibold ${
                              message.type === "user" ? "text-primary-foreground" : "text-foreground"
                            }`}>
                              {children}
                            </strong>
                          ),
                          code: ({ children }) => (
                            <code className={`px-1.5 py-0.5 rounded text-xs ${
                              message.type === "user"
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}>
                              {children}
                            </code>
                          ),
                          ul: ({ children }) => (
                            <ul className={`list-disc ml-4 space-y-1 ${
                              message.type === "user" ? "text-primary-foreground" : "text-foreground"
                            }`}>
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className={`list-decimal ml-4 space-y-1 ${
                              message.type === "user" ? "text-primary-foreground" : "text-foreground"
                            }`}>
                              {children}
                            </ol>
                          ),
                          table: ({ children }) => (
                            <table className={`border text-sm ${
                              message.type === "user"
                                ? "border-primary-foreground/30 text-primary-foreground"
                                : "border-border text-foreground"
                            }`}>
                              {children}
                            </table>
                          ),
                          th: ({ children }) => (
                            <th className={`border px-2 py-1 ${
                              message.type === "user"
                                ? "border-primary-foreground/30 bg-primary-foreground/10"
                                : "border-border bg-muted"
                            }`}>
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className={`border px-2 py-1 ${
                              message.type === "user" ? "border-primary-foreground/30" : "border-border"
                            }`}>
                              {children}
                            </td>
                          ),
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  {message.type === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-card border border-border/50 px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
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
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-11 h-11 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
