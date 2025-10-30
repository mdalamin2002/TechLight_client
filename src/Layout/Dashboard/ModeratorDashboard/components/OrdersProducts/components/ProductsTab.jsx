import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import DebouncedInput from "../../../../AdminDashboard/components/AllUsers/components/DebouncedInput";
import { Search, Settings, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { toast } from "react-toastify";

const ProductsTab = () => {
  const columnHelper = createColumnHelper();

  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState(""); // Add status filter
  const axiosSecure = useAxiosSecure();

  // ===== Load products =====
  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const fetchProducts = () => {
    setLoading(true);
    // Use the admin endpoint to get all products without pagination
    axiosSecure
      .get(`/products/admin/all?all=true`)
      .then((res) => {
        // Apply status filter if selected
        let filteredData = res.data.data;
        if (statusFilter) {
          filteredData = filteredData.filter(product => product.status === statusFilter);
        }
        setData(filteredData);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        toast.error("Failed to fetch products");
      })
      .finally(() => setLoading(false));
  };

  // ===== Update product status =====
  const handleUpdateStatus = (id, status) => {
    if (!id) return console.error("Invalid product ID");

    // Optimistically update UI
    setData((prevData) =>
      prevData.map((product) =>
        product._id === id ? { ...product, status } : product
      )
    );

    axiosSecure
      .patch(`/products/status/${id}`, { status })
      .then(() => {
        toast.success(`Product ${status} successfully`);
        // Refresh the product list to ensure consistency
        fetchProducts();
      })
      .catch((err) => {
        console.error("Status update failed:", err);
        toast.error("Failed to update product status");
        // Revert the optimistic update on error
        fetchProducts();
      });
  };

  // Status change dropdown component
  const StatusChangeDropdown = ({ productId, currentStatus }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleStatusChange = (newStatus) => {
      if (newStatus !== currentStatus) {
        handleUpdateStatus(productId, newStatus);
      }
      setIsOpen(false);
    };

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1 rounded-lg bg-card border border-border hover:bg-muted text-foreground text-xs font-medium flex items-center gap-1"
        >
          {currentStatus?.charAt(0).toUpperCase() + currentStatus?.slice(1)}
          <ChevronDown size={14} />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-32 rounded-lg bg-card border border-border shadow-lg">
            <div className="py-1">
              {['pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`block w-full text-left px-4 py-2 text-xs ${
                    status === currentStatus
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===== Columns =====
  const columns = [
    columnHelper.accessor("name", {
      header: "Product Name",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-sm font-bold text-primary">
            {info.getValue()?.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-foreground break-words">
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => (
        <span className="inline-flex px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg font-semibold">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell: (info) => `$${parseFloat(info.getValue()).toFixed(2)}`,
    }),
    columnHelper.accessor("stock", {
      header: "Stock",
      cell: (info) => {
        const stock = info.getValue();
        if (stock > 50)
          return (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {stock} units
            </span>
          );
        if (stock > 20)
          return (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              {stock} units
            </span>
          );
        if (stock > 0)
          return (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              {stock} units
            </span>
          );
        return (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            Out of Stock
          </span>
        );
      },
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
            <span className="capitalize">{status}</span>
          </div>
        );
      },
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

  // Filter products by status
  const handleStatusFilter = (status) => {
    setStatusFilter(status === "all" ? "" : status);
  };

  return (
    <div className="p-6 max-full mx-auto shadow-lg rounded-2xl">
      {/* 🔍 Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-3 items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <DebouncedInput
            value={globalFilter}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search all columns..."
            className="py-2 pl-10 pr-3 bg-white shadow-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Status:</span>
          <select
            value={statusFilter || "all"}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={fetchProducts}
            className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex items-center gap-1"
          >
            <Search size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* 📊 Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full border-collapse">
            <thead className="bg-indigo-600 text-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-semibold"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, i) => (
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

                    {/* ⚙ Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusChangeDropdown
                          productId={row.original._id}
                          currentStatus={row.original.status}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 📑 Pagination */}
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
            onChange={(e) =>
              table.setPageIndex(
                e.target.value ? Number(e.target.value) - 1 : 0
              )
            }
            className="w-16 p-1 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="p-2 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-400"
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

export default ProductsTab;
