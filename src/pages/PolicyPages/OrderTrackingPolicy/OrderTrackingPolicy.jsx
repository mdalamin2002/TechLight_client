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
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 rounded-3xl blur-xl"></div>

      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Order Tracking
            </h2>
            <p className="text-blue-300 font-medium">
              Real-time delivery updates
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {trackingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl p-3 border border-blue-500/30 flex items-center gap-3"
            >
              <div className="text-blue-400">{feature.icon}</div>
              <p className="text-white text-sm font-medium">{feature.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            Guidelines
          </h3>
          <div className="space-y-3">
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
                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">{guideline}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  {step.icon}
                </div>
                <div>
                  <p className="text-white font-semibold">{step.title}</p>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-6"
        >
          <button>Track Your Order</button>
        </motion.div>

        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/30">
          <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
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
                  <p className="text-xs text-gray-400">{status}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
