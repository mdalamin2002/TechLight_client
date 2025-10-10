import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OrderCard = ({ order }) => {
  return (
    <div className="border rounded-lg p-4 bg-muted hover:shadow transition">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{order.id}</span>
        <span className="text-sm text-muted-foreground">{order.date}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">{order.total}</span>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            order.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.status}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;



