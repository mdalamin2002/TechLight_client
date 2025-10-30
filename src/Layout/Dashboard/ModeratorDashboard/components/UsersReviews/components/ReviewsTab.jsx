import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import { Search, MoreHorizontal, Check, Clock, X, Trash2, Star } from "lucide-react";
import DebouncedInput from "../../../../AdminDashboard/components/AllUsers/components/DebouncedInput";
import useAxiosSecure from "@/utils/useAxiosSecure";
import toast, { Toaster } from "react-hot-toast";

const ReviewsTab = () => {
  const columnHelper = createColumnHelper();
  const axiosSecure = useAxiosSecure();

  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosSecure.get("/reviews/moderator/all");
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    toast.loading(`Updating to ${status}...`, { id: "review-action" });

    try {
      // Use the new moderator endpoint to update review status
      // Send status in lowercase to match backend expectations
      await axiosSecure.patch(`/reviews/${id}/moderator/status`, { status: status.toLowerCase() });

      // Update the UI
      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: status.toLowerCase() } : item
        )
      );

      // Close the menu after action
      setOpenMenu(null);

      toast.success(`Review updated successfully`, { id: "review-action" });
    } catch {
      toast.error(`Error updating review status`, { id: "review-action" });
    }
  };

  const handleRemove = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    toast.loading("Deleting...", { id: "review-action" });

    try {
      // Use the new moderator endpoint to delete review
      await axiosSecure.delete(`/reviews/${id}/moderator/delete`);

      // Update the UI
      setData((prev) => prev.filter((item) => item._id !== id));

      // Close the menu after action
      setOpenMenu(null);

      toast.success("Review removed successfully", { id: "review-action" });
    } catch {
      toast.error("Failed to delete review", { id: "review-action" });
    }
  };

  const columns = [
    columnHelper.display({
      header: "#",
      cell: (info) => (
        <span className="text-gray-500 font-medium">
          {info.row.index + 1}
        </span>
      ),
    }),
    columnHelper.accessor("userName", {
      header: "User",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-800 font-semibold text-xs">
              {info.getValue()?.charAt(0)}
            </span>
          </div>
          <span
            className="font-medium text-gray-800 max-w-[150px] truncate"
            title={info.getValue()}
          >
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("productName", {
      header: "Product",
      cell: (info) => (
        <span
          className="font-medium text-gray-700 max-w-[150px] truncate"
          title={info.getValue()}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("rating", {
      header: "Rating",
      cell: (info) => {
        const rating = info.getValue();
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="font-semibold text-gray-700 ml-1">{rating}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("comment", {
      header: "Comment",
      cell: (info) => (
        <div className="max-w-xs truncate text-gray-600" title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        // Use the actual status from the database
        const status = info.getValue() || "approved";
        const statusConfig = {
          "pending": { color: "bg-yellow-100 text-yellow-800", icon: Clock },
          "approved": { color: "bg-green-100 text-green-800", icon: Check },
          "rejected": { color: "bg-red-100 text-red-800", icon: X }
        };

        // Capitalize the first letter for display
        const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
        const config = statusConfig[status.toLowerCase()] || statusConfig["approved"];
        const Icon = config.icon;

        return (
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon size={12} />
            <span>{displayStatus}</span>
          </div>
        );
      },
    }),
    columnHelper.display({
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original._id;
        const currentStatus = row.original.status || "approved";

        return (
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === id ? null : id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreHorizontal size={18} className="text-gray-600" />
            </button>

            {openMenu === id && (
              <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-md z-10 border border-gray-200 py-1">
                <button
                  onClick={() => handleUpdateStatus(id, "approved")}
                  disabled={currentStatus.toLowerCase() === "approved"}
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                    currentStatus.toLowerCase() === "approved"
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Check size={16} />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(id, "pending")}
                  disabled={currentStatus.toLowerCase() === "pending"}
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                    currentStatus.toLowerCase() === "pending"
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-yellow-600 hover:bg-yellow-50"
                  }`}
                >
                  <Clock size={16} />
                  <span>Pending</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(id, "rejected")}
                  disabled={currentStatus.toLowerCase() === "rejected"}
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${
                    currentStatus.toLowerCase() === "rejected"
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-red-600 hover:bg-red-50"
                  }`}
                >
                  <X size={16} />
                  <span>Reject</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => handleRemove(id)}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  <Trash2 size={16} />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </div>
        );
      },
    }),

  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu && !event.target.closest('.relative')) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenu]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 rounded-xl shadow-lg bg-white">
      <Toaster />

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative max-w-md w-full">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <DebouncedInput
            value={globalFilter}
            onChange={setGlobalFilter}
            placeholder="Search reviews..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews found</h3>
          <p className="text-gray-500">Try adjusting your search query</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-600 text-white">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-sm font-semibold"
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
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1.5 text-sm rounded-md bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1.5 text-sm rounded-md bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{" "}
              <span className="font-medium">{data.length}</span> reviews
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Rows per page:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md text-sm"
              >
                {[10, 20, 30, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
