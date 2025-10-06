import React from 'react';
import { flexRender } from '@tanstack/react-table';
import { Settings } from 'lucide-react';

const UserTable = ({ table, openMenu, setOpenMenu, handleActionWithConfirm }) => {
    return (
        <div className='overflow-x-auto rounded-xl border border-gray-200 shadow-sm'>
            <table className='min-w-full border-collapse'>
                <thead className='bg-indigo-600 text-white'>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className='px-4 py-3 text-sm font-semibold text-left'>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-sm font-semibold text-left">Actions</th>
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row, i) => (
                        <tr key={row.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-indigo-50/40'} hover:bg-indigo-100/70 transition-colors`}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className='px-4 py-3 text-gray-700 text-sm'>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}

                            {/* ⚙ Actions */}
                            <td className="py-3 px-4 relative">
                                <button
                                    className="p-2 rounded-full hover:bg-gray-100 transition"
                                    onClick={() => setOpenMenu(openMenu === i ? null : i)}
                                >
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </button>

                                {openMenu === i && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">
                                        <button
                                            onClick={() => handleActionWithConfirm("toggleBan", row.original)}
                                            className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            {row.original.status === "active" ? "Ban" : "Unban"}
                                        </button>
                                        {row.original.role === "User" && (
                                            <button
                                                onClick={() => handleActionWithConfirm("makeModerator", row.original)}
                                                className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                Make Moderator
                                            </button>
                                        )}
                                        {(row.original.role === "User" || row.original.role === "Moderator") && (
                                            <button
                                                onClick={() => handleActionWithConfirm("makeAdmin", row.original)}
                                                className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                Make Admin
                                            </button>
                                        )}
                                        {(row.original.role === "Admin" || row.original.role === "Moderator") && (
                                            <button
                                                onClick={() => handleActionWithConfirm("removeRole", row.original)}
                                                className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                Remove Role
                                            </button>
                                        )}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
