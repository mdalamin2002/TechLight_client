import React from "react";
import { flexRender } from "@tanstack/react-table";
import { MoreVertical, Shield, ShieldOff, UserCog, UserX } from "lucide-react";

const UserTable = ({
  table,
  openMenu,
  setOpenMenu,
  handleActionWithConfirm,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/50 shadow-md">
      <table className="min-w-full border-collapse">
        {/* Table Header */}
        <thead className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-600 text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-4 text-sm font-semibold text-left tracking-wide"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
              <th className="px-4 py-4 text-sm font-semibold text-left tracking-wide">
                Actions
              </th>
            </tr>
          ))}
        </thead>

        {/* Table Body */}
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id}
              className={`${
                i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"
              } hover:bg-indigo-100/70 transition-colors duration-200 border-b border-indigo-100/50 last:border-0`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4 text-gray-700 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}

              {/* Actions Column */}
              <td className="py-4 px-4 relative">
                <button
                  className="p-2.5 rounded-xl hover:bg-indigo-100 transition-all duration-200 border border-transparent hover:border-indigo-200 hover:shadow-md"
                  onClick={() => setOpenMenu(openMenu === i ? null : i)}
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {/* Dropdown Menu */}
                {openMenu === i && (
                  <>
                    {/* Backdrop to close menu */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenu(null)}
                    />

                    {/* Menu Items */}
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-20 overflow-hidden">
                      <button
                        onClick={() =>
                          handleActionWithConfirm("toggleBan", row.original)
                        }
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors text-left text-gray-700"
                      >
                        {row.original.status === "active" ? (
                          <>
                            <ShieldOff size={18} className="text-red-500" />
                            <span className="font-medium">Ban User</span>
                          </>
                        ) : (
                          <>
                            <Shield size={18} className="text-green-500" />
                            <span className="font-medium">Unban User</span>
                          </>
                        )}
                      </button>

                      {row.original.role === "User" && (
                        <button
                          onClick={() =>
                            handleActionWithConfirm(
                              "makeModerator",
                              row.original
                            )
                          }
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors text-left text-gray-700 border-t border-gray-100"
                        >
                          <UserCog size={18} className="text-blue-500" />
                          <span className="font-medium">Make Moderator</span>
                        </button>
                      )}

                      {(row.original.role === "User" ||
                        row.original.role === "Moderator") && (
                        <button
                          onClick={() =>
                            handleActionWithConfirm("makeAdmin", row.original)
                          }
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors text-left text-gray-700 border-t border-gray-100"
                        >
                          <Shield size={18} className="text-purple-500" />
                          <span className="font-medium">Make Admin</span>
                        </button>
                      )}

                      {(row.original.role === "Admin" ||
                        row.original.role === "Moderator") && (
                        <button
                          onClick={() =>
                            handleActionWithConfirm("removeRole", row.original)
                          }
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-red-50 transition-colors text-left text-red-600 border-t border-gray-100"
                        >
                          <UserX size={18} />
                          <span className="font-medium">Remove Role</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {table.getRowModel().rows.length === 0 && (
        <div className="text-center py-12 bg-white">
          <p className="text-gray-500 text-sm">No users found</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
