import React from "react";
import { motion } from "framer-motion";
import { Gavel } from "lucide-react";

export default function TermsOfService() {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      description: `By using TechLight E-Commerce to purchase or sell electronic products, you agree to follow these Terms of Service. 
If you do not agree with any part of these terms, please do not use our platform.`,
    },
    {
      title: "2. User Responsibilities",
      description: `All users must provide accurate personal and contact information. 
You are responsible for maintaining your account and password security. 
Any activity under your account will be considered your responsibility.`,
    },
    {
      title: "3. Product Information and Pricing",
      description: `We strive to ensure all product details, prices, and stock information are accurate. 
However, TechLight reserves the right to correct errors, update prices, or cancel orders if inaccuracies occur.`,
    },
    {
      title: "4. Orders and Payments",
      description: `All orders placed through the platform are subject to acceptance and verification. 
Payment must be made through approved payment gateways. 
We do not store sensitive payment information like card details.`,
    },
    {
      title: "5. Shipping and Delivery",
      description: `We aim to deliver all electronic products safely and on time. 
Delivery time may vary based on location and product availability. 
TechLight is not responsible for delays caused by courier or external factors.`,
    },
    {
      title: "6. Returns and Refunds",
      description: `Customers can request returns within 7 days of receiving the product if it is defective or not as described. 
Refunds are processed after inspection. 
Products damaged by misuse are not eligible for return or refund.`,
    },
    {
      title: "7. Warranty and Repairs",
      description: `Most of our electronic products come with a manufacturer warranty. 
Warranty claims must be made directly to the brand or through TechLight’s support team as per product policy.`,
    },
    {
      title: "8. Prohibited Activities",
      description: `Users must not:
- Use the site for fraudulent transactions.
- Attempt to hack, scrape, or manipulate system data.
- Post false reviews or misleading product information.`,
    },
    {
      title: "9. Intellectual Property",
      description: `All images, logos, product descriptions, and site content belong to TechLight or its partners. 
Unauthorized copying or redistribution is strictly prohibited.`,
    },
    {
      title: "10. Changes to Terms",
      description: `TechLight reserves the right to update or modify these Terms of Service anytime. 
Continued use of the site means you accept the updated terms.`,
    },
    {
      title: "11. Contact Information",
      description: `For support or inquiries, contact us at:
support@techlight.com`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative max-w-full mx-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/20 via-indigo-100/10 to-white/20 rounded-3xl blur-xl"></div>

      <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl text-black">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 text-indigo-600">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-2xl shadow-lg">
            <Gavel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black">Terms of Service</h1>
        </div>

        {/* Terms sections */}
        <div className="space-y-8">
          {terms.map(({ title, description }, index) => (
            <section key={index}>
              <h2 className="text-xl font-bold mb-3 text-black">{title}</h2>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </section>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 p-4 bg-yellow-100 border border-yellow-300 rounded-xl text-yellow-800 font-semibold text-sm">
          <strong>Note:</strong> By using TechLight E-Commerce, you agree to
          these terms. Please review them regularly as updates may occur.
        </div>
      </div>
    </motion.div>
  );
}
