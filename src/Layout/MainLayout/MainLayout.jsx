import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../Components/Shared/Navbar/Navbar';
import Footer from '../../Components/Shared/Footer/Footer';

const MainLayout = () => {
    return (
        <div className='bg-background'>
            <Navbar></Navbar>
            <div className="pt-16">
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;
