// TanStackTable.jsx
import { 
  createColumnHelper, 
  flexRender, 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getFilteredRowModel 
} from '@tanstack/react-table';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Mail, Shield, Calendar, Hash, Search, 
  ChevronLeft, ChevronRight, Settings 
} from "lucide-react";
import DebouncedInput from './DebouncedInput';
import DownloadBtn from './DownloadBtn';

const TanStackTable = () => {
  const columnHelper = createColumnHelper();

  // ===== State =====
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [openMenu, setOpenMenu] = useState(null);

  // ===== Load data from JSON =====
  useEffect(() => {
    axios.get("/users.json")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);
  console.log(data);
  

  // ===== Action Handlers =====
  const handleToggleBan = (id) => {
    setData(prevData =>
      prevData.map(user =>
        user.id === id
          ? { ...user, status: user.status === "active" ? "banned" : "active" }
          : user
      )
    );
  };

  const handleMakeModerator = (id) => {
    setData(prevData =>
      prevData.map(user =>
        user.id === id ? { ...user, role: "Moderator" } : user
      )
    );
  };

  const handleMakeAdmin = (id) => {
    setData(prevData =>
      prevData.map(user =>
        user.id === id ? { ...user, role: "Admin" } : user
      )
    );
  };

  const handleRemoveRole = (id) => {
    setData(prevData =>
      prevData.map(user =>
        user.id === id ? { ...user, role: "User" } : user
      )
    );
  };

  // ===== Columns =====
  const columns = [
    columnHelper.accessor("id", {
      id: "S.No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: () => <div className="flex items-center gap-1"><Hash size={16} /> S.No</div>,
    }),
    columnHelper.accessor("avatar", {
      cell: (info) => <img src={info.getValue()} alt="profile" className='rounded-full w-10 h-10 object-cover border-2 border-indigo-200 shadow-sm' />,
      header: () => <div className="flex items-center gap-1"><User size={16} /> Profile</div>,
    }),
    columnHelper.accessor("user", {
      cell: (info) => <span className='font-semibold text-gray-800'>{info.getValue()}</span>,
      header: () => <div className="flex items-center gap-1"><User size={16} /> User</div>,
    }),
    columnHelper.accessor("email", {
      cell: (info) => <span className='text-gray-600'>{info.getValue()}</span>,
      header: () => <div className="flex items-center gap-1"><Mail size={16} /> Email</div>,
    }),
    columnHelper.accessor("role", {
      cell: (info) => <span className='capitalize text-indigo-600 font-medium'>{info.getValue()}</span>,
      header: () => <div className="flex items-center gap-1"><Shield size={16} /> Role</div>,
    }),
    columnHelper.accessor("status", {
      cell: (info) => {
        const status = info.getValue();
        const color = status === 'active' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-400' : 'bg-red-500';
        return (
          <div className='flex items-center gap-2'>
            <span className={`w-3 h-3 rounded-full ${color}`}></span>
            <span className='capitalize text-gray-700'>{status}</span>
          </div>
        );
      },
      header: "Status",
    }),
    columnHelper.accessor("joinDate", {
      cell: (info) => <span className='text-gray-600'>{info.getValue()}</span>,
      header: () => <div className="flex items-center gap-1"><Calendar size={16} /> Join Date</div>,
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
    <div className='p-6 max-w-6xl mx-auto bg-gradient-to-br from-white via-indigo-50 to-indigo-100 shadow-lg rounded-2xl'>

      {/* 🔍 Search + ⬇ Download */}
      <div className='flex flex-col md:flex-row justify-between mb-6 gap-3 items-center'>
        <div className="relative w-72">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <DebouncedInput
            value={globalFilter}
            onChange={value => setGlobalFilter(String(value))}
            placeholder="Search all columns..."
            className="py-2 pl-10 pr-3 bg-white shadow-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
        <DownloadBtn data={data} user={"user"} icon />
      </div>

      {/* 📊 Table */}
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
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => handleToggleBan(row.original.id)}
                        className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {row.original.status === "active" ? "Ban" : "Unban"}
                      </button>
                      {row.original.role === "User" && (
                        <button
                          onClick={() => handleMakeModerator(row.original.id)}
                          className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Make Moderator
                        </button>
                      )}
                      {(row.original.role === "User" || row.original.role === "Moderator") && (
                        <button
                          onClick={() => handleMakeAdmin(row.original.id)}
                          className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Make Admin
                        </button>
                      )}
                      {(row.original.role === "Admin" || row.original.role === "Moderator") && (
                        <button
                          onClick={() => handleRemoveRole(row.original.id)}
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

      {/* 📑 Pagination */}
      <div className='flex flex-wrap items-center justify-between gap-4 mt-6'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className='px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition flex items-center gap-1'>
            <ChevronLeft size={16} /> Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className='px-3 py-1.5 rounded-lg bg-indigo-500 text-white disabled:bg-gray-300 hover:bg-indigo-600 transition flex items-center gap-1'>
            Next <ChevronRight size={16} />
          </button>
        </div>

        
      </div>
    </div>
  );
};

export default TanStackTable;
