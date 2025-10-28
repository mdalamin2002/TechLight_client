import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Search, Download } from "lucide-react";
import DebouncedInput from "./DebouncedInput";
import DownloadBtn from "./DownloadBtn";
import Pagination from "./Pagination";
import UserTable from "./UserTable";

const TanStackTable = () => {
  const columnHelper = createColumnHelper();

  // ===== State =====
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openMenu, setOpenMenu] = useState(null);


  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_prod_baseURL}/users`);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== Action Handlers =====
  const handleToggleBan = (id) => {
    setData((prevData) =>
      prevData.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "active" ? "banned" : "active" }
          : user
      )
    );
  };

  const handleMakeModerator = (id) => {
    setData((prevData) =>
      prevData.map((user) =>
        user.id === id ? { ...user, role: "Moderator" } : user
      )
    );
  };

  const handleMakeAdmin = (id) => {
    setData((prevData) =>
      prevData.map((user) =>
        user.id === id ? { ...user, role: "Admin" } : user
      )
    );
  };

  const handleRemoveRole = (id) => {
    setData((prevData) =>
      prevData.map((user) =>
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
      cell: (info) => (
        <span className="font-medium text-muted-foreground">
          {info.row.index + 1}
        </span>
      ),
      header: "S.No",
    }),
    columnHelper.accessor("avatar", {
      cell: (info) => (
        <img
          src={info.getValue()}
          alt="profile"
          className="rounded-full w-10 h-10 object-cover border-2 border-primary/20 shadow-md"
        />
      ),
      header: "Profile",
    }),
    columnHelper.accessor("name", {
      cell: (info) => (
        <span className="font-semibold text-foreground">{info.getValue()}</span>
      ),
      header: "User",
    }),
    columnHelper.accessor("email", {
      cell: (info) => (
        <span className="text-muted-foreground text-sm">{info.getValue()}</span>
      ),
      header: "Email",
    }),
    columnHelper.accessor("role", {
      cell: (info) => {
        const role = info.getValue();
        const colors = {
          Admin: "bg-purple-100 text-purple-700 border-purple-200",
          Moderator: "bg-blue-100 text-blue-700 border-blue-200",
          User: "bg-gray-100 text-gray-700 border-gray-200",
        };
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              colors[role] || colors.User
            }`}
          >
            {role}
          </span>
        );
      },
      header: "Role",
    }),
    columnHelper.accessor("status", {
      cell: (info) => {
        const status = info.getValue();
        const colors = {
          active: "bg-green-500",
          pending: "bg-yellow-400",
          banned: "bg-red-500",
        };
        return (
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${colors[status]} animate-pulse`}
            ></span>
            <span className="capitalize text-foreground text-sm font-medium">
              {status}
            </span>
          </div>
        );
      },
      header: "Status",
    }),
    columnHelper.accessor("created_at", {
      cell: (info) => {
        const date = new Date(info.getValue()).toISOString().split("T")[0];
        return <span className="text-muted-foreground text-sm">{date}</span>;
      },
      header: "Join Date",
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
    <div className="bg-card rounded-2xl shadow-lg border border-border/50  py-6 md:px-6 px-3 backdrop-blur-sm">
      {/* Search + ⬇ Download */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <DebouncedInput
            value={globalFilter}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search users..."
            className="py-2.5 pl-10 pr-4 bg-background border border-border rounded-xl w-full focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <DownloadBtn data={data} user={"user"} icon />
      </div>

      {/* Table */}
      <UserTable
        table={table}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        handleActionWithConfirm={handleActionWithConfirm}
      />

      {/* Pagination */}
      <Pagination table={table} />
    </div>
  );
};

export default TanStackTable;
