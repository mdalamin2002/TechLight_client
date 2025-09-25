import React from "react";

const SiteSettings = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
        Site Configuration
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Site Name */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Site Name</label>
          <input
            type="text"
            defaultValue="E-commerce Platform"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Default Currency */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Default Currency
          </label>
          <select className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-pink-400 focus:outline-none">
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
          </select>
        </div>

        {/* Site Description */}
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">
            Site Description
          </label>
          <textarea
            rows="3"
            defaultValue="Your premier online shopping destination"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Default Language */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Default Language
          </label>
          <select className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-pink-400 focus:outline-none">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>

        {/* Tax Rate */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Tax Rate (%)</label>
          <input
            type="number"
            defaultValue="8.5"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Theme</label>
          <select className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-pink-400 focus:outline-none">
            <option>Dark</option>
            <option>Light</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <button className="px-6 py-3 bg-gradient-to-r from-indigo-400 to-pink-400 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:opacity-90 transition">
        Save Site Settings
      </button>
    </div>
  );
};

export default SiteSettings;
