import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Shield, Clock, Mail, CheckCircle } from "lucide-react";

export const ReturnsRefundsPolicy = () => {
  const policySteps = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Initiate Return",
      description: "Contact support@techlight.com or call +880 1234-567890",
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Get Instructions",
      description: "Receive detailed return process and shipping guidelines",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Ship & Refund",
      description: "Send product back and get refund in 7-10 business days",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="bg-white"
    >
      <div className="container mx-auto py-5">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-back mb-2">
              Returns & Refunds
            </h2>
            <p
              className="font-medium"
              style={{ color: "var(--color-subtext)" }}
            >
              30-day satisfaction guarantee
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-200 rounded-xl p-8 border border-gray-300 flex justify-center items-center gap-3"
          >
            <Clock className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-black font-semibold">30 Days</p>
            <p className="text-gray-600 text-sm font-medium">Return window</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-200 rounded-xl  border border-gray-300 p-8 flex justify-center items-center gap-3"
          >
            <Shield className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-black font-semibold">Full Refund</p>
            <p className="text-gray-600 text-sm font-medium">
              Original condition
            </p>
          </motion.div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            Eligibility Rules
          </h3>
          <div className="space-y-3">
            {[
              "Products returned within 30 days of delivery",
              "Items in original condition with packaging intact",
              "Proof of purchase required (invoice/order number)",
              "Digital products & gift cards are non-returnable",
            ].map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-gray-200 rounded-lg border border-gray-300 hover:border-gray-700 transition-all duration-300"
              >
                <div className="w-2 h-2  rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-500">{rule}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-4">How It Works</h3>
          <div className="space-y-4">
            {policySteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2 }}
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
        <h3 className="text-xl font-bold text-black mb-4">
          Contact Support Team
        </h3>
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <p className="text-yellow-300 text-sm">
            <strong>Note:</strong> Shipping fees are non-refundable unless
            return is due to defective or incorrect product.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
