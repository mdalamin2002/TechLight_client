import React from "react";
import { motion } from "framer-motion";
import { Building2, Zap, Users } from "lucide-react";

export default function AboutUs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl text-black"
    >
      <div className="flex items-center gap-4 mb-6 text-indigo-600">
        <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-2xl shadow-lg">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">About Us</h1>
      </div>

      <p className="text-gray-800 leading-relaxed">
        <strong>TechLight E-Commerce</strong> is a trusted online store for
        electronics and smart devices. Our mission is to provide high-quality
        products with fast delivery and reliable customer service. We work with
        top brands and ensure that every customer enjoys a seamless shopping
        experience — whether buying a smartphone, laptop, or home appliance.
      </p>

      <div className="grid sm:grid-cols-3 gap-6 mt-8">
        <div className="flex flex-col items-center text-center">
          <Zap className="w-10 h-10 text-indigo-500 mb-2" />
          <p className="font-semibold">Fast Delivery</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Users className="w-10 h-10 text-indigo-500 mb-2" />
          <p className="font-semibold">Customer First</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Building2 className="w-10 h-10 text-indigo-500 mb-2" />
          <p className="font-semibold">Trusted Brand Partners</p>
        </div>
      </div>
    </motion.div>
  );
}
