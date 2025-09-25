import React from "react";
import { Search, Filter, Shield, MoreHorizontal, User as UserIcon, Crown } from "lucide-react";

const AllUsers = () => {
    const users = [
        { name: "John Doe", email: "john@example.com", role: "User", status: "Active", date: "2024-01-15" },
        { name: "Jane Smith", email: "jane@example.com", role: "Seller", status: "Active", date: "2024-02-20" },
        { name: "Mike Johnson", email: "mike@example.com", role: "Moderator", status: "Active", date: "2024-01-10" },
        { name: "Sarah Wilson", email: "sarah@example.com", role: "User", status: "Banned", date: "2024-03-05" },
        { name: "David Brown", email: "david@example.com", role: "Admin", status: "Active", date: "2023-12-01" },
        { name: "Mike Johnson", email: "mike@example.com", role: "Moderator", status: "Active", date: "2024-01-10" },
        { name: "Sarah Wilson", email: "sarah@example.com", role: "User", status: "Banned", date: "2024-03-05" },
        { name: "David Brown", email: "david@example.com", role: "Admin", status: "Active", date: "2023-12-01" },
    ];

    return (
        <div className="min-h-screen  bg-background">
            {/* Header */}
            <div className="mb-6 ml-2">
                <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
                <p className="text-sm text-gray-500 ">Manage users, roles, and permissions across your platform.</p>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4  mb-6">
                <div className="flex items-center  rounded-lg px-3 w-full md:w-1/2">
                    <Search className="text-gray-400 w-5 h-5 mr-2" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className=" w-full outline-none text-sm "
                    />
                </div>
                <select className=" px-3 py-2 rounded-lg text-sm outline-none w-full md:w-auto">
                    <option>All Roles</option>
                    <option>User</option>
                    <option>Seller</option>
                    <option>Moderator</option>
                    <option>Admin</option>
                </select>
                <button className="flex items-center border-1 px-3 py-2 rounded-lg text-sm">
                    <Filter className="w-4  h-4 mr-2" /> Filter
                </button>
            </div>

            {/* Users Table */}
            <div className=" rounded-2xl mx-2 border-1 shadow-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="border-b-1 ">
                        <tr>
                            <th className="py-3 px-4">User</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Join Date</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, i) => (
                            <tr
                                key={i}
                                className="border-b transition"
                            >
                                <td className="py-3 px-4">
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-4 flex items-center gap-2">
                                    {user.role === "Admin" ? (
                                        <Crown className="w-4 h-4 text-yellow-400" />
                                    ) : user.role === "Moderator" ? (
                                        <Shield className="w-4 h-4 text-blue-400" />
                                    ) : (
                                        <UserIcon className="w-4 h-4 text-gray-400" />
                                    )}
                                    {user.role}
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`${user.status === "Active" ? "text-green-400" : "text-red-400"
                                            } font-medium`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">{user.date}</td>
                                <td className="py-3 px-4 flex items-center gap-3">
                                    <UserIcon className="w-4 h-4 cursor-pointer " />
                                    <Shield className="w-4 h-4 cursor-pointer " />
                                    <MoreHorizontal className="w-4 h-4 cursor-pointer " />

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;
