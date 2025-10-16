import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { toast } from "react-hot-toast";
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  MessageSquarePlus,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import SupportChatModal from "@/Components/Shared/SupportChatModal/SupportChatModal";

const MyConversationsPage = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Fetch user conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!userData?._id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosSecure.get(
          `/support/conversations/user/${userData._id}`
        );
        setConversations(response.data.conversations || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userData?._id, axiosSecure]);

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString();
    } else if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  // Get status color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case "open":
        return {
          color: "bg-green-500",
          icon: <MessageCircle className="w-4 h-4" />,
          label: "Open",
        };
      case "in-progress":
        return {
          color: "bg-blue-500",
          icon: <Clock className="w-4 h-4" />,
          label: "In Progress",
        };
      case "resolved":
        return {
          color: "bg-gray-500",
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: "Resolved",
        };
      case "closed":
        return {
          color: "bg-red-500",
          icon: <AlertCircle className="w-4 h-4" />,
          label: "Closed",
        };
      default:
        return {
          color: "bg-gray-500",
          icon: <MessageCircle className="w-4 h-4" />,
          label: status,
        };
    }
  };

  // Navigate to conversation
  const openConversation = (conversation) => {
    navigate(`/support-chat/${conversation._id}`, {
      state: { conversation },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-150px)] bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                My Support Conversations
              </h1>
              <p className="text-slate-600">
                View and manage your support tickets
              </p>
            </div>
            <Button
              onClick={() => setShowSupportModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>

        {/* Conversations List */}
        {conversations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No conversations yet
              </h3>
              <p className="text-slate-500 mb-6">
                Start a conversation with our support team
              </p>
              <Button
                onClick={() => setShowSupportModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <MessageSquarePlus className="w-4 h-4 mr-2" />
                Create Support Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => {
              const statusConfig = getStatusConfig(conversation.status);
              return (
                <Card
                  key={conversation._id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-l-4"
                  style={{ borderLeftColor: statusConfig.color.replace('bg-', '#') }}
                  onClick={() => openConversation(conversation)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">
                            {conversation.subject}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={`${statusConfig.color} text-white border-none flex items-center gap-1`}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span>Category: {conversation.category}</span>
                          <span>•</span>
                          <span>
                            ID: {conversation._id?.slice(-8).toUpperCase()}
                          </span>
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-50"
                      >
                        <ArrowRight className="w-5 h-5 text-blue-600" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          Last activity: {formatTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        Created: {new Date(conversation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Support Chat Modal */}
      <SupportChatModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
};

export default MyConversationsPage;
