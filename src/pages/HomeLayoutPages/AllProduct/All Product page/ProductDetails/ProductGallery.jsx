import React from "react";

const ProductGallery = ({ product, selectedImage, setSelectedImage }) => {
  const discount = (
    ((product.regularPrice - product.price) / product.regularPrice) *
    100
  ).toFixed(0);

  return (
    <div className="lg:col-span-7 flex gap-3">
      <div className="flex flex-col gap-2 w-16 md:w-20">
        {product.images.gallery.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(idx)}
            className={`relative bg-card rounded-lg overflow-hidden border-2 transition-all duration-300 hover:border-primary aspect-square ${
              selectedImage === idx
                ? "border-primary shadow-md"
                : "border-border"
            }`}
          >
            <img
              src={img}
              alt={`View ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <div className="flex-1 relative bg-card rounded-xl overflow-hidden border border-border group">
        <div className="aspect-square flex items-center justify-center ">
          <img
            src={product.images.gallery[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
            {discount}% OFF
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
