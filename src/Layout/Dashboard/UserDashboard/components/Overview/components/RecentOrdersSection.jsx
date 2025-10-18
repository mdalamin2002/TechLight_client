import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import OrderCard from "./OrderCard";

const RecentOrdersSection = ({ orders, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>
        <Link to="/dashboard/my-orders">
          <Button variant="ghost" size="sm" className="gap-2">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      
      <div className="space-y-3 flex-1">
        {orders && orders.length > 0 ? (
          orders.slice(0, 5).map((order) => (
            <OrderCard key={order._id || order.id} order={order} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Link to="/allProduct">
              <Button size="sm">Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentOrdersSection;
