import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion , AnimatePresence } from "framer-motion";
import Slider from "./Slider";

const Banner = () => {
  const slides = [
    {
      id: 1,
      title: "iPhone 14 Series",
      subtitle: "Up to 10% off Voucher",
      image: "https://i.ibb.co.com/rKFXxDDp/Slider1.webp",
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
      image: "https://i.ibb.co.com/tMQc170R/slider3.jpg",
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
    <section className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Sidebar */}
        <aside className="md:col-span-1 border-r border-gray-300 pr-4 bg-white">
          <nav>
            {shopMegaMenu.map((section, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div key={idx} className="mb-4">
                  <button
                    onClick={() => toggleOpen(idx)}
                    className="flex justify-between items-center cursor-pointer w-full text-left text-gray-800 font-semibold py-2  rounded focus:outline-none"
                    aria-expanded={isOpen}
                    aria-controls={`submenu-${idx}`}
                    id={`menuitem-${idx}`}
                  >
                    {section.title}
                    <ChevronRight
                      className={` text-gray-500 transition-transform duration-300 ${
                        isOpen ? "rotate-90" : "rotate-0"
                      }`}
                      size={20}
                      aria-hidden="true"
                    />
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
                        className="mt-2 list-none space-y-1 text-gray-600 overflow-hidden"
                      >
                        {section.items.map((item, i) => (
                          <li key={i}>
                            <button
                              type="button"
                              className="w-full text-left py-1 rounded focus:outline-none cursor-pointer transition"
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
