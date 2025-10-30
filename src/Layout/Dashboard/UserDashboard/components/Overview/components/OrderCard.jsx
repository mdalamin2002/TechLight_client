import { Badge } from "@/Components/ui/badge";
import { Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const OrderCard = ({ order }) => {
  console.log(order);
  const getStatusColor = (status) => {
    const statusMap = {
      'success': 'bg-green-100 text-green-700 border-green-200',
      'delivered': 'bg-green-100 text-green-700 border-green-200',
      'shipped': 'bg-blue-100 text-blue-700 border-blue-200',
      'processing': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'pending': 'bg-orange-100 text-orange-700 border-orange-200',
      'failed': 'bg-red-100 text-red-700 border-red-200',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount) => {
    if (typeof amount === 'string' && amount.startsWith('$')) {
      return amount;
    }
    return `$${Number(amount || 0).toFixed(2)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="border border-border rounded-lg p-4 bg-card hover:shadow-md hover:border-primary/50 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
              {order?.order_id|| 'N/A'}
            </span>
            <Badge className={`text-xs px-2 py-0.5 border ${getStatusColor(order?.status)}`}>
              {order?.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(order?.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <span>{formatAmount(order?.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;



