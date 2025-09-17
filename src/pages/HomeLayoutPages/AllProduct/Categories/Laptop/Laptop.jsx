import React, { useEffect, useState } from 'react';
import LaptopCard from '../../../../../Components/Cards/LaptopCard/LaptopCard';

const Laptop = () => {
    const [laptops, setLaptops] = useState([]);
    useEffect(() => {
        fetch("/public/ProductsFakeData.json").then(res =>res.json())
            .then(result => setLaptops(result));
    }, [])

    return (
        <div className="bg-amber-50 w-full min-h-screen">
            <div className='w-11/12 mx-auto'>
            {/* Top side */}
            <div className=" bg-white py-2">
                <h3 className='text-2xl font-semibold'>All Laptop</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {
                        laptops.map(laptop=><LaptopCard key={laptop?.id} laptop={laptop}></LaptopCard>)
                    }
                </div>
        </div>
        </div>
    );
};

export default Laptop;