import React from 'react';
import Banner from './components/Banner';
import TopProducts from './components/TopProducts';
import FeaturedSection from './components/FeaturedSection';
import CompanyLogoMarquee from './components/CompanyLogoMarquee';
import Reviews from './components/Reviews';
import Tracking from './components/Tracking';
import ContactUs from './components/ContactUs';

const Home = () => {
    return (
        <div className='w-11/12 mx-auto'>
            <Banner></Banner>
            <TopProducts></TopProducts>
            <FeaturedSection></FeaturedSection>
            <CompanyLogoMarquee></CompanyLogoMarquee>
            <Tracking></Tracking>
            <ContactUs></ContactUs>
             <Reviews></Reviews>
        </div>

    );
};

export default Home;
