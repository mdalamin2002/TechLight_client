import React from 'react';

const LaptopCard = ({ laptop }) => {
    const { name, image,processor,graphics,ram,storage,features,price } = laptop;
    console.log(laptop);
    return (
        <div className='bg-white p-4'>
            {/* Image Div  */}
            <div className="">
                <img src={image} alt="Laptop" />
            </div>
            <p className='font-bold'>{name}</p>
            <ul className=' list-disc list-inside'>
                <li>Processor : { processor}</li>
                <li>Ram : { ram}</li>
                <li>Graphics : { graphics}</li>
                <li>Features : { features}</li>
            </ul>
            <hr />
            <p>{price}</p>
            <div className="">
                <button>Buy Now</button>
            </div>
        </div>
    );
};

export default LaptopCard;