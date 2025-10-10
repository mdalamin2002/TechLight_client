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
import { Search, Settings, ChevronLeft, ChevronRight } from "lucide-react";

const ProductsTab = () => {
  const columnHelper = createColumnHelper();

  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  // ===== Load products =====
  useEffect(() => {
    axios
      .get("/ModeratorOrders_Products_Data.json")
      .then((res) => setData(res.data)) // no `.products`, because JSON is an array
      .catch((err) => console.error(err));
  }, []);
  // ===== Update product status =====
  const handleUpdateStatus = (id, status) => {
    setData((prevData) =>
      prevData.map((product) =>
        product.id === id ? { ...product, status: status } : product
      )
    );
    axios
      .patch(`/api/moderator/products/${id}/status`, { status })
      .then(() => {
        setData((prevData) =>
          prevData.map((product) =>
            product.id === id ? { ...product, status } : product
          )
        );
        setOpenMenu(null); // Close dropdown
      })
      .catch((err) => console.error("Status update failed:", err));
  };

  // ===== Columns =====
  const columns = [
    columnHelper.accessor("id", {
      header: "Product ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("seller", {
      header: "Seller",
      cell: (info) => info.getValue(),
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

  return (
    <div className="p-6 max-full mx-auto shadow-lg rounded-2xl">
      {/* 🔍 Search */}
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
      </div>

      {/* 📊 Table */}
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

                {/* ⚙ Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(row.original.id, "Approved")
                      }
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        handleUpdateStatus(row.original.id, "Rejected")
                      }
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
