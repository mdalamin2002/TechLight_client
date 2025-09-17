import React from 'react';
import Banner from './components/Banner';
import TopProducts from './components/TopProducts';
import FeaturedSection from './components/FeaturedSection';

const Home = () => {
    return (
        <div className='w-11/12 mx-auto'>
            <Banner></Banner>
            <TopProducts></TopProducts>
            <FeaturedSection></FeaturedSection>
        </div>
    );
};

export default Home;