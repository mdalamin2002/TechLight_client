import React from "react";
import { Link } from "react-router";

const LaptopCard = ({ laptop }) => {
  const { name, image, processor, graphics, ram, storage, features, price } = laptop;
  console.log(laptop);
  return (
    <div className="bg-white p-4 flex flex-col shadow-lg rounded-lg">
      {/* Image Div  */}
      <div className="">
        <div className="border-b-1 border-gray-200 mb-3">
          <img src={image} alt="Laptop" className="object-cover" />
        </div>
        <Link className="font-bold hover:underline hover:text-red-400">{name}</Link>
        <ul className=" list-disc ml-3 my-4 text-gray-600 space-y-1 text-sm">
          <li>Processor : {processor}</li>
          <li>Ram : {ram}</li>
          <li>Graphics : {graphics}</li>
          <li>Features : {features}</li>
        </ul>
      </div>
      <div className="flex flex-col flex-grow justify-end">
        <div className="border-t-1 border-gray-200 mt-3 w-full">
          <p className="text-center text-rose-400 text-lg font-semibold mt-2">{price}</p>
        </div>
        <button className="bg-blue-500 text-white cursor-pointer py-1 rounded-lg my-2">Buy Now</button>
      </div>
    </div>
  );
};

export default LaptopCard;
