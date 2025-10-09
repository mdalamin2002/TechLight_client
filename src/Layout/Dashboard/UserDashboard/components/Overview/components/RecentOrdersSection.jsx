import OrderCard from "./OrderCard";

const RecentOrdersSection = ({ orders }) => {
  return (
    <section className="bg-card text-card-foreground rounded-xl p-6 shadow-sm h-full">
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      <div className="space-y-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <p className="text-muted-foreground">No recent orders found.</p>
        )}
      </div>
    </section>
  );
};

export default RecentOrdersSection;
