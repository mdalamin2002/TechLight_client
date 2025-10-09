import {
  ShoppingCart,
  Heart,
  Package,
  DollarSign,
  BadgePercent,
} from "lucide-react";
import StatCard from "./StatCard";

const StatsSection = ({ stats }) => {
  return (
    <section className="bg-card text-card-foreground rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 auto-rows-auto">
        {/* 1st row - 3 cards */}
        <StatCard
          title="Total Spent"
          value={stats.totalSpent}
          icon={<DollarSign />}
          className="lg:col-span-2"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<Package />}
          className="lg:col-span-2"
        />
        <StatCard
          title="Wishlist Items"
          value={stats.wishlistItems}
          icon={<Heart />}
          className="lg:col-span-2"
        />

        {/* 2nd row - 2 cards */}
        <StatCard
          title="Cart Items"
          value={stats.cartItems}
          icon={<ShoppingCart />}
          className="lg:col-span-3"
        />
        <StatCard
          title="Available Coupons"
          value={stats.coupons.length}
          icon={<BadgePercent />}
          className="lg:col-span-3"
        />
      </div>
    </section>
  );
};

export default StatsSection;
