import React from "react";
import CategorySidebar from "./CategorySidebar";
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
      image: "https://i.ibb.co.com/ynF19j8j/a-bold-e-commerce-banner-displaying-a-tablet-with.webp",
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
      items: ["Smartphones", "Tablets", "Mobile Accessories"],
    },
    {
      title: "Laptops & Computers",
      items: ["Laptops", "Desktops", "Keyboards & Mouse"],
    },
    {
      title: "Smart Watches",
      items: ["Smart Watches", "Fitness Bands"],
    },
    {
      title: "Audio Devices",
      items: ["Headphones", "Earbuds", "Speakers"],
    },
    {
      title: "Gaming Consoles",
      items: ["PlayStation & Xbox", "VR Headsets", "Accessories"],
    },
    {
      title: "Smart Home",
      items: ["Smart Lights", "Security Cameras", "Voice Assistants"],
    },
    {
      title: "Accessories",
      items: ["Power Banks", "Cables & Chargers", "Storage Devices"],
    },
  ];

  return (
    <section className="container mx-auto md:mt-20 mt-6 md:px-4 sm:px-0">
      {/* Desktop Layout: Sidebar + Slider */}
      <div className="hidden xl:flex gap-6">
        <CategorySidebar shopMegaMenu={shopMegaMenu} />
        <div className="flex-1 min-w-0">
          <Slider slides={slides} />
        </div>
      </div>

      {/* Mobile/Tablet Layout: Only Slider */}
      <div className="xl:hidden w-full">
        <Slider slides={slides} />
      </div>
    </section>
  );
};

export default Banner;
