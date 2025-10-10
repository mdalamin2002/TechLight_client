import React, { useEffect, useState } from "react";
import CategorySidebar from "./CategorySidebar";
import Slider from "./Slider";
import { motion } from "framer-motion";
import axios from "axios";



const Banner = () => {
  const [slides, setSlides] = useState([]);
  const API_URL = import.meta.env.VITE_baseURL;

  //  Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${API_URL}/banners`);
        setSlides(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Failed to load banners:", error);
      }
    };
    fetchBanners();
  }, [API_URL]);

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
      {/* Desktop Layout: Sidebar + Slider */}
      <div className="hidden xl:flex gap-6">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <CategorySidebar shopMegaMenu={shopMegaMenu} />
        </motion.div>

        <motion.div
          className="flex-1 min-w-0"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Slider slides={slides} />
        </motion.div>
      </div>

      {/* Mobile/Tablet Layout: Only Slider */}
      <div className="xl:hidden w-full">
        <Slider slides={slides} />
      </div>
    </motion.section>
  );
};

export default Banner;