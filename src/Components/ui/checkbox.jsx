import React from "react";

export const Checkbox = ({ id, checked, onCheckedChange, ...props }) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    className="w-4 h-4 accent-primary cursor-pointer"
    {...props}
  />
);
