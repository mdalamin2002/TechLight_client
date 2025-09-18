import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";


const ReviewSection = () => {
  const reviews = [
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
  ];


  // Render Stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };


  return (
    <section className="bg-base-200 py-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-base-content mb-4">
            ⭐ Customer <span className="text-primary">Reviews</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            See what our valued customers say about their experience.
          </p>
        </motion.div>


        {/* Swiper Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            className="review-swiper pb-12"
          >
            {reviews.map((review, idx) => (
              <SwiperSlide key={review.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  viewport={{ once: false }}
                >
                  <div className="bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full rounded-2xl flex flex-col justify-between">
                    {/* Quote */}
                    <div className="flex justify-center mb-4">
                      <Quote className="w-6 h-6 text-primary" />
                    </div>


                    {/* Feedback */}
                    <p className="text-center text-base-content/70 leading-relaxed italic mb-6">
                      "{review.comment}"
                    </p>


                    {/* Stars */}
                    <div className="flex justify-center mb-4">
                      <div className="flex space-x-1">{renderStars(review.rating)}</div>
                    </div>


                    {/* User Info */}
                    <div className="text-center">
                      <h4 className="font-semibold text-base-content text-lg">
                        {review.name}
                      </h4>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>


          {/* Custom Navigation Buttons */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button className="swiper-button-prev-custom bg-base-100 hover:bg-primary hover:text-base-100 text-primary rounded-full p-3 shadow-lg transition-all duration-300 border border-base-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="swiper-button-next-custom bg-base-100 hover:bg-primary hover:text-base-100 text-primary rounded-full p-3 shadow-lg transition-all duration-300 border border-base-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


export default ReviewSection;



