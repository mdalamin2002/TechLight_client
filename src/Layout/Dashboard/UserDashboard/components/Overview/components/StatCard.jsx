import { Card } from "@/Components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const StatCard = ({ title, value, icon, className, trend, trendValue, loading }) => {
  if (loading) {
    return (
      <Card className={`p-4 flex flex-col gap-2 ${className} animate-pulse`}>
        <div className="w-10 h-10 bg-muted rounded-full" />
        <div className="h-6 w-20 bg-muted rounded" />
        <div className="h-4 w-24 bg-muted rounded" />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-5 hover:shadow-lg transition-all duration-300 border-border/50 group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
              {value}
            </h2>
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600 font-medium">
                  {trendValue}% this month
                </span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;
