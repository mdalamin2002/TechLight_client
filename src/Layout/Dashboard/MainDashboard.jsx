import React from 'react';
import Admin_Home from './AdminDashboard/components/Admin_Home/Admin_Home';
import { ModeratorOverview } from './ModeratorDashboard/components/ModeratorOverview/ModeratorOverview';
import Overview from './UserDashboard/components/Overview/Overview';
import useAuth from '@/hooks/useAuth';
import SellerOverview from './SellerDashboard/components/SellerDashboardOverview/SellerOverview';

const MainDashboard = () => {
    const { userData } = useAuth();

    const role = userData?.role || "user"; 
    return (
        <div>
            {role === "admin" && <Admin_Home></Admin_Home>}
            {role === "moderator" && <ModeratorOverview></ModeratorOverview>}
            {role === "user" && <Overview></Overview>}
            { role === "seller" && <SellerOverview></SellerOverview>}
        </div>
    );
};

export default MainDashboard;