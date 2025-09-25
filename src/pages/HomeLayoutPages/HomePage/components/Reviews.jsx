import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const Reviews = () => {
  const reviews = useMemo(() => [
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      comment: "Excellent product! Highly recommend.",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      name: "Jane Smith",
      rating: 4,
      comment: "Very good quality, fast shipping.",
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      name: "Ali Khan",
      rating: 3,
      comment: "Average, could be better.",
      image: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      name: "Maria Garcia",
      rating: 5,
      comment: "Loved it! Perfect quality.",
      image: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: 5,
      name: "David Miller",
      rating: 4,
      comment: "Works great, satisfied with the purchase.",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 6,
      name: "Sophia Lee",
      rating: 5,
      comment: "Best product I have bought this year!",
      image: "https://i.pravatar.cc/150?img=6",
    },
    {
      id: 7,
      name: "Rahim Uddin",
      rating: 2,
      comment: "Not happy, product was delayed.",
      image: "https://i.pravatar.cc/150?img=7",
    },
    {
      id: 8,
      name: "Emily Brown",
      rating: 5,
      comment: "Fantastic! Will buy again.",
      image: "https://i.pravatar.cc/150?img=8",
    },
    {
      id: 9,
      name: "Michael Johnson",
      rating: 3,
      comment: "Okayish, value for money.",
      image: "https://i.pravatar.cc/150?img=9",
    },
    {
      id: 10,
      name: "Nusrat Jahan",
      rating: 4,
      comment: "Very useful and good packaging.",
      image: "https://i.pravatar.cc/150?img=10",
    },
  ], []);

  // Optimized Star Render Function
  const renderStars = useMemo(() => (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 transition-colors duration-200 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  }, []);

  // Animation variants for better performance
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const NavigationButton = ({ direction, className }) => (
    <button
      className={`${className} bg-custom-primary hover:bg-custom-accent hover:text-custom-primary text-custom-accent rounded-full p-3 shadow-lg transition-all duration-300 border border-custom-subtext group`}
      aria-label={`${direction} review`}
    >
      <svg
        className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={direction === 'Previous' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );

  return (
    <section className="bg-custom-background section ">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2>Customer Reviews</h2>
          <p className="text-custom-subtext max-w-2xl mx-auto">
            See what our valued customers say about their experience.
          </p>
        </motion.div>

        {/* Swiper Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
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
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            loop={true}
            className="review-swiper pb-12"
            lazy={true}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <motion.div
                  variants={slideVariants}
                  className="h-full"
                >
                  <div className="bg-custom-primary shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full rounded-2xl flex flex-col justify-between group hover:-translate-y-1">
                    {/* User Image */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <img
                          src={review.image}
                          alt={`${review.name}'s profile`}
                          className="w-16 h-16 rounded-full object-cover border-2 border-custom-accent transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=User';
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-custom-accent rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Quote Icon */}
                    <div className="flex justify-center mb-4">
                      <Quote className="w-6 h-6 text-custom-accent opacity-60" />
                    </div>

                    {/* Feedback */}
                    <p className="text-center text-custom-subtext leading-relaxed italic mb-6 flex-grow">
                      "{review.comment}"
                    </p>

                    {/* Stars */}
                    <div className="flex justify-center mb-4">
                      <div className="flex space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    {/* User Name */}
                    <div className="text-center">
                      <h4 className="font-semibold text-custom-text">
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
            <NavigationButton
              direction="Previous"
              className="swiper-button-prev-custom"
            />
            <NavigationButton
              direction="Next"
              className="swiper-button-next-custom"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
