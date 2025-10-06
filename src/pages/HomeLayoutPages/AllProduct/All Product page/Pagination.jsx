import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-5 py-2.5 bg-card border border-border rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-foreground font-medium text-sm shadow-sm hover:shadow-md"
      >
        Previous
      </button>

      <div className="flex gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-10 h-10 rounded-xl transition-all font-semibold text-sm shadow-sm ${
              currentPage === i + 1
                ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg scale-110 border-2 border-primary"
                : "bg-card border border-border text-foreground hover:bg-muted hover:scale-105"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-5 py-2.5 bg-card border border-border rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-foreground font-medium text-sm shadow-sm hover:shadow-md"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
