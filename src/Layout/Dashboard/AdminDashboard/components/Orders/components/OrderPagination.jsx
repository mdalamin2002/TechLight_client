import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OrderPagination = ({ pageIndex, setPageIndex, pageSize, setPageSize, pageCount }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
      {/* Prev/Next buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPageIndex(prev => Math.max(prev - 1, 0))}
          disabled={pageIndex === 0}
          className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition flex items-center gap-1"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button
          onClick={() => setPageIndex(prev => Math.min(prev + 1, pageCount - 1))}
          disabled={pageIndex >= pageCount - 1}
          className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition flex items-center gap-1"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* Page info */}
      <span className="text-gray-700 text-sm">
        Page <strong>{pageIndex + 1}</strong> of <strong>{pageCount}</strong>
      </span>

      {/* Go to page */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        Go to page:
        <input
          type="number"
          min={1}
          max={pageCount}
          value={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            setPageIndex(Math.min(Math.max(page, 0), pageCount - 1));
          }}
          className="w-16 p-1 border rounded-lg shadow-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Page size */}
      <select
        value={pageSize}
        onChange={(e) => {
          setPageIndex(0);
          setPageSize(Number(e.target.value));
        }}
        className="p-2 border rounded-lg shadow-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {[5, 10, 20, 30, 50].map(size => (
          <option key={size} value={size}>Show {size}</option>
        ))}
      </select>
    </div>
  );
};

export default OrderPagination;
