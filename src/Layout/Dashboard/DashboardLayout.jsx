import React from "react";
import { Outlet } from "react-router";
import DashboardSidebar from "./DashboardSidebar"; 

import DashboardNavbar from "./DashboardNavbar";
import useAuth from "@/hooks/useAuth";
import GlobalLoading from "@/Components/Shared/Loading/GlobalLoading";

const DashboardLayout = () => {
  const { loading } = useAuth();
    if(loading) return <GlobalLoading></GlobalLoading>
  return (
    <div className="flex min-h-screen  bg-background">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
       <DashboardNavbar />

        {/* Main Outlet */}
        <main className="flex-1 p-2 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

