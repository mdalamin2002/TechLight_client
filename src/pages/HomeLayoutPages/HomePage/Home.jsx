import React from 'react';
import Banner from './components/Banner';
import { ContactUs } from './components/ContactUs';

const Home = () => {
    return (
        <div className='w-11/12 mx-auto'>
            <Banner></Banner>
            <ContactUs></ContactUs>
        </div>
    );
};

export default Home;