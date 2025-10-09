import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Users,
  Store,
  Box,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  BarChart3,
  Settings,
  Zap,
  User,
  PackageOpen,
  Heart,
  MapPin,
  CreditCard,
  RotateCcw,
  MessageCircle,
  LayoutDashboard
} from "lucide-react";
import TechLightLogo from "@/Components/Shared/Logo/TechLightLogo";

export default function DashboardSidebar() {
  const role = "Moderateor"; // "moderator" or "user"

  const NavItem = ({ to, label, icon: Icon }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
          ? 'bg-sidebar text-primary border'
          : 'text-foreground hover:text-primary'
        }`
      }
    >
      {Icon && <Icon size={18} />}
      {label}
    </NavLink>
  );

  const navConfig = {
    admin: [
      { to: "/dashboard/home", label: "Dashboard", icon: Home },
      { to: "/dashboard/users", label: "Users", icon: Users },
      { to: "/dashboard/sellers", label: "Sellers", icon: Store },
      { to: "/dashboard/products", label: "Products", icon: Box },
      { to: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
      { to: "/dashboard/finance", label: "Finance", icon: DollarSign },
      { to: "/dashboard/communication", label: "Communication", icon: MessageSquare },
      { to: "/dashboard/reports", label: "Reports", icon: BarChart3 },
      { to: "/dashboard/settings", label: "Settings", icon: Settings },
      { to: "/dashboard/advanced", label: "Advanced", icon: Zap },
    ],
    // moderator: [
    //   { to: "/dashboard", label: "Dashboard", icon: Home },
    //   { to: "/dashboard/AllDonationRequests", label: "Requests", icon: FileText },
    //   { to: "/dashboard/ContentManagementPage", label: "Content", icon: FileText },
    //   { to: "/dashboard/funding-money", label: "Funding", icon: DollarSign },
    //   { to: "/dashboard/profile", label: "Profile", icon: User },
    // ],
    // UserNavigation
    user: [
      { to: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
      { to: "/dashboard/profile", label: "Profile", icon: User },
      { to: "/dashboard/myorders", label: "My Orders", icon: PackageOpen },
      { to: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
      { to: "/dashboard/cart", label: "Cart", icon: ShoppingCart },
      { to: "/dashboard/addresses", label: "Addresses", icon: MapPin },
      { to: "/dashboard/payment-methods", label: "Payment Methods", icon: CreditCard },
      { to: "/dashboard/returns", label: "Returns", icon: RotateCcw },
      { to: "/dashboard/usersettings", label: "Settings", icon: Settings },
      { to: "/dashboard/support", label: "support", icon: MessageCircle }
    ],
  };

  const items = navConfig[role] || navConfig["user"];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col gap-6 p-4 min-h-screen w-64 border-r bg-sidebar">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-textPrimary">
          <TechLightLogo />
        </Link>
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
        </ul>
      </nav>

      {/* Mobile Navbar */}
      <nav className="flex md:hidden gap-2 overflow-x-auto shadow p-2">
        <ul className="flex gap-2">
          {items.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
        </ul>
      </nav>
    </>
  );
}
