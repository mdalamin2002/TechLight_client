import { Facebook, Instagram, Mail, Phone, Twitter, Youtube } from 'lucide-react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10">
      <div className="w-11/12 mx-auto">
        {/* Top Section */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">

          {/* Teachlight */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">TeachLight</h3>
            <p className="text-gray-400 text-sm">TechLight is your go-to electronics store for high-quality gadgets, smart devices, and home appliances.</p>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mission & Vision</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Customer Service</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="https://www.ryans.com/page/warranty" className="hover:text-white transition-colors">Warranty</a></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Shop</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Mobiles & Tablets</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Laptops & Computers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Smart Watches</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Audio Devices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gaming Consoles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Smart Home Devices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
            </ul>
          </div>

          {/* Deals */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Deals</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Today’s Deals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Clearance Sale</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><Mail size={16} /> support@techlight.com</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +880 1234-567890</li>
            </ul>
            <div className="flex gap-3 mt-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors"><Facebook /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter /></a>
              <a href="#" className="hover:text-white transition-colors"><Youtube /></a>
            </div>
          </div>
        </div>

        {/* Newsletter & Payment */}
        <div className="max-w-7xl mx-auto mt-10 border-t border-gray-700 pt-6 grid md:grid-cols-2 gap-6">
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Subscribe</h3>
            <p className="mb-3 text-gray-400">Subscribe to get our latest deals & updates</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-3 py-2 rounded-l-md w-full text-black focus:outline-none"
              />
              <button className="bg-blue-600 px-4 py-2 rounded-r-md text-white hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Payment & Shipping */}
          <div className="md:text-right">
            <h3 className="text-lg font-semibold mb-3 text-white">Payment & Shipping</h3>
            <p className="mb-2 text-gray-400">We accept: Visa, Mastercard, PayPal</p>
            <p className="text-gray-400">Shipping Partners: DHL, FedEx, UPS</p>
          </div>
        </div>

        {/* Legal */}
        <div className="max-w-7xl mx-auto mt-6 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between text-sm text-gray-500">
          <p>© 2025 TechLight. All Rights Reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
