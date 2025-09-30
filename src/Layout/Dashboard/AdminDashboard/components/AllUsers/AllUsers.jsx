// AllUsers.jsx
import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import axios from "axios";
import User from "./components/User";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  useEffect(() => {
    axios
      .get("/users.json")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Toggle Ban / Unban
  const handleToggleBan = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u
      )
    );
    setOpenMenu(null);
  };

  // Make Moderator
  const handleMakeModerator = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "Moderator" } : u))
    );
    setOpenMenu(null);
  };

  // Make Admin
  const handleMakeAdmin = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "Admin" } : u))
    );
    setOpenMenu(null);
  };

  // Remove Role → User
  const handleRemoveRole = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "User" } : u))
    );
    setOpenMenu(null);
  };

  // Filtered users according to search & role
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.user
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === "All Roles" ? true : user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <p className="text-sm text-gray-500">
          Manage users, roles, and permissions across your platform.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex items-center rounded-lg px-3 w-full md:w-1/2 border bg-white">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full outline-none text-sm py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="px-3 py-2 rounded-lg text-sm outline-none border bg-white"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option>All Roles</option>
          <option>User</option>
          <option>Moderator</option>
          <option>Admin</option>
        </select>

        <button className="flex items-center border px-4 py-2 rounded-lg text-sm bg-white hover:bg-gray-100">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border shadow-md overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-100 text-center text-gray-700">
            <tr>
              <th className="py-3 px-4">Avatar</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Join Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <User
            users={filteredUsers}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            handleToggleBan={handleToggleBan}
            handleMakeModerator={handleMakeModerator}
            handleMakeAdmin={handleMakeAdmin}
            handleRemoveRole={handleRemoveRole}
          />
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
