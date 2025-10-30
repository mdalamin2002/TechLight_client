import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import { Search, MoreHorizontal } from "lucide-react";
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
        const res = await axiosSecure.get("/moderator/users-reviews/reviews");
        setData(res.data);
      } catch (err) {
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleApprove = async (id) => {
    toast.loading("Approving...", { id: "review-action" });

    try {
      await axiosSecure.patch(`/moderator/users-reviews/reviews/${id}`, {
        status: "Approved",
      });

      setData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "Approved" } : item
        )
      );

      toast.success("Review Approved ✅", { id: "review-action" });
    } catch {
      toast.error("Error approving review ❌", { id: "review-action" });
    }
  };

  const handleRemove = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    toast.loading("Deleting...", { id: "review-action" });

    try {
      await axiosSecure.delete(`/moderator/users-reviews/reviews/${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
      toast.success("Review Removed ✅", { id: "review-action" });
    } catch {
      toast.error("Failed to delete review ❌", { id: "review-action" });
    }
  };

  const columns = [
    columnHelper.display({
      header: "#",
      cell: (info) => info.row.index + 1,
    }),
    columnHelper.accessor("user", {
      header: "User",
      cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor("product", {
      header: "Product",
    }),
    columnHelper.accessor("rating", {
      header: "Rating",
      cell: (info) => (
        <span className="font-semibold">
          ⭐ {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("comment", {
      header: "Comment",
    }),
    columnHelper.accessor("status", {
      header: "Status",
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
            <span className={`w-3 h-3 rounded-full ${color}`} />
            {status}
          </div>
        );
      },
    }),
    columnHelper.display({
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === id ? null : id)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <MoreHorizontal size={18} />
            </button>

            {openMenu === id && (
              <div className="absolute bg-white shadow-md border rounded-lg w-32 top-8 right-0 z-20">
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    handleApprove(id);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-green-100"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    handleRemove(id);
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-red-100"
                >
                  ❌ Remove
                </button>
              </div>
            )}
          </div>
        );
      },
    }),
  ];

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

      <div className="flex gap-3 mb-4 items-center">
        <div className="relative w-72">
          <Search size={18} className="absolute left-3 top-2 text-gray-400" />
          <DebouncedInput
            value={globalFilter}
            onChange={setGlobalFilter}
            placeholder="Search..."
            className="pl-10 py-2 border rounded-xl w-full"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center py-10">Loading reviews...</p>
      ) : data.length === 0 ? (
        <p className="text-center py-10 text-gray-600">No Reviews Found ❗</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th key={header.id} className="px-4 py-2 text-left text-sm">
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
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
