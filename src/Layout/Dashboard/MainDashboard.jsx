import React from 'react';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import ModeratorDashboard from './ModeratorDashboard/ModeratorDashboard';
import UserDashboard from './UserDashboard/UserDashboard';

const MainDashboard = () => {
    const role = "moderator"; 
    return (
        <div>
            {role === "admin" && <AdminDashboard></AdminDashboard>}
            {role === "moderator" && <ModeratorDashboard></ModeratorDashboard>}
            {role === "user" && <UserDashboard></UserDashboard>}
        </div>
    );
};

export default MainDashboard;