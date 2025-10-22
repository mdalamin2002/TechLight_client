import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  title,
  value,
  change,
  changeText,
  icon: Icon,
  gradient,
  isPositive,
}) => (
  <div className="group bg-card rounded-2xl p-5 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-foreground">{value}</h3>
      </div>
      <div
        className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon size={24} />
      </div>
    </div>

    <div className="flex items-center gap-2">
      {isPositive ? (
        <TrendingUp size={16} className="text-green-500" />
      ) : (
        <TrendingDown size={16} className="text-red-500" />
      )}
      <span
        className={`text-sm font-semibold ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {change}
      </span>
      <span className="text-xs text-muted-foreground">{changeText}</span>
    </div>
  </div>
);

export default StatCard;
