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
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 rounded-3xl blur-xl"></div>

      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
            <RefreshCw className="w-8 h-8 text-black" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">
              Returns & Refunds
            </h2>
            <p className="text-emerald-300 font-medium">
              30-day satisfaction guarantee
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl p-4 border border-emerald-500/30"
          >
            <Clock className="w-6 h-6 text-emerald-400 mb-2" />
            <p className="text-black font-semibold">30 Days</p>
            <p className="text-gray-300 text-sm">Return window</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-xl p-4 border border-teal-500/30"
          >
            <Shield className="w-6 h-6 text-teal-400 mb-2" />
            <p className="text-black font-semibold">Full Refund</p>
            <p className="text-gray-300 text-sm">Original condition</p>
          </motion.div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
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
                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">{rule}</p>
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
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                  {step.icon}
                </div>
                <div>
                  <p className="text-black font-semibold">{step.title}</p>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <button>Contact Support Team</button>
          {/* <Button
            onClick={handleContactSupport}
            className='w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-semibold py-3 rounded-xl shadow-lg transition-all duration-300'
          >
            <Mail className="w-5 h-5 mr-2" />
            Contact Support Team
          </Button> */}
        </motion.div>

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
