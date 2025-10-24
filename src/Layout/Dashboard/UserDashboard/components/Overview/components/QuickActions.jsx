import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { 
  ShoppingBag, 
  Heart, 
  Package, 
  MapPin, 
  CreditCard,
  Headphones 
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const QuickActions = ({ stats }) => {
  const actions = [
    {
      icon: <Package className="w-5 h-5" />,
      label: "My Orders",
      link: "/dashboard/my-orders",
      badge: stats?.pendingOrders || null,
      color: "bg-primary/10",
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: "Shopping Cart",
      link: "/dashboard/my-cart",
      badge: stats?.cartItems || null,
      color: "bg-primary/10",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Wishlist",
      link: "/dashboard/my-wishlist",
      badge: stats?.wishlistItems || null,
      color: "bg-primary/10",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Addresses",
      link: "/dashboard/my-addresses",
      badge: null,
      color: "bg-primary/10",
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      label: "Payment Methods",
      link: "/dashboard/my-payment-methods",
      badge: null,
      color: "bg-primary/10",
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      label: "Support",
      link: "/dashboard/my-support",
      badge: null,
      color: "bg-primary/10",
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Link to={action.link}>
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center gap-2 p-4 hover:border-primary/50 hover:shadow-md transition-all relative group"
              >
                {action.badge !== null && action.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {action.badge > 99 ? '99+' : action.badge}
                  </span>
                )}
                <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-center line-clamp-2">
                  {action.label}
                </span>
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
