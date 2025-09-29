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

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    { name: "FAQ", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy_policy" },
    { name: "Terms of Service", href: "/terms-service" },
    { name: "Returns & Refunds", href: "/returns-refunds" },
    { name: "Order Tracking", href: "/order-tracking" },
    { name: "Warranty", href: "/warranty" },
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
    <footer className="relative bg-footer dark:bg-background dark:text-foreground  mt-30 md:mb-0 mb-12">
      {/* Scroll to Top */}
      <motion.button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground p-3 rounded-full shadow-lg transition-all duration-300 border border-border hover:bg-accent hover:text-accent-foreground"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
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
            <p className="text-muted-foreground leading-relaxed mb-6">
              TechLight is your go-to electronics store for high-quality
              gadgets, smart devices, and home appliances.
            </p>
            <div className="space-y-3 text-muted-foreground">
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
            <h4 className="font-semibold mb-6 text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-6 text-foreground">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-6 text-foreground">Categories</h4>
            <ul className="space-y-3">
              {categories.map((cat, i) => (
                <li key={i}>
                  <a
                    href={cat.href}
                    className="hover:text-accent transition-colors"
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
          className="bg-card dark:bg-card rounded-2xl p-8 mb-12 shadow-lg text-center"
          variants={itemVariants}
        >
          <h4 className="text-foreground font-semibold mb-2">Stay Updated</h4>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for the latest updates and exclusive
            offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-border dark:bg-input text-foreground"
            />
            <motion.button
              className="bg-accent text-accent-foreground px-6 py-3 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>

        {/* Social & Bottom */}
        <motion.div
          className="border-t border-border pt-8"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={i}
                      href={s.href}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                      aria-label={s.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Payment */}
            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p>We accept: Visa, Mastercard, PayPal</p>
              <p>Shipping Partners: DHL, FedEx, UPS</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-center text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              © 2025 TechLight. Made with{" "}
              <Heart className="w-4 h-4 text-destructive animate-pulse" /> in
              Bangladesh
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
