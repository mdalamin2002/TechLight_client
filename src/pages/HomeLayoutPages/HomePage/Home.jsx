import React from 'react';
import Banner from './components/Banner';
import TopProducts from './components/TopProducts';

const Home = () => {
    return (
        <div className='w-11/12 mx-auto'>
            <Banner></Banner>
            <TopProducts></TopProducts>
        </div>
    );
};

export default Home;