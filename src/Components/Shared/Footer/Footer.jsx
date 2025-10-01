import React, { useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Send,
  MapPin,
  Phone,
  ArrowUp,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import TechLightLogo from "../Logo/TechLightLogo";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 2500);
    }
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
    { name: "Blog", path: "/blog" },
  ];

  const supportLinks = [
    { name: "Help Center", path: "/help" },
    { name: "FAQ", path: "/faq" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Returns & Refunds", path: "/returns" },
    { name: "Order Tracking", path: "/tracking" },
  ];

  const categories = [
    { name: "Electronics", path: "/category/electronics" },
    { name: "Clothing", path: "/category/clothing" },
    { name: "Books", path: "/category/books" },
    { name: "Home & Garden", path: "/category/home-garden" },
    { name: "Sports", path: "/category/sports" },
    { name: "Health & Beauty", path: "/category/health-beauty" },
  ];

  // Brand color hover styles restored
  const socialLinks = [
    {
      icon: Facebook,
      url: "https://facebook.com",
      label: "Facebook",
      color: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200",
    },
    {
      icon: Twitter,
      url: "https://twitter.com",
      label: "Twitter",
      color: "hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200",
    },
    {
      icon: Instagram,
      url: "https://instagram.com",
      label: "Instagram",
      color: "hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200",
    },
    {
      icon: Linkedin,
      url: "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200",
    },
    {
      icon: Youtube,
      url: "https://youtube.com",
      label: "YouTube",
      color: "hover:bg-red-50 hover:text-red-600 hover:border-red-200",
    },
  ];

  const LinkItem = ({ href, children }) => (
    <a
      href={href}
      className="group inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-all duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded"
    >
      <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500 after:transition-all after:duration-300 group-hover:after:w-full">
        {children}
      </span>
      <ArrowRight
        aria-hidden
        className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out"
      />
    </a>
  );

  return (
    <footer className="bg-gradient-to-br from-violet-50 via-fuchsia-50/40 to-cyan-50/50 mt-20 relative overflow-hidden">
      {/* Decorative gradient blobs (unchanged) */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-300/50 to-pink-300/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-300/50 to-blue-300/50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-fuchsia-300/30 to-violet-300/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand + contact */}
            <div>
              <TechLightLogo className="mb-4" />

              <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-xs">
                TechLight is your go-to electronics store for high-quality
                gadgets, smart devices, and home appliances.
              </p>

              <ul className="space-y-3 text-slate-600 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-0.5 text-slate-500" />
                  <span>info@yourcompany.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5 text-slate-500" />
                  <span>+880 1234-567890</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-slate-500" />
                  <span>Dhaka, Bangladesh</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-slate-800 font-semibold text-lg mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.path}>
                    <LinkItem href={item.path}>{item.name}</LinkItem>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-slate-800 font-semibold text-lg mb-4">
                Support
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((item) => (
                  <li key={item.path}>
                    <LinkItem href={item.path}>{item.name}</LinkItem>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-slate-800 font-semibold text-lg mb-4">
                Categories
              </h4>
              <ul className="space-y-3">
                {categories.map((item) => (
                  <li key={item.path}>
                    <LinkItem href={item.path}>{item.name}</LinkItem>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter card */}
          <div className="max-w-5xl mx-auto mt-12">
            <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/70 shadow-lg shadow-slate-200/40 px-6 py-8 md:px-10">
              <div className="text-center mb-6">
                <h5 className="text-slate-800 font-semibold text-lg">
                  Stay Updated
                </h5>
                <p className="text-slate-600 text-sm mt-1">
                  Subscribe to our newsletter for the latest updates and
                  exclusive offers.
                </p>
              </div>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto"
              >
                <div className="relative w-full">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-white font-medium bg-primary shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {subscribed ? "Subscribed ✓" : "Subscribe"}
                </button>
              </form>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-12 border-top border-t border-slate-200/70 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Follow us */}
              <div className="flex items-center gap-4">
                <span className="text-slate-600 text-sm">Follow us:</span>
                <div className="flex items-center gap-3">
                  {socialLinks.map(({ icon: Icon, url, label, color }) => (
                    <a
                      key={label}
                      href={url}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center transition-all duration-200 ease-out hover:scale-110 active:scale-95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${color}`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Payments / Shipping */}
              <div className="text-right text-slate-500 text-sm space-y-0.5">
                <p>We accept: Visa, Mastercard, PayPal</p>
                <p>Shipping Partners: DHL, FedEx, UPS</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="py-6">
            <p className="text-center text-slate-600 text-sm">
              © {new Date().getFullYear()} TechLight. Made with{" "}
              <span className="text-rose-500">♥</span> in Bangladesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
