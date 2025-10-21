import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "@/utils/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  RefreshCw,
  ArrowRight,
  Loader2,
  Users,
  MessageSquare,
  Activity,
  TrendingUp,
  UserCheck,
  BarChart3,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

const SupportManagement = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { userData } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("conversations");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      setRefreshing(true);
      const response = await axiosSecure.get(
        `/support/conversations/allConversations`
      );
      const allConvs = response.data.conversations || [];
      setConversations(allConvs);
      
      // Calculate stats
      setStats({
        total: allConvs.length,
        open: allConvs.filter((c) => c.status === "open").length,
        inProgress: allConvs.filter((c) => c.status === "in-progress").length,
        resolved: allConvs.filter((c) => c.status === "resolved").length,
        closed: allConvs.filter((c) => c.status === "closed").length,
      });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch all messages
  const fetchAllMessages = async () => {
    try {
      const messagesData = [];
      for (const conv of conversations) {
        const response = await axiosSecure.get(
          `/support/messages/${conv._id}`
        );
        if (response.data.messages) {
          messagesData.push(
            ...response.data.messages.map((msg) => ({
              ...msg,
              conversationSubject: conv.subject,
              conversationStatus: conv.status,
            }))
          );
        }
      }
      setAllMessages(messagesData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeTab === "messages" && conversations.length > 0) {
      fetchAllMessages();
    }
  }, [activeTab, conversations]);

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

  // Get status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case "open":
        return {
          color: "bg-green-500",
          bgLight: "bg-green-50",
          textColor: "text-green-700",
          icon: <MessageCircle className="w-4 h-4" />,
          label: "Open",
        };
      case "in-progress":
        return {
          color: "bg-blue-500",
          bgLight: "bg-blue-50",
          textColor: "text-blue-700",
          icon: <Clock className="w-4 h-4" />,
          label: "In Progress",
        };
      case "resolved":
        return {
          color: "bg-gray-500",
          bgLight: "bg-gray-50",
          textColor: "text-gray-700",
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: "Resolved",
        };
      case "closed":
        return {
          color: "bg-red-500",
          bgLight: "bg-red-50",
          textColor: "text-red-700",
          icon: <XCircle className="w-4 h-4" />,
          label: "Closed",
        };
      default:
        return {
          color: "bg-gray-500",
          bgLight: "bg-gray-50",
          textColor: "text-gray-700",
          icon: <MessageCircle className="w-4 h-4" />,
          label: status,
        };
    }
  };

  // Handle status update
    const handleStatusUpdate = async (conversationId, newStatus) => {
      console.log(newStatus,conversationId);
    try {
      const response = await axiosSecure.patch(
        `/support/conversations/${conversationId}`,
        { 
          status: newStatus,
          userRole: userData?.role || "admin" // Send user role for backend validation
        }
      );

      if (response.data.success) {
        toast.success(`Status updated to ${newStatus}`);
        fetchConversations();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Navigate to conversation
  const openConversation = (conversation) => {
    navigate(`/support-chat/${conversation._id}`, {
      state: { conversation },
    });
  };

  // Filter conversations
  const filteredConversations = statusFilter === "all" 
    ? conversations 
    : conversations.filter((c) => c.status === statusFilter);

  // Group conversations by moderator
  const conversationsByModerator = conversations.reduce((acc, conv) => {
    if (conv.assignedToName) {
      if (!acc[conv.assignedToName]) {
        acc[conv.assignedToName] = {
          moderatorName: conv.assignedToName,
          moderatorRole: conv.assignedToRole,
          conversations: [],
        };
      }
      acc[conv.assignedToName].conversations.push(conv);
    }
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading support management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Support Management
          </h1>
          <p className="text-slate-600 mt-1">
            Monitor and manage all customer support conversations
          </p>
        </div>
        <Button
          onClick={fetchConversations}
          variant="outline"
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-slate-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Chats
              </CardTitle>
              <Activity className="w-5 h-5 text-slate-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-600">
                Open
              </CardTitle>
              <MessageCircle className="w-5 h-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{stats.open}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-600">
                In Progress
              </CardTitle>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Resolved
              </CardTitle>
              <CheckCircle2 className="w-5 h-5 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">{stats.resolved}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-red-600">
                Closed
              </CardTitle>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{stats.closed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white p-1">
          <TabsTrigger value="conversations" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            All Messages
          </TabsTrigger>
          <TabsTrigger value="moderators" className="gap-2">
            <Users className="w-4 h-4" />
            Moderator Assignments
          </TabsTrigger>
        </TabsList>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
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
            </CardHeader>
            <CardContent>
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    No conversations found
                  </h3>
                  <p className="text-slate-500">
                    No conversations match the selected filter
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredConversations.map((conversation) => {
                    const statusConfig = getStatusConfig(conversation.status);
                    return (
                      <div
                        key={conversation._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-all bg-white border-l-4"
                        style={{ borderLeftColor: statusConfig.color.replace("bg-", "#") }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-800">
                                {conversation.subject}
                              </h3>
                              <Badge
                                className={`${statusConfig.color} text-white border-none flex items-center gap-1`}
                              >
                                {statusConfig.icon}
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {conversation.userName}
                              </span>
                              <span>•</span>
                              <span className="capitalize">{conversation.category}</span>
                              <span>•</span>
                              <span>ID: {conversation._id?.slice(-8).toUpperCase()}</span>
                            </div>
                            {conversation.assignedToName && (
                              <div className="flex items-center gap-2 text-sm">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <UserCheck className="w-3 h-3" />
                                  Handled by: {conversation.assignedToName} ({conversation.assignedToRole})
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(conversation.lastMessageAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {userData?.role === "admin" && (
                                <Select
                                  value={conversation.status}
                                  onValueChange={(value) =>
                                    handleStatusUpdate(conversation._id, value)
                                  }
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                              <Button
                                onClick={() => openConversation(conversation)}
                                size="sm"
                              >
                                View Chat
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Messages Tab */}
        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Messages Timeline</CardTitle>
              <CardDescription>
                View all messages across all conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Conversation</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500">No messages found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    allMessages.map((msg, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50">
                        <TableCell className="whitespace-nowrap">
                          {formatTime(msg.timestamp)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {msg.conversationSubject}
                        </TableCell>
                        <TableCell>{msg.senderName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {msg.senderRole}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {msg.message}
                        </TableCell>
                        <TableCell>
                          {getStatusConfig(msg.conversationStatus).icon}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Moderator Assignments Tab */}
        <TabsContent value="moderators" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Moderator Assignments</CardTitle>
              <CardDescription>
                View which moderators are handling which conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(conversationsByModerator).length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    No assignments yet
                  </h3>
                  <p className="text-slate-500">
                    Conversations will appear here once moderators engage
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.values(conversationsByModerator).map((moderator, idx) => (
                    <div key={idx} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                          {moderator.moderatorName[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-slate-800">
                            {moderator.moderatorName}
                          </h3>
                          <Badge variant="outline" className="capitalize">
                            {moderator.moderatorRole}
                          </Badge>
                        </div>
                        <Badge className="ml-auto">
                          {moderator.conversations.length} conversations
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {moderator.conversations.map((conv) => {
                          const statusConfig = getStatusConfig(conv.status);
                          return (
                            <div
                              key={conv._id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Badge className={`${statusConfig.color} text-white`}>
                                  {statusConfig.icon}
                                </Badge>
                                <div>
                                  <p className="font-medium text-slate-800">
                                    {conv.subject}
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    User: {conv.userName}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openConversation(conv)}
                              >
                                View
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportManagement;
