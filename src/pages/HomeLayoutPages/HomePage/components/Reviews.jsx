import React, { useState } from "react";
import { Star } from "lucide-react";

const ReviewSection = () => {
  const [reviews] = useState([
    { id: 1, name: "John Doe", rating: 5, comment: "Excellent product! Highly recommend." },
    { id: 2, name: "Jane Smith", rating: 4, comment: "Very good quality, fast shipping." },
    { id: 3, name: "Ali Khan", rating: 3, comment: "Average, could be better." },
    { id: 4, name: "Maria Garcia", rating: 5, comment: "Loved it! Perfect quality." },
    { id: 5, name: "David Miller", rating: 4, comment: "Works great, satisfied with the purchase." },
    { id: 6, name: "Sophia Lee", rating: 5, comment: "Best product I have bought this year!" },
    { id: 7, name: "Rahim Uddin", rating: 2, comment: "Not happy, product was delayed." },
    { id: 8, name: "Emily Brown", rating: 5, comment: "Fantastic! Will buy again." },
    { id: 9, name: "Michael Johnson", rating: 3, comment: "Okayish, value for money." },
    { id: 10, name: "Nusrat Jahan", rating: 4, comment: "Very useful and good packaging." },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <div className="max-w-5xl mx-auto my-10 p-5">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
        ⭐ Customer Reviews
      </h2>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentReviews.map((review) => (
          <div
            key={review.id}
            className="p-5 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-800">{review.name}</span>
            </div>
            <div className="flex text-yellow-400 mb-2">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5" />
              ))}
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;
