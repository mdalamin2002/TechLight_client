import OrderCard from "./OrderCard";



const RecentOrdersSection = ({ orders }) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
};

export default RecentOrdersSection;
