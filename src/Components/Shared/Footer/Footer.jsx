import React from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Heart,
} from "lucide-react";
import TechLightLogo from "../Logo/TechLightLogo";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "#" },
    { name: "Services", href: "#" },
    { name: "Products", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Blog", href: "#" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Privacy Policy", href: "/privacy_policy" },
    { name: "Terms of Service", href: "#" },
    { name: "Returns & Refunds", href: "/returns-refunds" },
    { name: "Order Tracking", href: "/order-tracking" },
  ];

  const categories = [
    { name: "Electronics", href: "#" },
    { name: "Clothing", href: "#" },
    { name: "Books", href: "#" },
    { name: "Home & Garden", href: "#" },
    { name: "Sports", href: "#" },
    { name: "Health & Beauty", href: "#" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-900 dark:to-gray-800 mt-30 md:mb-0 mb-12">
      {/* Scroll to Top */}
      <motion.button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-custom-accent hover:bg-custom-primary text-white p-3 rounded-full shadow-lg transition-all duration-300 group border border-custom-subtext"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
      </motion.button>

      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Grid Sections */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <TechLightLogo className="mb-4" />
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              TechLight is your go-to electronics store for high-quality
              gadgets, smart devices, and home appliances.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" /> info@yourcompany.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" /> +880 1234-567890
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Dhaka, Bangladesh
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-6 text-gray-900 dark:text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="hover:text-custom-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-6 text-gray-900 dark:text-white">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="hover:text-custom-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-6 text-gray-900 dark:text-white">
              Categories
            </h4>
            <ul className="space-y-3">
              {categories.map((cat, i) => (
                <li key={i}>
                  <a
                    href={cat.href}
                    className="hover:text-custom-accent transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl p-8 mb-12 shadow-lg text-center"
          variants={itemVariants}
        >
          <h4 className="text-gray-900 dark:text-white font-semibold mb-2">
            Stay Updated
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Subscribe to our newsletter for the latest updates and exclusive
            offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border dark:bg-gray-800"
            />
            <motion.button
              className="bg-custom-accent text-white px-6 py-3 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>

        {/* Social & Bottom */}
        <motion.div
          className="border-t border-gray-300 dark:border-gray-700 pt-8"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span>Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={i}
                      href={s.href}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-custom-accent hover:text-white"
                      aria-label={s.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Payment */}
            <div className="text-sm text-gray-400">
              <p>We accept: Visa, Mastercard, PayPal</p>
              <p>Shipping Partners: DHL, FedEx, UPS</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-center text-gray-500">
            <p className="flex items-center justify-center gap-1">
              © 2025 TechLight. Made with{" "}
              <Heart className="w-4 h-4 text-red-500 animate-pulse" /> in
              Bangladesh
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
