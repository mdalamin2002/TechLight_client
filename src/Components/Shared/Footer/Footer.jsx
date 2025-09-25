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
import { Link } from "react-router";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
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
    { name: "Privacy Policy", href: "privacy_policy" },
    { name: "Terms of Service", href: "#" },
    { name: "Returns", href: "#" },
    { name: "Shipping", href: "#" },
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
    <footer className="relative bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-900 dark:to-gray-800 mt-30">
      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-custom-accent hover:bg-custom-primary hover:text-custom-accent text-white p-3 rounded-full shadow-lg transition-all duration-300 group border border-custom-subtext"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-1" />
      </motion.button>

      <div className="container mx-auto px-4 pt-20 pb-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="mb-6">
              <Link to="/" className="text-xl font-bold text-textPrimary">
                <TechLightLogo className="mb-4"/>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                We are dedicated to providing exceptional products and services
                that exceed customer expectations. Join our community today!
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <motion.div
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-custom-accent transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>info@yourcompany.com</span>
              </motion.div>

              <motion.div
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-custom-accent transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+880 1234-567890</span>
              </motion.div>

              <motion.div
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-custom-accent transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-custom-accent transition-colors duration-300 inline-block"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-custom-accent transition-colors duration-300 inline-block"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants}>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-6">
              Categories
            </h4>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={category.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-custom-accent transition-colors duration-300 inline-block"
                  >
                    {category.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl p-8 mb-12 shadow-lg"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-6">
            <h4 className="text-gray-900 dark:text-white font-semibold mb-2">
              Stay Updated
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Subscribe to our newsletter for the latest updates and exclusive
              offers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-400 dark:border-gray-600 rounded-lg focus:outline-none focus:border-custom-accent focus:ring-2 focus:ring-custom-accent focus:ring-opacity-20 transition-all duration-300"
            />
            <motion.button
              className="bg-custom-accent hover:bg-custom-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>

        {/* Social Links & Copyright */}
        <motion.div
          className="border-t border-gray-300 dark:border-gray-700 pt-8"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-400 mr-2">
                Follow us:
              </span>
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-custom-accent text-gray-700 dark:text-gray-300 hover:text-white p-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg group"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>

            {/* Copyright */}
            <div className="text-gray-600 dark:text-gray-400 text-center">
              <p className="flex items-center justify-center space-x-1">
                <span>© 2024 YourCompany. Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                <span>in Bangladesh</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
