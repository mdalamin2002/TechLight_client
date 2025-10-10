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
    <section className="">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Full width Stats */}
        <div className="col-span-1 md:col-span-6">
          <StatsSection stats={stats} />
        </div>

        {/* Orders take 4 columns */}
        <div className="col-span-1 md:col-span-4">
          <RecentOrdersSection orders={recentOrders} />
        </div>

        {/* Coupons take 2 columns */}
        <div className="col-span-1 md:col-span-2">
          <CouponsSection coupons={stats.coupons} />
        </div>
      </div>
    </section>
  );
};

export default Overview;
