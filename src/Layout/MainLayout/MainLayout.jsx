import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../Components/Shared/Navbar/Navbar';
import Footer from '../../Components/Shared/Footer/Footer';

const MainLayout = () => {
    return (
        <div className='bg-background'>
            <Navbar></Navbar>
            <div className="max-w-[1440px] mx-auto">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;