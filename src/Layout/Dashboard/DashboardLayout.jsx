import React, { useState } from "react";
import { Outlet } from "react-router";
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";
import useAuth from "@/hooks/useAuth";
import GlobalLoading from "@/Components/Shared/Loading/GlobalLoading";

const DashboardLayout = () => {
  const { loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) return <GlobalLoading />;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 bottom-0 w-64">
        <DashboardSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <DashboardNavbar
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Outlet */}
        <main className="flex-1 p-1 sm:p-6 overflow-y-auto w-[calc(100%-288px)] ml-72">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
