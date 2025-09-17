import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../Components/Shared/Navbar/Navbar';
import Footer from '../../Components/Shared/Footer/Footer';
import ReviewSection from '../../pages/HomeLayoutPages/HomePage/components/Reviews';

const MainLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className="max-w-[1440px] mx-auto">
                <Outlet></Outlet>
            </div>
            <ReviewSection></ReviewSection>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;