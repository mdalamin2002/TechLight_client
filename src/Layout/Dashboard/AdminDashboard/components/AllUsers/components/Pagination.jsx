import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({ table }) => {
  if (!table) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-border/50">
      {/* Left - Navigation Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="p-2 rounded-xl bg-muted hover:bg-primary/10 text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 border border-border/50 hover:border-primary/30"
          title="First Page"
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground hover:opacity-90 transition-all duration-200 flex items-center gap-2 font-medium shadow-md disabled:shadow-none"
        >
          <ChevronLeft size={18} /> Prev
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground hover:opacity-90 transition-all duration-200 flex items-center gap-2 font-medium shadow-md disabled:shadow-none"
        >
          Next <ChevronRight size={18} />
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className="p-2 rounded-xl bg-muted hover:bg-primary/10 text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 border border-border/50 hover:border-primary/30"
          title="Last Page"
        >
          <ChevronsRight size={18} />
        </button>
      </div>

      {/* Center - Page Info */}
      <span className="text-muted-foreground text-sm font-medium">
        Page{" "}
        <strong className="text-foreground">
          {table.getState().pagination.pageIndex + 1}
        </strong>{" "}
        of <strong className="text-foreground">{table.getPageCount()}</strong>
      </span>

      {/* Right - Go to Page & Page Size */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Go to:</span>
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 px-2 py-1.5 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="px-3 py-1.5 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
