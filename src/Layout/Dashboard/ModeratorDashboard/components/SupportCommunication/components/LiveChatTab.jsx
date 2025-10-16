import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/AuthContext/SocketContext/SocketContext";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  MessageCircle,
  Send,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Card } from "@/Components/ui/card";

const LiveChatTab = () => {
  const socket = useSocket();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all conversations
  useEffect(() => {
    fetchConversations();
  }, [statusFilter]);

  // Join support team room
  useEffect(() => {
    if (socket && user) {
      socket.emit("join_support_team", {
        userId: user.uid,
        role: "moderator", // or "admin"
      });
    }

    return () => {
      if (socket) {
        // Clean up
      }
    };
  }, [socket, user]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for new conversations
    socket.on("new_support_conversation", (conversation) => {
      setConversations((prev) => [conversation, ...prev]);
      toast.success(`New support request from ${conversation.userName}`);
    });

    // Listen for new messages from users
    socket.on("new_user_message", ({ conversationId, message, conversation }) => {
      if (selectedConversation?._id === conversationId) {
        setMessages((prev) => {
          const messageExists = prev.some(
            (msg) => msg._id && message._id && msg._id.toString() === message._id.toString()
          );
          if (messageExists) {
            return prev;
          }
          return [...prev, message];
        });
      }

      // Update conversation's last message time
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId
            ? { ...conv, lastMessageAt: new Date() }
            : conv
        )
      );

      // Show notification if not the selected conversation
      if (selectedConversation?._id !== conversationId) {
        toast.info(`New message from ${conversation.userName}`);
      }
    });

    // Listen for all support messages (including moderator's own messages)
    socket.on("new_support_message", (message) => {
      if (selectedConversation?._id === message.conversationId) {
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some(
            (msg) => msg._id && message._id && msg._id.toString() === message._id.toString()
          );
          if (messageExists) {
            return prev;
          }
          return [...prev, message];
        });
      }

      // Update conversation's last message time
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === message.conversationId
            ? { ...conv, lastMessageAt: new Date() }
            : conv
        )
      );
    });

    // Listen for typing indicator
    socket.on("support_typing", ({ conversationId, userName }) => {
      if (selectedConversation?._id === conversationId) {
        // Handle typing indicator UI
        console.log(`${userName} is typing...`);
      }
    });

    return () => {
      socket.off("new_support_conversation");
      socket.off("new_user_message");
      socket.off("new_support_message");
      socket.off("support_typing");
    };
  }, [socket, selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      const response = await axios.get("http://localhost:5000/api/support/conversations/allConversations", {
        params,
      });
      console.log(response);
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/support/messages/${conversationId}`
      );
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);

    // Join conversation room
    if (socket) {
      socket.emit("join_support_conversation", {
        conversationId: conversation._id,
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);

    try {
      const messageData = {
        conversationId: selectedConversation._id,
        senderId: user?.uid,
        senderName: user?.displayName || "Moderator",
        senderRole: "moderator",
        message: newMessage.trim(),
      };

      const response = await axios.post(
        "http://localhost:5000/api/support/messages",
        messageData
      );

      if (response.data.success) {
        // Clear the input immediately for better UX
        setNewMessage("");
        
        // Stop typing indicator
        if (socket) {
          socket.emit("support_agent_typing", {
            conversationId: selectedConversation._id,
            isTyping: false,
            agentName: user?.displayName,
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

  const handleTyping = () => {
    if (!socket || !selectedConversation) return;

    socket.emit("support_agent_typing", {
      conversationId: selectedConversation._id,
      isTyping: true,
      agentName: user?.displayName,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("support_agent_typing", {
        conversationId: selectedConversation._id,
        isTyping: false,
        agentName: user?.displayName,
      });
    }, 2000);
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedConversation) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/support/conversations/${selectedConversation._id}`,
        { status: newStatus }
      );

      setSelectedConversation((prev) => ({ ...prev, status: newStatus }));
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === selectedConversation._id ? { ...conv, status: newStatus } : conv
        )
      );

      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

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

  const getCategoryColor = (category) => {
    const colors = {
      technical: "bg-purple-100 text-purple-700",
      billing: "bg-yellow-100 text-yellow-700",
      order: "bg-blue-100 text-blue-700",
      account: "bg-green-100 text-green-700",
      product: "bg-pink-100 text-pink-700",
      other: "bg-gray-100 text-gray-700",
    };
    return colors[category] || colors.other;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <div className="col-span-4 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm">
        {/* Search and Filter */}
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-4">
              <MessageCircle className="w-12 h-12 mb-2" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => handleConversationClick(conv)}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${
                  selectedConversation?._id === conv._id
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                      {conv.userName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-slate-800 truncate">
                        {conv.userName}
                      </h4>
                      <span className="text-xs text-slate-500">
                        {formatTime(conv.lastMessageAt || conv.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 truncate mb-2">
                      {conv.subject}
                    </p>

                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(conv.status)} text-white text-xs`}>
                        {conv.status}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(conv.category)}`}>
                        {conv.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="col-span-8 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {selectedConversation.userName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {selectedConversation.userName}
                    </h3>
                    <p className="text-sm text-slate-500">{selectedConversation.userEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={selectedConversation.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Conversation Details */}
              <Card className="mt-4 p-3 bg-slate-50">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Tag className="w-4 h-4" />
                    <span>Category: <strong>{selectedConversation.category}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedConversation.createdAt).toLocaleDateString()}</span>
                  </div>
                  {selectedConversation.userPhone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{selectedConversation.userPhone}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isModerator = msg.senderRole !== "user";
                  return (
                    <div
                      key={msg._id || index}
                      className={`flex ${isModerator ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex gap-3 max-w-[70%] ${isModerator ? "flex-row-reverse" : "flex-row"}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback
                            className={`${
                              isModerator
                                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                                : "bg-gradient-to-br from-blue-500 to-indigo-600"
                            } text-white text-xs`}
                          >
                            {msg.senderName[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              isModerator
                                ? "bg-gradient-to-br from-green-600 to-emerald-600 text-white"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                          </div>
                          <span className="text-xs text-slate-500 mt-1 px-1">
                            {formatTime(msg.timestamp || msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  className="resize-none"
                  rows={3}
                  disabled={selectedConversation.status === "closed"}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || sending || selectedConversation.status === "closed"}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <MessageCircle className="w-16 h-16 mb-4" />
            <p className="text-lg">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChatTab;
