import React from 'react';
import { Bell, User } from "lucide-react";
const DashboardNavbar = () => {
    return (
        <header className="flex items-center justify-between px-6 py-3 bg-primary border-b ">
            {/* Search box */}
            <div className="w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full input:focus"
                />
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-4">
                <button className="relative">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 h-2 w-2  rounded-full"></span>
                </button>
                <button className="p-2 rounded-full ">
                    <User size={20} />
                </button>
            </div>
        </header>
    );
};

export default DashboardNavbar;