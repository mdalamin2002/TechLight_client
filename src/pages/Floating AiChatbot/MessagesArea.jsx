import React, { useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessagesArea({ messages, isTyping, isFullscreen }) {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={`flex-1 overflow-y-auto bg-background/30 ${
      isFullscreen ? "px-6 py-4 md:px-12 md:py-8" : "px-6 py-4"
    }`}>
      <div className={`space-y-4 ${isFullscreen ? "md:max-w-5xl md:mx-auto md:space-y-6" : ""}`}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${
              message.type === "user" ? "justify-end" : "justify-start"
            } ${isFullscreen ? "md:gap-3" : ""}`}
          >
            {message.type === "ai" && (
              <div className={`rounded-lg bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center flex-shrink-0 ${
                isFullscreen ? "w-7 h-7 md:w-9 md:h-9" : "w-7 h-7"
              }`}>
                <Bot className={`text-primary-foreground ${isFullscreen ? "w-4 h-4 md:w-5 md:h-5" : "w-4 h-4"}`} />
              </div>
            )}
            <div
              className={`flex flex-col ${
                message.type === "user" ? "items-end" : "items-start"
              } max-w-[75%]`}
            >
              <div
                className={`rounded-2xl ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border/50 text-foreground rounded-bl-sm shadow-sm"
                } ${isFullscreen ? "px-3 py-2 md:px-5 md:py-3" : "px-3 py-2"}`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p
                        className={`leading-relaxed mb-2 ${
                          message.type === "user"
                            ? "text-primary-foreground"
                            : "text-foreground"
                        } ${isFullscreen ? "text-sm md:text-base" : "text-sm"}`}
                      >
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong
                        className={`font-semibold ${
                          message.type === "user"
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {children}
                      </strong>
                    ),
                    code: ({ children }) => (
                      <code
                        className={`px-1.5 py-0.5 rounded ${
                          message.type === "user"
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-foreground"
                        } ${isFullscreen ? "text-xs md:text-sm" : "text-xs"}`}
                      >
                        {children}
                      </code>
                    ),
                    ul: ({ children }) => (
                      <ul
                        className={`list-disc ml-4 space-y-1 ${
                          message.type === "user"
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol
                        className={`list-decimal ml-4 space-y-1 ${
                          message.type === "user"
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {children}
                      </ol>
                    ),
                    table: ({ children }) => (
                      <table
                        className={`border ${
                          message.type === "user"
                            ? "border-primary-foreground/30 text-primary-foreground"
                            : "border-border text-foreground"
                        } ${isFullscreen ? "text-sm md:text-base" : "text-sm"}`}
                      >
                        {children}
                      </table>
                    ),
                    th: ({ children }) => (
                      <th
                        className={`border px-2 py-1 ${
                          message.type === "user"
                            ? "border-primary-foreground/30 bg-primary-foreground/10"
                            : "border-border bg-muted"
                        }`}
                      >
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td
                        className={`border px-2 py-1 ${
                          message.type === "user"
                            ? "border-primary-foreground/30"
                            : "border-border"
                        }`}
                      >
                        {children}
                      </td>
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
              <span className={`text-muted-foreground mt-1 ${isFullscreen ? "text-xs md:text-sm" : "text-xs"}`}>
                {formatTime(message.timestamp)}
              </span>
            </div>
            {message.type === "user" && (
              <div className={`rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0 ${
                isFullscreen ? "w-7 h-7 md:w-9 md:h-9" : "w-7 h-7"
              }`}>
                <User className={`text-white ${isFullscreen ? "w-4 h-4 md:w-5 md:h-5" : "w-4 h-4"}`} />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className={`flex justify-start ${isFullscreen ? "gap-2 md:gap-3" : "gap-2"}`}>
            <div className={`rounded-lg bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center flex-shrink-0 ${
              isFullscreen ? "w-7 h-7 md:w-9 md:h-9" : "w-7 h-7"
            }`}>
              <Bot className={`text-primary-foreground ${isFullscreen ? "w-4 h-4 md:w-5 md:h-5" : "w-4 h-4"}`} />
            </div>
            <div className={`bg-card border border-border/50 rounded-2xl rounded-bl-sm shadow-sm ${
              isFullscreen ? "px-3 py-2 md:px-5 md:py-3" : "px-3 py-2"
            }`}>
              <div className="flex gap-1">
                <div
                  className={`rounded-full bg-muted-foreground/40 animate-bounce ${
                    isFullscreen ? "w-2 h-2 md:w-2.5 md:h-2.5" : "w-2 h-2"
                  }`}
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className={`rounded-full bg-muted-foreground/40 animate-bounce ${
                    isFullscreen ? "w-2 h-2 md:w-2.5 md:h-2.5" : "w-2 h-2"
                  }`}
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className={`rounded-full bg-muted-foreground/40 animate-bounce ${
                    isFullscreen ? "w-2 h-2 md:w-2.5 md:h-2.5" : "w-2 h-2"
                  }`}
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
