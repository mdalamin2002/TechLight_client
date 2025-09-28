import React from "react";

const FilledButton = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2 cursor-pointer rounded-lg font-medium transition-all duration-300
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
