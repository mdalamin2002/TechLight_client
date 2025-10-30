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
  FileText,
  LayoutDashboard,
  User,
  Heart,
  MapPin,
  CreditCard,
  RotateCcw,
  MessageCircle,
  PackageOpen,
  Bell,
  ChevronRight,
  Lightbulb,
  BadgePercent,
  PlusCircle,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
// import useAuth from "@/hooks/useAuth";

export default function DashboardSidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {

  const { userData } = useAuth();
  const role = userData?.role; // "admin", "moderator", or "user"
  console.log(role);



  const NavItem = ({ to, label, icon: Icon, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group mb-1 flex items-center gap-3 px-4 py-2.5 rounded-xl  font-medium relative border ${
          isActive
            ? "bg-gradient-to-r from-primary/15 via-primary/10 to-transparent text-primary  border-primary/30"
            : "text-foreground/70 hover:text-primary hover:bg-primary/8 border-transparent hover:border-primary/20  hover:shadow-md"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <Icon
              size={20}
              className={`transition-all duration-300 ease-in-out ${
                isActive ? "scale-105" : "group-hover:scale-105"
              }`}
            />
          )}
          <span className="truncate text-sm">{label}</span>
          {isActive && <ChevronRight size={16} className="ml-auto" />}
        </>
      )}
    </NavLink>
  );

  const navConfig = {
    admin: [
      { to: "/dashboard/home", label: "Dashboard", icon: Home },
      { to: "/dashboard/users", label: "Users", icon: Users },
      // { to: "/dashboard/sellers", label: "Sellers", icon: Store },
      { to: "/dashboard/products", label: "Products", icon: Box },
      { to: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
      // { to: "/dashboard/finance", label: "Finance", icon: DollarSign },
      {
        to: "/dashboard/communication",
        label: "Communication",
        icon: MessageSquare,
      },
      { to: "/dashboard/admin/support", label: "Support Management", icon: PhoneCall },
      { to: "/dashboard/reports", label: "Reports", icon: BarChart3 },
      { to: "/dashboard/offers", label: "Offers", icon: BadgePercent },
      { to: "/dashboard/settings", label: "Settings", icon: Settings },
      // { to: "/dashboard/advanced", label: "Advanced", icon: Zap },
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
        icon: BarChart3,
      },
      {
        to: "/dashboard/developer-notes",
        label: "Developer Notes",
        icon: FileText,
      },
      {
        to: "/dashboard/moderator-settings",
        label: "Settings",
        icon: Settings,
      },
      {
        to: "/dashboard/payments",
        label: "Payments",
        icon: CreditCard,
      },
      {
        to: "/dashboard/notifications",
        label: "Notifications",
        icon: Bell,
      },
    ],

    seller:[
      {
        to: "/dashboard/seller-overview",
        label: "Overview",
        icon: LayoutDashboard
      },
      {
        to: "/dashboard/seller-products-orders",
        label: "All Orders",
        icon: Box
      },
      {
        to: "/dashboard/seller-products-list",
        label: "Products List",
        icon: Store
      },
      {
        to: "/dashboard/seller-earnings",
        label: "Earnings",
        icon: DollarSign
      },
      {
        to: "/dashboard/seller-add-product",
        label: "Add New Product",
        icon: PlusCircle
      },
      {
        to: "/dashboard/seller-coupons",
        label: "Coupons",
        icon: Star
      },
      {
        to: "/dashboard/seller-products-reviews",
        label: "Product Reviews",
        icon: Star
      },
      {
        to: "/dashboard/seller-support-help",
        label: "Support Help",
        icon: MessageSquare
      },
      {
        to: "/dashboard/seller-settings",
        label: "Settings",
        icon: Settings
      },
    ],

    user: [
      {
        to: "/dashboard/my-overview",
        label: "Overview",
        icon: LayoutDashboard,
      },
      { to: "/dashboard/my-profile", label: "Profile", icon: User },
      { to: "/dashboard/my-orders", label: "My Orders", icon: PackageOpen },
      { to: "/dashboard/my-wishlist", label: "Wishlist", icon: Heart },
      { to: "/dashboard/my-cart", label: "Cart", icon: ShoppingCart },
      { to: "/dashboard/my-addresses", label: "Addresses", icon: MapPin },
      {
        to: "/dashboard/my-payment-methods",
        label: "Payment Methods",
        icon: CreditCard,
      },
      { to: "/dashboard/my-returns", label: "Returns", icon: RotateCcw },
      { to: "/dashboard/my-settings", label: "Settings", icon: Settings },
      { to: "/dashboard/my-support", label: "Support", icon: MessageCircle },
    ],
  };

  const items = navConfig[role] || navConfig["user"];

  return (
    <>
      {/* Desktop Sidebar - xl screens (1280px+) */}
      <nav className="hidden xl:flex flex-col gap-6 p-5 min-h-screen w-72 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 border-r border-sidebar-border/40 shadow-xl backdrop-blur-xl">
        <Link
          to="/"
          className="flex items-center space-x-2 px-3 rounded-xl hover:bg-primary/5 transition-all duration-300"
        >
          <div className="relative">
            <div className="relative flex justify-center items-center p-2 h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent shadow-md">
              <Lightbulb className="w-7 h-7 text-white" fill="currentColor" />
              <Zap className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
            </div>
          </div>
          <span className="eagle-lake-regular text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TechLight
          </span>
        </Link>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <ul className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {items.map((item) => (
            <li key={item.to}>
              <NavItem to={item.to} label={item.label} icon={item.icon} />
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-sidebar-border/40">
          <div className="flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>System Online</span>
          </div>
        </div>
      </nav>

      {/* Tablet Sidebar - lg to xl screens (1024px - 1279px) */}
      <nav className="hidden lg:flex xl:hidden flex-col gap-5 p-4 min-h-screen w-64 bg-sidebar border-r border-sidebar-border/40 shadow-lg backdrop-blur-lg">
        <Link
          to="/"
          className="flex items-center space-x-2 px-2 rounded-lg hover:bg-primary/5 transition-all duration-300"
        >
          <div className="relative">
            <div className="relative flex justify-center items-center p-2 h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent shadow-md">
              <Lightbulb className="w-7 h-7 text-white" fill="currentColor" />
              <Zap className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
            </div>
          </div>
          <span className="eagle-lake-regular text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TechLight
          </span>
        </Link>

        <div className="h-px bg-border/50" />

        <ul className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
          {items.map((item) => (
            <li key={item.to}>
              <NavItem to={item.to} label={item.label} icon={item.icon} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Medium Sidebar - md to lg screens (768px - 1023px) */}
      <nav className="hidden md:flex lg:hidden flex-col gap-4 p-3 min-h-screen w-20 bg-sidebar border-r border-sidebar-border/40 shadow-md backdrop-blur-lg">
        <Link
          to="/"
          className="flex justify-center px-2 rounded-lg hover:bg-primary/5 transition-all"
        >
          <div className="relative flex justify-center items-center p-2 h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent shadow-md">
            <Lightbulb className="w-7 h-7 text-white" fill="currentColor" />
            <Zap className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
          </div>
        </Link>

        <div className="h-px bg-border/50" />

        <ul className="flex flex-col gap-2 flex-1 overflow-y-auto items-center">
          {items.map((item) => (
            <li key={item.to} className="w-full">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center justify-center p-3 rounded-xl transition-all duration-300 relative ${
                    isActive
                      ? "bg-primary/15 text-primary shadow-lg"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/8"
                  }`
                }
              >
                {item.icon && <item.icon size={22} />}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile - Hamburger Menu (below 768px) */}
      <div className="md:hidden">
        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <nav
          className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 border-r border-sidebar-border/40 shadow-2xl backdrop-blur-xl z-50 transform transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-6 p-5 h-full">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-2 rounded-lg hover:bg-primary/5 transition-all duration-300"
            >
              <div className="relative">
                <div className="relative flex justify-center items-center p-2 h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent shadow-md">
                  <Lightbulb
                    className="w-7 h-7 text-white"
                    fill="currentColor"
                  />
                  <Zap className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300" />
                </div>
              </div>
              <span className="eagle-lake-regular text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TechLight
              </span>
            </Link>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <ul className="flex flex-col gap-2 flex-1 overflow-y-auto">
              {items.map((item) => (
                <li key={item.to}>
                  <NavItem
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-sidebar-border/40">
              <div className="flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>System Online</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
