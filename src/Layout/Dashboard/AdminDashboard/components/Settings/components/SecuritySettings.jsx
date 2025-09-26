import React from "react";
import { FaSave, FaLock, FaShieldAlt, FaNetworkWired } from "react-icons/fa";

const SecuritySettings = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
          <FaShieldAlt /> Security Configuration
        </h3>
        <p className="text-gray-600 mt-1">
          Configure password policies, authentication, and login restrictions to
          keep your platform secure.
        </p>
      </div>

      {/* Password Policy */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-5 border border-gray-100 hover:shadow-xl transition">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <FaLock className="text-indigo-500" /> Password Policy
        </h4>
        <p className="text-sm text-gray-500">
          Define rules for stronger user account passwords.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Length
            </label>
            <input
              type="number"
              defaultValue="8"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Expiry (days)
            </label>
            <input
              type="number"
              defaultValue="90"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {[
            "Require uppercase letters",
            "Require numbers",
            "Require special characters",
          ].map((label, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2 text-gray-700 text-sm bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <input type="checkbox" className="accent-pink-500" /> {label}
            </label>
          ))}
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border border-gray-100 hover:shadow-xl transition">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <FaShieldAlt className="text-pink-500" /> Two-Factor Authentication
        </h4>
        <p className="text-sm text-gray-500">
          Add an extra layer of protection for user accounts.
        </p>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-gray-700 text-sm">
            <input type="checkbox" className="accent-indigo-500" /> Enable 2FA
            for all users
          </label>
          <label className="flex items-center gap-2 text-gray-700 text-sm">
            <input type="checkbox" className="accent-indigo-500" /> Require 2FA
            for admin accounts
          </label>
        </div>
      </div>

      {/* IP Blocking */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border border-gray-100 hover:shadow-xl transition">
        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
          <FaNetworkWired className="text-indigo-500" /> IP Blocking
        </h4>
        <p className="text-sm text-gray-500">
          Restrict access by blocking specific IP addresses.
        </p>

        <textarea
          rows="3"
          placeholder="Enter IP addresses, one per line..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-105 transition">
          <FaSave /> Save Security Settings
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
