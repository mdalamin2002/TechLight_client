import React from "react";
import { Star } from "lucide-react";

const SellerProductReviews = () => {
  // Hard-coded seller products
  const sellerProducts = [
    {
      id: 101,
      name: "Wireless Headphones",
      image: "https://via.placeholder.com/200",
      price: "$120",
      description: "High quality wireless headphones with noise cancellation.",
      stock: 15,
    },
    {
      id: 102,
      name: "Smart Watch",
      image: "https://via.placeholder.com/200",
      price: "$80",
      description: "Smart watch with heart rate monitor and GPS.",
      stock: 30,
    },
    {
      id: 103,
      name: "Gaming Mouse",
      image: "https://via.placeholder.com/200",
      price: "$35",
      description: "Ergonomic gaming mouse with RGB lighting.",
      stock: 50,
    },
  ];

  // Hard-coded reviews
  const reviews = [
    {
      id: 1,
      productId: 101,
      username: "John Doe",
      rating: 5,
      comment: "Excellent sound quality!",
      date: "2025-10-15",
    },
    {
      id: 2,
      productId: 101,
      username: "Jane Smith",
      rating: 4,
      comment: "Very comfortable, but battery life could be better.",
      date: "2025-10-18",
    },
    {
      id: 3,
      productId: 102,
      username: "Ali Khan",
      rating: 3,
      comment: "Average watch, features are okay.",
      date: "2025-10-19",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Your Products & Customer Reviews
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellerProducts.map((product) => {
          const productReviews = reviews.filter((r) => r.productId === product.id);

          return (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg p-4">
              {/* Product Info */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl mb-3"
              />
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-500 mb-2">{product.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-700">{product.price}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>

              {/* Reviews */}
              <div className="space-y-3">
                {productReviews.length > 0 ? (
                  productReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 p-3 rounded-xl shadow-inner space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">{review.username}</h3>
                        <span className="text-gray-400 text-sm">{review.date}</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              review.rating >= star ? "text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No reviews yet for this product.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SellerProductReviews;
