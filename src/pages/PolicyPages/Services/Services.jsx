import React from "react";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Headphones } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Truck className="w-10 h-10 text-indigo-500" />,
      title: "Fast & Safe Delivery",
      desc: "We ensure quick and secure delivery for all electronic products nationwide.",
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-indigo-500" />,
      title: "Genuine Products",
      desc: "Every item is 100% authentic and comes with a manufacturer warranty.",
    },
    {
      icon: <Headphones className="w-10 h-10 text-indigo-500" />,
      title: "24/7 Customer Support",
      desc: "Our support team is always ready to assist you with any query or issue.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl text-black"
    >
      <h1 className="text-3xl font-bold mb-8 text-indigo-600 text-center">
        Our Services
      </h1>

      <div className="grid sm:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <div
            key={i}
            className="p-6 bg-indigo-50 rounded-2xl text-center hover:shadow-lg transition-all"
          >
            <div className="flex justify-center mb-3">{s.icon}</div>
            <h2 className="font-bold text-lg mb-2">{s.title}</h2>
            <p className="text-gray-700">{s.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
