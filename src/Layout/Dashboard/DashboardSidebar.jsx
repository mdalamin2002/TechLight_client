import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, FileText, DollarSign, User } from "lucide-react"; // icons

export default function DashboardSidebar() {
  const role = "admin"; // "moderator" or "user"

  const NavItem = ({ to, label, icon: Icon }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-all duration-300 
        ${
          isActive
            ? ""
            : "text-gray-300 hover:bg-purple-700/50 hover:text-white"
        }`
      }
    >
      {Icon && <Icon size={18} />}
      {label}
    </NavLink>
  );

  const navConfig = {
    admin: [
      { to: "/dashboard", label: "Dashboard", icon: Home },
      { to: "/dashboard/AllUsers", label: "Users", icon: Users },
      { to: "/dashboard/AllDonationRequests", label: "Requests", icon: FileText },
      { to: "/dashboard/ContentManagementPage", label: "Content", icon: FileText },
      { to: "/dashboard/funding-money", label: "Funding", icon: DollarSign },
      { to: "/dashboard/profile", label: "Profile", icon: User },
    ],
    moderator: [
      { to: "/dashboard", label: "Dashboard", icon: Home },
      { to: "/dashboard/AllDonationRequests", label: "Requests", icon: FileText },
      { to: "/dashboard/ContentManagementPage", label: "Content", icon: FileText },
      { to: "/dashboard/funding-money", label: "Funding", icon: DollarSign },
      { to: "/dashboard/profile", label: "Profile", icon: User },
    ],
    user: [
      { to: "/dashboard", label: "Dashboard", icon: Home },
      { to: "/dashboard/MyDonationRequests", label: "My Requests", icon: FileText },
      { to: "/dashboard/create-donation-request", label: "Create Donation", icon: FileText },
      { to: "/dashboard/profile", label: "Profile", icon: User },
    ],
  };

  const items = navConfig[role] || navConfig["user"];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col gap-6 p-4 min-h-screen w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white">
        <h2 className="text-xl font-bold px-4">Admin Panel</h2>
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
        </ul>
      </nav>

      {/* Mobile Navbar */}
      <nav className="flex md:hidden gap-2 overflow-x-auto bg-purple-900 text-white shadow p-2">
        <ul className="flex gap-2">
          {items.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
        </ul>
      </nav>
    </>
  );
}
