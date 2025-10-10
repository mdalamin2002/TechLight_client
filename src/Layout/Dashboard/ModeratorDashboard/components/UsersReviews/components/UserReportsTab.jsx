// UserReportsTab.jsx
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
import { Hash, User, Calendar, Search } from "lucide-react";

const UserReportsTab = () => {
  const columnHelper = createColumnHelper();

  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    axios
      .get("/Moderator_Users_UsersReport.json")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ===== Action Handlers =====
  const handleStatusChange = (reportId, newStatus) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.reportId === reportId ? { ...item, status: newStatus } : item
      )
    );
  };

  // ===== Columns =====
  const columns = [
    columnHelper.accessor("reportId", {
      id: "S.No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: () => (
        <div className="flex items-center gap-1">
          <Hash size={16} /> S.No
        </div>
      ),
    }),
    columnHelper.accessor("reportedUser", {
      cell: (info) => (
        <span className="font-semibold text-gray-800">{info.getValue()}</span>
      ),
      header: () => (
        <div className="flex items-center gap-1">
          <User size={16} /> Reported User
        </div>
      ),
    }),
    columnHelper.accessor("reason", {
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
      header: "Reason",
    }),
    columnHelper.accessor("date", {
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
      header: () => (
        <div className="flex items-center gap-1">
          <Calendar size={16} /> Date
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      cell: (info) => {
        const status = info.getValue();
        const color =
          status === "Pending"
            ? "bg-blue-400"
            : status === "Verified"
            ? "bg-green-500"
            : status === "Warned"
            ? "bg-yellow-400"
            : status === "Banned"
            ? "bg-red-500"
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
                key={row.original.reportId}
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
                    onClick={() =>
                      handleStatusChange(row.original.reportId, "Verified")
                    }
                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(row.original.reportId, "Warned")
                    }
                    className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                  >
                    Warn
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(row.original.reportId, "Banned")
                    }
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                  >
                    Temp Ban
                  </button>
                </td>
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

export default UserReportsTab;
