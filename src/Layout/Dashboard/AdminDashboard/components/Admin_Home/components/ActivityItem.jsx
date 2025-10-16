import React from "react";
import { Clock } from "lucide-react";

const ActivityItem = ({ text, time }) => (
  <li className="group flex items-center justify-between py-3 px-4 rounded-xl hover:bg-muted/50 border-b border-border/30 last:border-0 transition-all duration-200 ease-out cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
        {text}
      </span>
    </div>
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Clock size={14} />
      <span className="text-xs">{time}</span>
    </div>
  </li>
);

export default ActivityItem;
