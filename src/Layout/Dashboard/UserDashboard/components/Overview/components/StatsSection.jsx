import {
  ShoppingCart,
  Heart,
  Package,
  DollarSign,
  Tag,
  CheckCircle,
} from "lucide-react";
import StatCard from "./StatCard";

const StatsSection = ({ stats, loading }) => {

  console.log(stats);

  const formatCurrency = (amount) => {
    return `$${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <section className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          icon={<DollarSign className="w-6 h-6" />}
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          icon={<Package className="w-6 h-6" />}
          loading={loading}
        />
        <StatCard
          title="Completed Orders"
          value={stats.completedOrders || 0}
          icon={<CheckCircle className="w-6 h-6" />}
          loading={loading}
        />
        <StatCard
          title="Wishlist Items"
          value={stats.wishlistItems || 0}
          icon={<Heart className="w-6 h-6" />}
          loading={loading}
        />
        <StatCard
          title="Cart Items"
          value={stats.cartItems || 0}
          icon={<ShoppingCart className="w-6 h-6" />}
          loading={loading}
        />
        <StatCard
          title="Available Coupons"
          value={stats.coupons?.length || 0}
          icon={<Tag className="w-6 h-6" />}
          loading={loading}
        />
      </div>
    </section>
  );
};

export default StatsSection;
