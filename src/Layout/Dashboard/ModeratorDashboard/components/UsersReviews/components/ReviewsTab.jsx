// ReviewsTab.jsx
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
import DebouncedInput from "../../../../AdminDashboard/components/AllUsers/components/DebouncedInput";
import { Hash, User, Search } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const ReviewsTab = () => {
  const columnHelper = createColumnHelper();

  // ===== State =====
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const axiosSecure = useAxiosSecure();

  // ===== Load data =====
  useEffect(() => {
    axiosSecure
      .get("/moderator/users-reviews/reviews")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, []);

  // ===== Action Handlers =====
  const handleApprove = async (id) => {
    try {
      // PATCH backend using _id
      await axiosSecure.patch(`/moderator/users-reviews/reviews/${id}`, {
        status: "Approved",
      });

      // Update UI
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "Approved" } : item
        )
      );
    } catch (error) {
      console.error("Failed to approve review:", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      // DELETE backend using _id
      await axiosSecure.delete(`/moderator/users-reviews/reviews/${id}`);

      // Update UI
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to remove review:", error);
    }
  };

  // ===== Columns =====
  const columns = [
    columnHelper.accessor("reviewId", {
      id: "S.No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: () => (
        <div className="flex items-center gap-1">
          <Hash size={16} /> S.No
        </div>
      ),
    }),
    columnHelper.accessor("user", {
      cell: (info) => (
        <span className="font-semibold text-gray-800">{info.getValue()}</span>
      ),
      header: () => (
        <div className="flex items-center gap-1">
          <User size={16} /> User
        </div>
      ),
    }),
    columnHelper.accessor("product", {
      cell: (info) => <span className="text-gray-700">{info.getValue()}</span>,
      header: "Product",
    }),
    columnHelper.accessor("rating", {
      cell: (info) => (
        <span className="text-yellow-500 font-semibold">
          {info.getValue()} ⭐
        </span>
      ),
      header: "Rating",
    }),
    columnHelper.accessor("comment", {
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
      header: "Comment",
    }),
    columnHelper.accessor("status", {
      cell: (info) => {
        const status = info.getValue();
        const color =
          status === "Pending"
            ? "bg-yellow-400"
            : status === "Approved"
            ? "bg-green-500"
            : "bg-red-500";
        return (
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${color}`}></span>
            <span className="capitalize text-gray-700">{status}</span>
          </div>
        );
      },
      header: "Status",
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
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <DebouncedInput
            value={globalFilter}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search all columns..."
            className="py-2 pl-10 pr-3 bg-white shadow-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
      </div>

      {/*  Table */}
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
                <th className="px-4 py-3 text-sm font-semibold text-left">
                  Actions
                </th>
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

                {/* Actions */}
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => handleApprove(row.original._id)}
                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRemove(row.original._id)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition"
          >
            Next
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

export default ReviewsTab;
