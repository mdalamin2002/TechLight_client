import React, { useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessagesArea({ messages, isTyping }) {
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
                      <p
                        className={`text-sm leading-relaxed mb-2 ${
                          message.type === "user"
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
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
                        className={`px-1.5 py-0.5 rounded text-xs ${
                          message.type === "user"
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
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
                        className={`border text-sm ${
                          message.type === "user"
                            ? "border-primary-foreground/30 text-primary-foreground"
                            : "border-border text-foreground"
                        }`}
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
  );
}
