import React, { useState, useEffect } from "react";
import TransactionsTable from "./components/TransactionsTable";
import RefundsTable from "./components/RefundsTable";
// import PayoutsTable from "./components/PayoutsTable";
import { DollarSign, CreditCard, RefreshCw, TrendingUp } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { toast } from "react-hot-toast";

const Finance = () => {
  const [activeTab, setActiveTab] = useState("Transactions");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalRefunds: 0,
    pendingPayouts: 0,
    revenueGrowth: 0,
    transactionGrowth: 0,
    refundGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch payment stats
      const paymentStatsResponse = await axiosSecure.get('/payments/admin/stats?period=30');
      const paymentStats = paymentStatsResponse.data.stats;

      // Fetch return stats
      const returnStatsResponse = await axiosSecure.get('/returns/admin/stats');
      const returnStats = returnStatsResponse.data.stats;

      setStats({
        totalRevenue: paymentStats.totalRevenue || 0,
        totalTransactions: paymentStats.totalTransactions || 0,
        totalRefunds: returnStats.pendingReturns || 0,
        pendingPayouts: paymentStats.pendingTransactions || 0,
        revenueGrowth: paymentStats.revenueGrowth || 0,
        transactionGrowth: paymentStats.transactionGrowth || 0,
        refundGrowth: 0, // Calculate if needed
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load finance statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-background">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Finance & Payments</h2>
        <p className="text-muted-foreground">Manage transactions, refunds, and seller payouts.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {loading ? "..." : `৳${stats.totalRevenue.toLocaleString()}`}
              </p>
              <p className={`text-xs mt-1 ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {loading ? "..." : `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth}% from last month`}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Transactions</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {loading ? "..." : stats.totalTransactions.toLocaleString()}
              </p>
              <p className={`text-xs mt-1 ${stats.transactionGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {loading ? "..." : `${stats.transactionGrowth >= 0 ? '+' : ''}${stats.transactionGrowth}% from last month`}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Refunds</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {loading ? "..." : stats.totalRefunds}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Pending requests
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending Payments</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {loading ? "..." : stats.pendingPayouts}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting confirmation
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-xl shadow-sm border border-border/50 p-1 mb-6 inline-flex">
        {["Transactions", "Refunds"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tables */}
      <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6">
        {activeTab === "Transactions" && <TransactionsTable />}
        {activeTab === "Refunds" && <RefundsTable />}
        {/* {activeTab === "Payouts" && <PayoutsTable />} */}
      </div>
    </div>
  );
};

export default Finance;
