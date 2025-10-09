import CouponsSection from "./components/CouponsSection";
import RecentOrdersSection from "./components/RecentOrdersSection";
import StatsSection from "./components/StatsSection";


const Overview = () => {
  const stats = {
    totalOrders: 12,
    wishlistItems: 5,
    cartItems: 3,
    totalSpent: "$1,250",
    coupons: ["WELCOME10", "FREESHIP"],
  };

  const recentOrders = [
    { id: "#ORD001", date: "Oct 5", total: "$120", status: "Delivered" },
    { id: "#ORD002", date: "Sep 25", total: "$80", status: "Shipped" },
  ];

  return (
    <div className="space-y-4">
      <StatsSection stats={stats} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <RecentOrdersSection orders={recentOrders} />
        <CouponsSection coupons={stats.coupons} />
      </div>
    </div>
  );
};

export default Overview;
