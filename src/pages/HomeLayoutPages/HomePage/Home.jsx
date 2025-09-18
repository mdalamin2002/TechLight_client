import React from 'react';
import Banner from './components/Banner';
import { ContactUs } from './components/ContactUs';
import TopProducts from './components/TopProducts';
import FeaturedSection from './components/FeaturedSection';
import CompanyLogoMarquee from './components/CompanyLogoMarquee';

const Home = () => {
    return (
        <div className='w-11/12 mx-auto'>
            <Banner></Banner>
            <ContactUs></ContactUs>
            <TopProducts></TopProducts>
            <FeaturedSection></FeaturedSection>
            <CompanyLogoMarquee></CompanyLogoMarquee>
        </div>
    );
};

export default Home;