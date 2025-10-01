import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Calendar, Store, Tag, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const dummyAds = [
  {
    _id: 1,
    title: "Noise Cancelling Headphones",
    description: "Experience immersive sound with crystal-clear quality.",
    discount: "25%",
    originalPrice: 12000,
    bannerImage:
      "https://i.ibb.co.com/kgT2kDNG/image.png",
    shopName: "Tech World",
    createdAt: "2025-09-01",
    isHot: true,
  },
  {
    _id: 2,
    title: "Smartphone Flash Sale",
    description: "Latest Android smartphones with unbeatable discounts.",
    discount: "15%",
    originalPrice: 30000,
    bannerImage:
      "https://i.ibb.co.com/m5wBzpxz/image.png",
    shopName: "Gadget Hub",
    createdAt: "2025-08-28",
    isHot: true,
  },
  {
    _id: 3,
    title: "Smartwatch Exclusive Deal",
    description: "Track your fitness & stay connected on the go.",
    discount: "30%",
    originalPrice: 10000,
    bannerImage:
      "https://i.ibb.co.com/4ZKjmcqj/image.png",
    shopName: "ElectroMart",
    createdAt: "2025-08-20",
    isHot: true,
  },
];

const Advertisement = () => {
  return (
    <div className="container mx-auto section" >
      {/* Section Heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Offers
            </span>
          </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-base-content mb-4">
          Special Offers & Promotions
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore the latest gadgets and electronics at discounted prices
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
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          {dummyAds.map((ad) => {
            const discountMatch = ad.discount?.match(/(\d+)%/);
            const discountPercent = discountMatch
              ? parseFloat(discountMatch[1])
              : 0;
            const discountedPrice =
              ad.originalPrice - (ad.originalPrice * discountPercent) / 100;

            return (
              <SwiperSlide key={ad._id}>
                <div className="relative w-full">
                  <img
                    src={ad.bannerImage}
                    alt={ad.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex items-center p-8 md:p-12">
                    <motion.div
                      className="max-w-2xl"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1 }}
                      viewport={{ once: false }}
                    >
                      {ad.isHot && (
                        <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                          🔥 HOT DEAL
                        </div>
                      )}

                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        {ad.title}
                      </h2>

                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-full text-xl font-bold mb-4">
                        <Tag size={20} />
                        {ad.discount}
                      </div>

                      <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                        {ad.description}
                      </p>

                      {/* Price Section */}
                      <div className="flex items-center gap-4 mb-6 text-white text-2xl font-bold">
                        <span className="text-green-600">
                          ৳{discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-gray-400 line-through text-xl">
                          ৳{ad.originalPrice}
                        </span>
                      </div>

                      {/* Shop Info */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Store size={18} />
                          <span>{ad.shopName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar size={18} />
                          <span>
                            {new Date(ad.createdAt).toLocaleDateString("en-GB")}
                          </span>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-4">
                        <Link
                          to="/shop"
                          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                        >
                          <ExternalLink size={20} /> Shop Now
                        </Link>
                        <Link
                          to="/offers"
                          className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:bg-white/30"
                        >
                          View Offer
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </motion.div>
    </div>
  );
};

export default Advertisement;
