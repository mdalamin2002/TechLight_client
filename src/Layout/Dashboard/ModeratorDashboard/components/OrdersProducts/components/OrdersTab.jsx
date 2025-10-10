// OrdersTab.jsx
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
import {
  Hash,
  User,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

const OrdersTab = () => {
  const columnHelper = createColumnHelper();

  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  // ===== Load orders data =====
  useEffect(() => {
    axios
      .get("/ModeratorOrders_Data.json")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ===== Update Order Status =====
  const handleUpdateStatus = (orderId, newStatus) => {
    setData((prevData) =>
      prevData.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setOpenMenu(null); // close dropdown
  };

  // ===== Columns =====
  const columns = [
    columnHelper.accessor("_id", {
      id: "S.No",
      header: () => (
        <div className="flex items-center gap-1">
          <Hash size={16} /> Order ID
        </div>
      ),
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("user", {
      header: () => (
        <div className="flex items-center gap-1">
          <User size={16} /> User
        </div>
      ),
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("products", {
      header: "Product(s)",
      cell: (info) => <span>{info.getValue().join(", ")}</span>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const color =
          status === "Pending"
            ? "bg-yellow-400"
            : status === "Shipped"
            ? "bg-blue-400"
            : "bg-green-500";
        return (
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${color}`}></span>
            <span className="capitalize">{status}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("date", {
      header: () => (
        <div className="flex items-center gap-1">
          <Calendar size={16} /> Date
        </div>
      ),
      cell: (info) => <span>{info.getValue()}</span>,
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
                <td className="py-3 px-4 relative">
                  {/* Settings button */}
                  <button
                    className="p-2 rounded-sm bg-indigo-600 text-white hover:bg-blue-800 transition"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === row.original._id ? null : row.original._id
                      )
                    }
                  >
                    Update Status
                  </button>

                  {/* Dropdown menu */}
                  {openMenu === row.original._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                      {["Pending", "Shipped", "Delivered"].map((status) => (
                        <button
                          key={status}
                          onClick={() =>
                            handleUpdateStatus(row.original._id, status)
                          }
                          className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </td>

                {/* ============= */}
                {openMenu === i && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                    {["Pending", "Shipped", "Delivered"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          handleUpdateStatus(row.original.id, status)
                        }
                        className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Set {status}
                      </button>
                    ))}
                  </div>
                )}
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
            className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition flex items-center gap-1"
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

export default OrdersTab;
