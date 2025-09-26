import React from "react";

const FilledButton = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2 cursor-pointer rounded-lg font-medium transition-all duration-300
        bg-[#4B5BC2] text-white
        hover:bg-[#3749BB] hover:text-white
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default FilledButton;
