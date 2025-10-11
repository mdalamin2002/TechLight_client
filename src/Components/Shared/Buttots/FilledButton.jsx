import React from "react";

const FilledButton = ({ children, onClick, className = "",disabled=false }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        px-5 py-2 ${disabled? 'cursor-not-allowed':'cursor-pointer'} rounded-lg font-medium transition-all duration-300
        bg-accent text-accent-foreground
        hover:bg-primary hover:text-primary-foreground
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default FilledButton;
