import React, { useEffect, useState } from "react";
import CategorySidebar from "./CategorySidebar";
import { motion } from "framer-motion";
import axios from "axios";

//  Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Banner = () => {
  const [slides, setSlides] = useState([]);
  const API_URL = import.meta.env.VITE_baseURL;

  //  Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${API_URL}/banners`);
        setSlides(res.data);
      } catch (error) {
        console.error("Failed to load banners:", error);
      }
    };
    fetchBanners();
  }, [API_URL]);

  // ✅ Category sidebar data
  const shopMegaMenu = [
    { title: "Mobiles & Tablets", items: ["Smartphones", "Tablets", "Mobile Accessories"] },
    { title: "Laptops & Computers", items: ["Laptops", "Desktops", "Keyboards & Mouse"] },
    { title: "Smart Watches", items: ["Smart Watches", "Fitness Bands"] },
    { title: "Audio Devices", items: ["Headphones", "Earbuds", "Speakers"] },
    { title: "Gaming Consoles", items: ["PlayStation & Xbox", "VR Headsets", "Accessories"] },
    { title: "Smart Home", items: ["Smart Lights", "Security Cameras", "Voice Assistants"] },
    { title: "Accessories", items: ["Power Banks", "Cables & Chargers", "Storage Devices"] },
  ];

  return (
    <motion.section
      className="container mx-auto mt-6"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* ✅ Desktop Layout: Sidebar + Slider */}
      <div className="hidden xl:flex gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <CategorySidebar shopMegaMenu={shopMegaMenu} />
        </motion.div>

        {/* Auto Slider */}
        <motion.div
          className="flex-1 min-w-0"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {slides.length > 0 ? (
            <Swiper
              loop={slides.length > 2}
              pagination={{ clickable: true }}
              navigation
              modules={[Autoplay, Pagination, Navigation]}
              autoplay={{
                delay: 3000, // seconds between slides
                disableOnInteraction: false,
              }}
              className="rounded-2xl overflow-hidden"
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide._id || slide.id}>
                  <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute text-center inset-0 bg-black/40 flex flex-col justify-center items-center px-10">
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                        {slide.title}
                      </h2>
                      <p className="text-white/90 text-lg md:text-xl">{slide.subtitle}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex justify-center items-center h-64 bg-gray-100 rounded-xl">
              <p className="text-gray-500 text-lg">No banners available</p>
            </div>
          )}
        </motion.div>
      </div>

      {/*  Mobile/Tablet Layout */}
      <div className="xl:hidden w-full">
        {slides.length > 0 ? (
          <Swiper
            loop={slides.length > 2}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="rounded-xl overflow-hidden"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide._id || slide.id}>
                <div className="relative w-full h-[250px] sm:h-[350px]">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start px-6">
                    <h2 className="text-2xl font-bold text-white mb-1">{slide.title}</h2>
                    <p className="text-white/90">{slide.subtitle}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex justify-center items-center h-48 bg-gray-100 rounded-xl">
            <p className="text-gray-500 text-lg">No banners available</p>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Banner;
