import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "./Slider";

const Banner = () => {
  const slides = [
    {
      id: 1,
      title: "iPhone 14 Series",
      subtitle: "Up to 10% off Voucher",
      image: "https://i.ibb.co.com/tMQc170R/slider3.jpg",
    },
    {
      id: 2,
      title: "Smart TVs",
      subtitle: "Flat 15% Discount",
      image:
        "https://i.ibb.co.com/ynF19j8j/a-bold-e-commerce-banner-displaying-a-tablet-with.webp",
    },
    {
      id: 3,
      title: "Headphones",
      subtitle: "Grab Now – 20% Off",
      image: "https://i.ibb.co.com/5XB5C0CG/slide3.webp",
    },
  ];
  const shopMegaMenu = [
    {
      title: "Mobiles & Tablets",
      items: [
        "Smartphones",
        "Tablets",
        "Mobile Accessories (Covers, Chargers, Earphones)",
      ],
    },
    {
      title: "Laptops & Computers",
      items: ["Laptops", "Desktops", "Keyboards, Mouse, Monitors"],
    },
    {
      title: "Smart Watches & Wearables",
      items: ["Smart Watches", "Fitness Bands"],
    },
    {
      title: "Audio Devices",
      items: ["Headphones", "Earbuds", "Bluetooth Speakers"],
    },
    {
      title: "Gaming Consoles & Accessories",
      items: ["PlayStation, Xbox", "VR Headsets", "Gaming Accessories"],
    },
    {
      title: "Smart Home Devices",
      items: ["Smart Lights", "Security Cameras", "Voice Assistants"],
    },
    {
      title: "Accessories",
      items: [
        "Power Banks",
        "Cables & Chargers",
        "Storage Devices (HDD/SSD, Pendrive)",
      ],
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto md:mt-12 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar */}
        <aside className="md:col-span-1 bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-gray-200 py-10 px-4">
          <nav>
            {shopMegaMenu.map((section, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className="mb-2 border-b border-gray-100 last:border-0"
                >
                  <button
                    onClick={() => toggleOpen(idx)}
                    className="flex justify-between items-center w-full text-left text-gray-800 font-medium py-3 px-3 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 transition-all duration-300 group cursor-pointer"
                    aria-expanded={isOpen}
                    aria-controls={`submenu-${idx}`}
                    id={`menuitem-${idx}`}
                  >
                    <span className="flex items-center gap-2">
                      <ChevronRight
                        className={`w-4 h-4 text-indigo-500 transform transition-transform duration-300 ${
                          isOpen ? "rotate-90" : "rotate-0"
                        }`}
                      />
                      <span className="group-hover:text-indigo-600 transition-colors">
                        {section.title}
                      </span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.ul
                        key="content"
                        id={`submenu-${idx}`}
                        role="region"
                        aria-labelledby={`menuitem-${idx}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="pl-8 pb-2 space-y-2 text-gray-600 overflow-hidden"
                      >
                        {section.items.map((item, i) => (
                          <li key={i}>
                            <button
                              type="button"
                              className="w-full text-left py-1 px-2 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 cursor-pointer"
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Carousel */}
        <div className="md:col-span-3">
          <Slider slides={slides} />
        </div>
      </div>
    </section>
  );
};

export default Banner;
