import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Search, Download } from "lucide-react";
import DebouncedInput from "./DebouncedInput";
import DownloadBtn from "./DownloadBtn";
import Pagination from "./Pagination";
import UserTable from "./UserTable";
import useAxiosSecure from "@/utils/useAxiosSecure";

const TanStackTable = () => {
  const columnHelper = createColumnHelper();

  // ===== State =====
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const axiosSecure = useAxiosSecure();

  // console.log(" ", data);
  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get(`/users`);
      // Transform the data to match the expected structure
      const transformedData = Array.isArray(res.data) ? res.data.map(user => ({
        ...user,
        id: user._id,
        name: user.name || user.user || 'Unknown',
        user: user.name || user.user || 'Unknown',
        role: user.role || 'user',
        status: user.status || 'active',
        created_at: user.created_at || user.joinDate || new Date().toISOString()
      })) : [];
      setData(transformedData);
    } catch (err) {
      console.error("Error fetching users:", err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== Action Handlers =====
  const handleToggleBan = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      const response = await axiosSecure.patch(`/users/status/${id}`, { status: newStatus });

      if (response.data.success) {
        // Update local state
        setData((prevData) =>
          prevData.map((user) =>
            user._id === id
              ? { ...user, status: newStatus }
              : user
          )
        );
        return { success: true };
      } else {
        throw new Error(response.data.message || "Failed to update user status");
      }
    } catch (err) {
      console.error("Error updating user status:", err);
      return { success: false, error: err.message };
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    try {
      const response = await axiosSecure.patch(`/users/role/${id}`, { newRole });

      if (response.data.success) {
        // Update local state
        setData((prevData) =>
          prevData.map((user) =>
            user._id === id ? { ...user, role: newRole } : user
          )
        );
        return { success: true };
      } else {
        throw new Error(response.data.message || "Failed to update user role");
      }
    } catch (err) {
      console.error("Error updating user role:", err);
      return { success: false, error: err.message };
    }
  };

  // ===== SweetAlert Wrapper =====
  const handleActionWithConfirm = async (actionType, user) => {
    let actionText = "";
    let actionPromise = null;

    switch (actionType) {
      case "toggleBan":
        actionText = user.status === "active" ? "ban" : "unban";
        actionPromise = handleToggleBan(user._id, user.status);
        break;
      case "makeModerator":
        actionText = "make Moderator";
        actionPromise = handleUpdateRole(user._id, "moderator");
        break;
      case "makeAdmin":
        actionText = "make Admin";
        actionPromise = handleUpdateRole(user._id, "admin");
        break;
      case "makeSeller":
        actionText = "make Seller";
        actionPromise = handleUpdateRole(user._id, "seller");
        break;
      case "removeRole":
        actionText = "remove Role";
        actionPromise = handleUpdateRole(user._id, "user");
        break;
      default:
        actionText = actionType;
    }

    Swal.fire({
      title: `Are you sure?`,
      html: `
        <b>User:</b> ${user.name || user.user} <br/>
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await actionPromise;

        if (response.success) {
          Swal.fire({
            title: "Success!",
            text: `User updated successfully.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: response.error || "Failed to update user.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
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

    // columnHelper.accessor("avatar", {
    //   cell: (info) => (
    //     <img
    //       src={info.getValue()}
    //       alt="profile"
    //       className="rounded-full w-10 h-10 object-cover border-2 border-primary/20 shadow-md"
    //     />
    //   ),
    //   header: "Profile",
    // }),
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
          admin: "bg-purple-100 text-purple-700 border-purple-200",
          moderator: "bg-blue-100 text-blue-700 border-blue-200",
          seller: "bg-green-100 text-green-700 border-green-200",
          user: "bg-gray-100 text-gray-700 border-gray-200",
        };
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              colors[role] || colors.user
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
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
          blocked: "bg-red-500",
        };
        return (
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${colors[status] || colors.pending} animate-pulse`}
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
