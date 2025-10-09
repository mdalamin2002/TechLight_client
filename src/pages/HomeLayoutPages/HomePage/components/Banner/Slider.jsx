import React from "react";
import { Tag, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { motion } from "framer-motion";

const Slider = ({ slides }) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        effect="fade"
        className="rounded-2xl overflow-hidden shadow-lg"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[280px] sm:h-[340px] md:h-[420px] lg:h-[480px] w-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white px-4 sm:px-6">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 animate-pulse" />
                  <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold tracking-wide drop-shadow-lg">
                    {slide.title}
                  </h2>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400 animate-pulse" />
                </div>
                <p className="flex items-center gap-2 text-sm sm:text-base md:text-xl lg:text-2xl font-medium bg-white/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md">
                  <Tag className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-pink-300" />
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};

export default Slider;
