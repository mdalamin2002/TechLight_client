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
  Star,
  PhoneCall,
  BarChart3Icon,
  FileText,
  LayoutDashboard,
  User,
  Heart,
  MapPin,
  CreditCard,
  RotateCcw,
  MessageCircle,
  PackageOpen,
  SettingsIcon,
  CreditCardIcon,
  Bell,
} from "lucide-react";
import TechLightLogo from "@/Components/Shared/Logo/TechLightLogo";

export default function DashboardSidebar() {
  const role = "moderator"; // "admin", "moderator", or "user"

  const NavItem = ({ to, label, icon: Icon }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
            : "text-primary-foreground hover:text-purple-300 hover:bg-purple-500/10"
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
      {
        to: "/dashboard/communication",
        label: "Communication",
        icon: MessageSquare,
      },
      { to: "/dashboard/reports", label: "Reports", icon: BarChart3 },
      { to: "/dashboard/settings", label: "Settings", icon: Settings },
      { to: "/dashboard/advanced", label: "Advanced", icon: Zap },
    ],

    moderator: [
      { to: "/dashboard/moderator-overview", label: "Dashboard", icon: Home },
      { to: "/dashboard/orders-products", label: "Orders Products", icon: Box },
      { to: "/dashboard/users-reviews", label: "Users Reviews", icon: Star },
      {
        to: "/dashboard/support-communication",
        label: "Support",
        icon: PhoneCall,
      },
      {
        to: "/dashboard/reports-analytics",
        label: "Reports Analytics",
        icon: BarChart3Icon,
      },
      {
        to: "/dashboard/developer-notes",
        label: "Developer Notes",
        icon: FileText,
      },
      {
        to: "/dashboard/moderator-settings",
        label: "Settings",
        icon: SettingsIcon,
      },
      {
        to: "/dashboard/payments",
        label: "Payments",
        icon: CreditCardIcon,
      },
      {
        to: "/dashboard/notifications",
        label: "Notifications",
        icon: Bell,
      },
    ],

    user: [
      { to: "/dashboard/my-overview", label: "Overview", icon: LayoutDashboard },
      { to: "/dashboard/my-profile", label: "Profile", icon: User },
      { to: "/dashboard/my-orders", label: "My Orders", icon: PackageOpen },
      { to: "/dashboard/my-wishlist", label: "Wishlist", icon: Heart },
      { to: "/dashboard/my-cart", label: "Cart", icon: ShoppingCart },
      { to: "/dashboard/my-addresses", label: "Addresses", icon: MapPin },
      { to: "/dashboard/my-payment-methods", label: "Payment Methods", icon: CreditCard },
      { to: "/dashboard/my-returns", label: "Returns", icon: RotateCcw },
      { to: "/dashboard/my-settings", label: "Settings", icon: Settings },
      { to: "/dashboard/my-support", label: "support", icon: MessageCircle }
    ],
  };

  const items = navConfig[role] || navConfig["user"];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col gap-6 p-4 min-h-screen w-64 bg-gradient-to-b bg-primary">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-textPrimary">
          <TechLightLogo />
        </Link>
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </ul>
      </nav>

      {/* Mobile Navbar */}
      <nav className="flex md:hidden gap-2 overflow-x-auto shadow p-2">
        <ul className="flex gap-2">
          {items.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </ul>
      </nav>
    </>
  );
}
