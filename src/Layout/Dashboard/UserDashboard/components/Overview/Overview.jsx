import { useQuery } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/utils/useAxiosSecure";
import useUserStats from "@/hooks/useUserStats";
import CouponsSection from "./components/CouponsSection";
import RecentOrdersSection from "./components/RecentOrdersSection";
import StatsSection from "./components/StatsSection";
import QuickActions from "./components/QuickActions";
import WelcomeBanner from "./components/WelcomeBanner";

const Overview = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { stats, isLoading: statsLoading } = useUserStats();

  // Fetch recent orders
  const { data: recentOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["recentOrders", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/user-orders?page=1&limit=5&sortBy=createdAt&sortOrder=desc`);
        return res.data?.data?.orders || [];
      } catch (error) {
        console.error("Error fetching recent orders:", error);
        return [];
      }
    },
  });

  return (
    <section className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner user={user} loading={statsLoading} />

      {/* Stats Grid */}
      <StatsSection stats={stats} loading={statsLoading} />

      {/* Quick Actions */}
      <QuickActions stats={stats} />

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders take 2 columns */}
        <div className="lg:col-span-2">
          <RecentOrdersSection orders={recentOrders} loading={ordersLoading} />
        </div>

        {/* Coupons take 1 column */}
        <div className="lg:col-span-1">
          <CouponsSection coupons={stats.coupons} loading={statsLoading} />
        </div>
      </div>
    </section>
  );
};

export default Overview;
