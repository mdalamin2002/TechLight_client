import { Facebook, Instagram, Mail, Phone, Twitter, Youtube } from 'lucide-react';
import React from 'react';

const Footer = () => {
    return (
        <div>
           <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">About</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Mission & Vision</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Customer Service</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">FAQ</a></li>
            <li><a href="#" className="hover:text-white">Shipping & Delivery</a></li>
            <li><a href="#" className="hover:text-white">Returns & Refunds</a></li>
            <li><a href="#" className="hover:text-white">Order Tracking</a></li>
            <li><a href="https://www.ryans.com/page/warranty" className="hover:text-white">Warranty</a></li>
          </ul>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Shop</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Mobiles & Tablets</a></li>
            <li><a href="#" className="hover:text-white">Laptops & Computers</a></li>
            <li><a href="#" className="hover:text-white">Smart Watches</a></li>
            <li><a href="#" className="hover:text-white">Audio Devices</a></li>
            <li><a href="#" className="hover:text-white">Gaming Consoles</a></li>
            <li><a href="#" className="hover:text-white">Smart Home Devices</a></li>
            <li><a href="#" className="hover:text-white">Accessories</a></li>
          </ul>
        </div>

        {/* Deals */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Deals</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Today’s Deals</a></li>
            <li><a href="#" className="hover:text-white">Clearance Sale</a></li>
            <li><a href="#" className="hover:text-white">Gift Cards</a></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">My Account</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Login / Register</a></li>
            <li><a href="#" className="hover:text-white">My Orders</a></li>
            <li><a href="#" className="hover:text-white">Wishlist</a></li>
            <li><a href="#" className="hover:text-white">Profile Settings</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><Mail size={16}/> support@example.com</li>
            <li className="flex items-center gap-2"><Phone size={16}/> +880 1234-567890</li>
          </ul>
          <div className="flex gap-3 mt-4">
            <a href="#" className="hover:text-white"><Facebook /></a>
            <a href="#" className="hover:text-white"><Instagram /></a>
            <a href="#" className="hover:text-white"><Twitter /></a>
            <a href="#" className="hover:text-white"><Youtube /></a>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-7xl mx-auto mt-10 border-t border-gray-700 pt-6 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Subscribe</h3>
          <p className="mb-3">Subscribe for Deals & Updates</p>
          <div className="flex">
            <input type="email" placeholder="Enter your email" className="px-3 py-2 rounded-l-md w-full text-black" />
            <button className="bg-blue-600 px-4 py-2 rounded-r-md text-white">Subscribe</button>
          </div>
        </div>

        {/* Payment & Policies */}
        <div className="md:text-right">
          <h3 className="text-lg font-semibold text-white mb-3">Payment & Shipping</h3>
          <p className="mb-2">We accept: Visa, Mastercard, PayPal</p>
          <p>Shipping Partners: DHL, FedEx, UPS</p>
        </div>
      </div>

      {/* Legal */}
      <div className="max-w-7xl mx-auto mt-6 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between text-sm text-gray-500">
        <p>© 2025 Your Company. All Rights Reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms & Conditions</a>
          <a href="#" className="hover:text-white">Cookie Policy</a>
        </div>
      </div>
        </div>
    );
};

export default Footer;