import React, { useEffect, useState } from "react";
import CategorySidebar from "./CategorySidebar";
import Slider from "./Slider";
import { motion } from "framer-motion";
import axios from "axios";

const Banner = () => {
  const [slides, setSlides] = useState([]);
  const [shopMegaMenu, setShopMegaMenu] = useState([]);
  const API_URL = import.meta.env.VITE_prod_baseURL;

  // Fetch banners from backend
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

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        const data = response.data;

        // Transform backend data to sidebar format
        const formattedCategories = data.map((cat) => ({
          title: cat.category,
          items: cat.subCategory || [],
        }));

        setShopMegaMenu(formattedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Fallback to default categories
        setShopMegaMenu([
          {
            category: "Smart Home",
            subCategory: [
              "Security Cameras",
              "Smart Lights",
              "Voice Assistants",
            ],
          },
          {
            category: "Mobile",
            subCategory: ["Smartphones", "Tablets"],
          },
          {
            category: "Wearables",
            subCategory: ["Fitness Bands", "Smart Watches"],
          },
          {
            category: "Audio",
            subCategory: ["Headphones", "Earbuds", "Speakers"],
          },
          {
            category: "Gaming",
            subCategory: ["PlayStation & Xbox", "VR Headsets"],
          },
          {
            category: "Computing",
            subCategory: ["Desktops", "Keyboards", "Mouse"],
          },
          {
            category: "Accessories",
            subCategory: [
              "Power Banks",
              "Cables & Chargers",
              "Storage Devices",
            ],
          },
        ]);
      }
    };
    fetchCategories();
  }, [API_URL]);

  return (
    <motion.section
      className="container mx-auto mt-12"
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
