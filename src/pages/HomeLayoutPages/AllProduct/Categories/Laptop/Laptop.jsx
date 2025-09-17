import React, { useEffect, useState } from 'react';

const Laptop = () => {
    const [laptop, setLaptop] = useState([]);
    useEffect(() => {
        fetch("/public/ProductsFakeData.json").then(res =>res.json())
            .then(result => setLaptop(result));
    }, [])
    
    return (
        <div className="bg-amber-50 w-full h-screen">
            <div className='w-11/12 mx-auto'>
            {/* Top side */}
            <div className=" bg-white py-2">
                <h3 className='text-2xl font-semibold'>All Laptop</h3>
                </div>
                <div className="">

                </div>
        </div>
        </div>
    );
};

export default Laptop;