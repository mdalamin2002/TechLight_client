import React from "react";

const OutlineButton = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2 cursor-pointer rounded-lg font-medium transition-all duration-300
        border border-[#4B5BC2] text-[#4B5BC2] bg-transparent
        hover:bg-[#4B5BC2] hover:text-white
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default OutlineButton;
