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
  RefreshCw,
  ArrowRight,
  Loader2,
  Users,
  MessageSquare,
  Activity,
  UserCheck,
  Search,
  Filter,
  TrendingUp,
  Zap,
  Eye,
  Sparkles,
  BarChart3,
} from "lucide-react";

const SupportManagement = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { userData } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("conversations");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
      const response = await axiosSecure.get(`/support/conversations/allConversations`);
      const allConvs = response.data.conversations || [];
      setConversations(allConvs);

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

  useEffect(() => {
    fetchConversations();
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) return date.toLocaleDateString();
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getStatusConfig = (status) => {
    const configs = {
      open: {
        gradient: "from-emerald-500 to-emerald-600",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-700 dark:text-emerald-400",
        icon: MessageCircle,
        label: "Open",
        dotColor: "bg-emerald-500"
      },
      "in-progress": {
        gradient: "from-blue-500 to-blue-600",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        text: "text-blue-700 dark:text-blue-400",
        icon: Clock,
        label: "In Progress",
        dotColor: "bg-blue-500"
      },
      resolved: {
        gradient: "from-violet-500 to-violet-600",
        bg: "bg-violet-500/10",
        border: "border-violet-500/30",
        text: "text-violet-700 dark:text-violet-400",
        icon: CheckCircle2,
        label: "Resolved",
        dotColor: "bg-violet-500"
      },
      closed: {
        gradient: "from-slate-500 to-slate-600",
        bg: "bg-slate-500/10",
        border: "border-slate-500/30",
        text: "text-slate-700 dark:text-slate-400",
        icon: XCircle,
        label: "Closed",
        dotColor: "bg-slate-500"
      }
    };
    return configs[status] || configs.open;
  };

  const handleStatusUpdate = async (conversationId, newStatus) => {
    try {
      const response = await axiosSecure.patch(
        `/support/conversations/${conversationId}`,
        {
          status: newStatus,
          userRole: userData?.role || "admin"
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

  const openConversation = (conversation) => {
    navigate(`/support-chat/${conversation._id}`, {
      state: { conversation },
    });
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesSearch = searchQuery === "" ||
      c.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.userName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading support management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-6">
      <div className=" space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Support Management</h1>
              </div>
            </div>
            <p className="text-muted-foreground ml-15">Monitor and manage all customer conversations</p>
          </div>
          <button
            onClick={fetchConversations}
            disabled={refreshing}
            className="px-4 py-2.5 bg-card border border-border hover:bg-muted rounded-xl transition-all flex items-center gap-2 text-foreground font-medium hover:shadow-md disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Conversations</p>
            <p className="text-3xl font-bold text-foreground">{stats.total}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-semibold rounded-full">
                Active
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Open</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.open}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-violet-600" />
              </div>
              <Sparkles className="w-5 h-5 text-violet-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Resolved</p>
            <p className="text-3xl font-bold text-violet-600">{stats.resolved}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500/20 to-slate-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <XCircle className="w-6 h-6 text-slate-600" />
              </div>
              <BarChart3 className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Closed</p>
            <p className="text-3xl font-bold text-slate-600">{stats.closed}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card border border-border rounded-2xl shadow-lg">
          <div className="border-b border-border">
            <div className="flex gap-2 p-2">
              <button
                onClick={() => setActiveTab("conversations")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === "conversations"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Conversations
              </button>
              <button
                onClick={() => setActiveTab("moderators")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === "moderators"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Users className="w-4 h-4" />
                Moderator Assignments
              </button>
            </div>
          </div>

          {/* Conversations Tab */}
          {activeTab === "conversations" && (
            <div className="p-6">
              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-12 pr-8 py-3 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition appearance-none cursor-pointer min-w-[200px]"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Conversations List */}
              {filteredConversations.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No conversations found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? "Try adjusting your search" : "No conversations match the selected filter"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredConversations.map((conversation) => {
                    const statusConfig = getStatusConfig(conversation.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <div
                        key={conversation._id}
                        className="border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all bg-card group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                {conversation.subject}
                              </h3>
                              <div className={`flex items-center gap-1.5 px-3 py-1 ${statusConfig.bg} border ${statusConfig.border} rounded-full`}>
                                <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.text}`} />
                                <span className={`text-xs font-semibold ${statusConfig.text}`}>
                                  {statusConfig.label}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                {conversation.userName}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                              <span className="capitalize">{conversation.category}</span>
                              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                              <span className="font-mono text-xs">#{conversation._id?.slice(-6).toUpperCase()}</span>
                            </div>

                            {conversation.assignedToName && (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-lg">
                                  <UserCheck className="w-3.5 h-3.5 text-primary" />
                                  <span className="text-xs font-medium text-foreground">
                                    {conversation.assignedToName}
                                  </span>
                                  <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                                    {conversation.assignedToRole}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(conversation.lastMessageAt)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {userData?.role === "admin" && (
                                <select
                                  value={conversation.status}
                                  onChange={(e) => handleStatusUpdate(conversation._id, e.target.value)}
                                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition cursor-pointer"
                                >
                                  <option value="open">Open</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="resolved">Resolved</option>
                                  <option value="closed">Closed</option>
                                </select>
                              )}
                              <button
                                onClick={() => openConversation(conversation)}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 font-medium text-sm shadow-md hover:shadow-lg"
                              >
                                <Eye className="w-4 h-4" />
                                View Chat
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Moderators Tab */}
          {activeTab === "moderators" && (
            <div className="p-6">
              {Object.keys(conversationsByModerator).length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No assignments yet
                  </h3>
                  <p className="text-muted-foreground">
                    Conversations will appear here once moderators engage
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.values(conversationsByModerator).map((moderator, idx) => (
                    <div key={idx} className="border border-border rounded-xl p-6 bg-card hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
                          {moderator.moderatorName[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground mb-1">
                            {moderator.moderatorName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded capitalize">
                              {moderator.moderatorRole}
                            </span>
                            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded">
                              {moderator.conversations.length} conversations
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {moderator.conversations.map((conv) => {
                          const statusConfig = getStatusConfig(conv.status);
                          const StatusIcon = statusConfig.icon;
                          return (
                            <div
                              key={conv._id}
                              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all border border-border"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center`}>
                                  <StatusIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-foreground mb-1">
                                    {conv.subject}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    User: {conv.userName}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => openConversation(conv)}
                                className="px-4 py-2 bg-background border border-border hover:bg-muted rounded-lg text-sm font-medium text-foreground transition-all flex items-center gap-2"
                              >
                                View
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportManagement;
