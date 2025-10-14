import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Hash,
  Package,
  AlertTriangle,
  Warehouse,
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";
import DebouncedInput from "../../../../AdminDashboard/components/AllUsers/components/DebouncedInput";
import useAxiosSecure from "@/utils/useAxiosSecure";

const InventoryAlertsTab = () => {
  const columnHelper = createColumnHelper();

  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const axiosSecure = useAxiosSecure();

  // ===== Load data =====
  useEffect(() => {
    axiosSecure
      .get("/moderator/orders-products/inventory-alerts")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  // ===== Action Handler =====
  const notifySeller = (row) => {
    alert(
      `Notification sent to seller: ${row.sellerName} for product ${row.category}`
    );
  };

  // ===== Columns =====
  const columns = [
    columnHelper.accessor("id", {
      header: () => <div className="flex items-center gap-1">Inventory ID</div>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("sellerName", {
      header: () => <div className="flex items-center gap-1">Seller</div>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("category", {
      header: () => <div className="flex items-center gap-1">Category</div>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("stock", {
      header: () => (
        <div className="flex items-center justify-center gap-1">Stock</div>
      ),
      cell: (info) => (
        <div className="flex justify-center items-center w-full">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("alertLevel", {
      header: () => (
        <div className="flex items-center justify-center gap-1">Status</div>
      ),
      cell: (info) => {
        const level = info.getValue();
        const color =
          level === "Critical"
            ? "bg-red-500"
            : level === "Low"
            ? "bg-yellow-400"
            : "bg-green-500";
        return (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 w-28 pl-5">
              <span className={`w-3 h-3 rounded-full ${color}`} />
              <span className="capitalize text-start ">{level}</span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "action",
      header: () => (
        <div className="flex items-center justify-center gap-1">Action</div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <button
            onClick={() => notifySeller(row.original)}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm"
          >
            <Bell size={16} /> {/* Bell icon before text */}
            Notify Seller
          </button>
        </div>
      ),
    }),
  ];

  // ===== React Table =====
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 max-full mx-auto shadow-lg rounded-2xl">
      {/* Search */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-3 items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <DebouncedInput
            value={globalFilter}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search alerts..."
            className="py-2 pl-10 pr-3 bg-white shadow-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-indigo-600 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-sm font-semibold text-left"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"
                } hover:bg-indigo-100/70 transition-colors`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-gray-700 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 flex items-center gap-1"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

        <span className="text-gray-700 text-sm">
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
          <strong>{table.getPageCount()}</strong>
        </span>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 p-1 border rounded-lg shadow-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="p-2 border rounded-lg shadow-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
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

export default InventoryAlertsTab;
