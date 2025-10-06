// TanStackTable.jsx
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Calendar, Search,
} from "lucide-react";
import DebouncedInput from './DebouncedInput';
import DownloadBtn from './DownloadBtn';
import Pagination from './Pagination';
import UserTable from './UserTable';

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

  // ===== SweetAlert Wrapper =====
  const handleActionWithConfirm = (actionType, user) => {
    let actionText = "";
    switch (actionType) {
      case "toggleBan":
        actionText = user.status === "active" ? "ban" : "unban";
        break;
      case "makeModerator":
        actionText = "make Moderator";
        break;
      case "makeAdmin":
        actionText = "make Admin";
        break;
      case "removeRole":
        actionText = "remove Role";
        break;
      default:
        actionText = actionType;
    }

    Swal.fire({
      title: `Are you sure?`,
      html: `
        <b>User:</b> ${user.user} <br/>
        <b>Email:</b> ${user.email} <br/>
        <b>Current Role:</b> ${user.role} <br/>
        <b>Status:</b> ${user.status} <br/><br/>
        You are about to <b>${actionText}</b> this user.
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        switch (actionType) {
          case "toggleBan":
            handleToggleBan(user.id);
            break;
          case "makeModerator":
            handleMakeModerator(user.id);
            break;
          case "makeAdmin":
            handleMakeAdmin(user.id);
            break;
          case "removeRole":
            handleRemoveRole(user.id);
            break;
        }
        Swal.fire({
          title: "Success!",
          text: `User updated successfully.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setOpenMenu(null);
      }
    });
  };

  // ===== Columns =====
  const columns = [
    columnHelper.accessor("id", {
      id: "S.No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: () => <div className="flex items-center gap-1"> S.No</div>,
    }),
    columnHelper.accessor("avatar", {
      cell: (info) => <img src={info.getValue()} alt="profile" className='rounded-full w-10 h-10 object-cover border-2 border-indigo-200 shadow-sm' />,
      header: () => <div className="flex items-center gap-1"> Profile</div>,
    }),
    columnHelper.accessor("user", {
      cell: (info) => <span className='font-semibold text-gray-800'>{info.getValue()}</span>,
      header: () => <div className="flex items-center gap-1"> User</div>,
    }),
    columnHelper.accessor("email", {
      cell: (info) => <span className='text-gray-600'>{info.getValue()}</span>,
      header: () => <div className="flex items-center gap-1"> Email</div>,
    }),
    columnHelper.accessor("role", {
      cell: (info) => <span className='capitalize text-indigo-600 font-medium'>{info.getValue()}</span>,
      header: () => <div className="flex items-center gap-1"> Role</div>,
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
      header: () => <div className="flex items-center gap-1"> Join Date</div>,
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
    <div className='rounded-2xl'>

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
      <UserTable
        table={table}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        handleActionWithConfirm={handleActionWithConfirm}
      />

      {/* Pagination   */}
      <Pagination table={table} />
    </div>
  );
};

export default TanStackTable;
