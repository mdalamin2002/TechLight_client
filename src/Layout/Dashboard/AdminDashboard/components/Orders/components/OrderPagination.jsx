import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OrderPagination = ({ pageIndex, setPageIndex, pageSize, setPageSize, pageCount }) => {
  // Calculate the range of items being displayed
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, pageCount * pageSize);
  const totalItems = pageCount * pageSize;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-border/50">
      {/* Page info */}
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{startItem}</span> to{" "}
        <span className="font-medium text-foreground">{endItem}</span>{" "}
        of <span className="font-medium text-foreground">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-2">
        {/* Prev/Next buttons */}
        <button
          onClick={() => setPageIndex(prev => Math.max(prev - 1, 0))}
          disabled={pageIndex === 0}
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> Previous
        </button>

        {/* Page numbers */}
        <div className="hidden sm:flex">
          {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
            let pageNum;
            if (pageCount <= 5) {
              pageNum = i;
            } else if (pageIndex < 3) {
              pageNum = i;
            } else if (pageIndex > pageCount - 4) {
              pageNum = pageCount - 5 + i;
            } else {
              pageNum = pageIndex - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setPageIndex(pageNum)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                  pageIndex === pageNum
                    ? "z-10 bg-primary text-primary-foreground border-primary"
                    : "text-foreground bg-card border border-border hover:bg-muted"
                } border mx-px rounded-lg transition-colors`}
              >
                {pageNum + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setPageIndex(prev => Math.min(prev + 1, pageCount - 1))}
          disabled={pageIndex >= pageCount - 1}
          className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next <ChevronRight size={16} className="ml-1" />
        </button>
      </div>

      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show</span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageIndex(0);
            setPageSize(Number(e.target.value));
          }}
          className="text-sm border border-border rounded-lg bg-card text-foreground py-1 px-2 focus:ring-2 focus:ring-primary/50 focus:outline-none"
        >
          {[5, 10, 20, 30, 50].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">per page</span>
      </div>
    </div>
  );
};

export default OrderPagination;
