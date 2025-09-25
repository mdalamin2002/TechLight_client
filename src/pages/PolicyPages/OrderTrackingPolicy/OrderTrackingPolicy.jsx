import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Bell,
  Search,
  Truck,
  CheckCircle2,
} from "lucide-react";

export const OrderTrackingPolicy = () => {
  const trackingSteps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Access Tracking",
      description: "Visit tracking page or click email link",
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Enter Details",
      description: "Provide order number and email address",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "View location and delivery estimates",
    },
  ];

  const trackingFeatures = [
    {
      icon: <Truck className="w-5 h-5" />,
      text: "Real-time location tracking",
    },
    { icon: <Bell className="w-5 h-5" />, text: "SMS & email notifications" },
    { icon: <MapPin className="w-5 h-5" />, text: "Estimated delivery dates" },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      text: "Delivery confirmation",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="bg-white"
    >
      <div className="container mx-auto py-5">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-back mb-2">
              Order Tracking
            </h2>
            <p
              className="font-medium"
              style={{ color: "var(--color-subtext)" }}
            >
              Real-time delivery updates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {trackingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-200 rounded-xl p-3 border border-gray-300 flex items-center gap-3"
            >
              <div className="text-blue-400">{feature.icon}</div>
              <p className="text-gray-600 text-sm font-medium">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            Guidelines
          </h3>
          <div className="space-y-3 ">
            {[
              "Tracking available once orders are shipped",
              "Tracking number sent via email or SMS",
              "Use official tracking portal or courier website",
              "Contact support if tracking is unavailable",
            ].map((guideline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-gray-200 rounded-lg border border-gray-300 hover:border-gray-700 transition-all duration-300"
              >
                <div className="w-2 h-2  rounded-full mt-2 flex-shrink-0"></div>
                <p className=" text-sm text-gray-500">{guideline}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-4">How It Works</h3>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2 }}
                className="flex items-center gap-4 p-4 bg-gray-200 border-gray-300 rounded-xl border hover:border-gray-700 transition-all duration-300"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  {step.icon}
                </div>
                <div>
                  <p className="text-gray-800 font-semibold ">{step.title}</p>
                  <p className="text-gray-500 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold text-black mb-4">How It Works</h3>

        <div className="bg-gradient-to-r bg-gray-200 rounded-xl p-4 border border-gray-300">
          <h4 className="text-gray-600 font-semibold mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            Delivery Notifications
          </h4>
          <div className="flex justify-between items-center">
            {["Shipped", "In Transit", "Out for Delivery", "Delivered"].map(
              (status, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      index < 2 ? "bg-indigo-400" : "bg-gray-600"
                    }`}
                  ></div>
                  <p className="text-xs text-gray-500">{status}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
