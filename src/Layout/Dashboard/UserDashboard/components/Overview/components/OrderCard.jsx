import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OrderCard = ({ order }) => (
  <Card className="p-4 flex flex-row justify-between items-center">
    <div>
      <p className="font-medium">{order.id}</p>
      <p className="text-sm text-muted-foreground">{order.date}</p>
    </div>
    <div className="text-right">
      <p className="font-semibold">{order.total}</p>
      <Badge variant="outline">{order.status}</Badge>
    </div>
  </Card>
);

export default OrderCard;
