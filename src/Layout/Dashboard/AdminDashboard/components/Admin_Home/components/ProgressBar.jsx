import React from "react";

const ProgressBar = ({ label, value, percent, gradient }) => (
  <div className="group">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-sm font-semibold text-muted-foreground">
        {value}
      </span>
    </div>
    <div className="relative w-full h-3 bg-muted/30 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 ease-out relative group-hover:shadow-lg`}
        style={{ width: percent }}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
      </div>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-foreground/70">
        {percent}
      </span>
    </div>
  </div>
);

export default ProgressBar;
