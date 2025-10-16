import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSocket } from "@/context/AuthContext/SocketContext/SocketContext";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import {ArrowLeft,Send,Paperclip,Image as ImageIcon,Smile,MoreVertical,X,CheckCheck,Clock,Phone,Video,Info,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import useAxiosSecure from "@/utils/useAxiosSecure";

const SupportChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();
  const { user,userData } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [conversation, setConversation] = useState(location.state?.conversation || null);


  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [supportAgent, setSupportAgent] = useState(null);

  console.log(messages);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversation details if not available
  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversation) {
        try {
          const response = await axiosSecure.get(
            `/support/conversations/${conversationId}`
          );
          setConversation(response.data.conversation);
        } catch (error) {
          console.error("Error fetching conversation:", error);
          toast.error("Failed to load conversation");
          navigate("/");
        }
      }
    };

    fetchConversation();
  }, [conversationId, conversation, navigate]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosSecure.get(
          `/support/messages/${conversationId}`
        );
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  // Socket.IO real-time messaging
  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join conversation room
    socket.emit("join_support_conversation", { conversationId });

    // Listen for new messages
    socket.on("new_support_message", (message) => {
      if (message.conversationId === conversationId) {
        // Check if message already exists in the list to avoid duplicates
        setMessages((prev) => {
          const messageExists = prev.some(
            (msg) => msg._id && message._id && msg._id.toString() === message._id.toString()
          );
          if (messageExists) {
            return prev;
          }
          return [...prev, message];
        });
        
        // If message from support agent, update agent info
        if (message.senderRole !== "user") {
          setSupportAgent({
            name: message.senderName,
            role: message.senderRole,
          });
        }
      }
    });

    // Listen for typing indicator
    socket.on("support_typing", ({ conversationId: typingConvId, isTyping }) => {
      if (typingConvId === conversationId) {
        setTyping(isTyping);
      }
    });

    // Listen for conversation status updates
    socket.on("conversation_status_updated", ({ conversationId: updatedConvId, status }) => {
      if (updatedConvId === conversationId) {
        setConversation((prev) => ({ ...prev, status }));
      }
    });

    return () => {
      socket.emit("leave_support_conversation", { conversationId });
      socket.off("new_support_message");
      socket.off("support_typing");
      socket.off("conversation_status_updated");
    };
  }, [socket, conversationId]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!socket) return;

    socket.emit("support_user_typing", {
      conversationId,
      isTyping: true,
      userName: conversation?.userName || user?.displayName,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("support_user_typing", {
        conversationId,
        isTyping: false,
        userName: conversation?.userName || user?.displayName,
      });
    }, 2000);
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    setSending(true);

    try {
      const messageData = {
        conversationId,
        senderId: userData?._id || "guest",
        senderName: conversation?.userName || user?.displayName || "Guest",
        senderRole: userData?.role||"user",
        message: newMessage.trim(),
      };

      const response = await axiosSecure.post(
        "/support/messages",
        messageData
      );

      if (response.data.success) {
        // Clear the input immediately for better UX
        setNewMessage("");
        inputRef.current?.focus();

        // Stop typing indicator
        if (socket) {
          socket.emit("support_user_typing", {
            conversationId,
            isTyping: false,
            userName: conversation?.userName || user?.displayName,
          });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return date.toLocaleDateString();
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "resolved":
        return "bg-gray-500";
      case "closed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" container mx-auto flex flex-col min-h-[calc(100vh-150px)] shadow-sm">
      {/* Header */}
      <header className="bg-white shadow-sm">
      <div className="border-b border-slate-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-blue-500">
                  <AvatarImage src="/support-avatar.png" alt="Support" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                    {supportAgent?.name?.[0] || "CS"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="font-semibold text-slate-800">
                    {supportAgent?.name || "Customer Support"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(conversation?.status)} text-white border-none text-xs`}
                    >
                      {conversation?.status || "Open"}
                    </Badge>
                    {typing && (
                      <span className="text-xs text-blue-600 flex items-center gap-1">
                        <span className="flex gap-1">
                          <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                        Typing...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                <Info className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Conversation Info Card */}
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-800">{conversation?.subject}</h3>
              <p className="text-sm text-slate-600 mt-1">
                Category: <span className="font-medium">{conversation?.category}</span>
              </p>
            </div>
            <div className="text-sm text-slate-600">
              <p>Ticket ID: <span className="font-mono font-medium">{conversationId?.slice(-8).toUpperCase()}</span></p>
              <p>Created: {conversation?.createdAt ? new Date(conversation.createdAt).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="mt-5 flex-1 overflow-y-auto container mx-auto px-4 pb-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No messages yet</h3>
              <p className="text-slate-500">Start the conversation by sending a message below</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isUser = msg.senderRole === "user";
              return (
                <div
                  key={msg._id || index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
                >
                  <div className={`flex gap-3 max-w-[70%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className={`w-10 h-10 ${isUser ? "" : "border-2 border-blue-500"}`}>
                      <AvatarFallback
                        className={`${
                          isUser
                            ? "bg-gradient-to-br from-slate-500 to-slate-700"
                            : "bg-gradient-to-br from-blue-500 to-indigo-600"
                        } text-white text-sm font-semibold`}
                      >
                        {msg.senderName?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          isUser
                            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                            : "bg-white border border-slate-200 text-slate-800"
                        } shadow-sm`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-xs text-slate-500">
                          {formatTime(msg.timestamp || msg.createdAt)}
                        </span>
                        {isUser && msg.status && (
                          <CheckCheck className={`w-3 h-3 ${msg.status === "read" ? "text-blue-500" : "text-slate-400"}`} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-slate-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    className="pr-12 py-6 rounded-xl border-2 border-slate-200 focus:border-blue-500 transition-all"
                    disabled={sending || conversation?.status === "closed"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-slate-100"
                  >
                    <Smile className="w-5 h-5 text-slate-400" />
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!newMessage.trim() || sending || conversation?.status === "closed"}
                className="px-6 py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>

            {conversation?.status === "closed" && (
              <p className="text-center text-sm text-red-500 mt-2">
                This conversation has been closed. Please create a new support request if you need further assistance.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportChatPage;
