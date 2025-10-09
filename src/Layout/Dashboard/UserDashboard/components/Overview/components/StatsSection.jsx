import { ShoppingCart, Heart, Package, DollarSign, BadgePercent } from "lucide-react";
import StatCard from "./StatCard";


const StatsSection = ({ stats }) => {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<Package />} />
        <StatCard title="Wishlist Items" value={stats.wishlistItems} icon={<Heart />} />
        <StatCard title="Cart Items" value={stats.cartItems} icon={<ShoppingCart />} />
        <StatCard title="Total Spent" value={stats.totalSpent} icon={<DollarSign />} />
        <StatCard title="Available Coupons" value={stats.coupons.length} icon={<BadgePercent />} />
      </div>
    </section>
  );
};

export default StatsSection;
