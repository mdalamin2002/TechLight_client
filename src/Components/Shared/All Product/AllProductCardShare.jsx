import React from "react";
import { Link } from "react-router";

const AllProductCardShare = ({
  title,
  image,
  details = [],
  price,
  buttonText = "Buy Now",
  buttonAction = () => {}
}) => {
  return (
    <div className="bg-white p-4 flex flex-col shadow-md hover:shadow-xl transition-all rounded-lg">
      {/* Image Section */}
      {image && (
        <div className="border-b border-gray-200 mb-3">
          <img src={image} alt={title} className="object-cover w-48 h-48 mx-auto" />
        </div>
      )}

      {/* Title */}
      {title && (
        <Link
          className="font-semibold text-blue-700 text-[15px] hover:underline hover:text-rose-500 block"
        >
          {title}
        </Link>
      )}

      {/* Details List */}
      {details.length > 0 && (
        <ul className="list-disc ml-4 my-4 text-gray-600 space-y-1 text-sm">
          {details.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      {/* Bottom Section (Price + Button) */}
      <div className="mt-auto flex flex-col">
        {price && (
          <div className="border-t border-gray-200 pt-2">
            <p className="text-center text-rose-500 text-lg font-semibold">{price}</p>
          </div>
        )}
        <button
          className="bg-[#4B5BC2] text-white cursor-pointer py-2 rounded-lg mt-2 hover:bg-[#3749BB] transition-all"
          onClick={buttonAction}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default AllProductCardShare;
