import React from "react";

const SiteSettings = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Site Configuration</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Site Name */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Site Name</label>
          <input
            type="text"
            defaultValue="E-commerce Platform"
            className="w-full px-3 py-2 rounded-lg bg-purple-900 text-white border border-purple-600 focus:outline-none"
          />
        </div>

        {/* Default Currency */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Default Currency
          </label>
          <select className="w-full px-3 py-2 rounded-lg bg-purple-900 text-white border border-purple-600 focus:outline-none">
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
          </select>
        </div>

        {/* Site Description */}
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-300 mb-1">
            Site Description
          </label>
          <textarea
            rows="3"
            defaultValue="Your premier online shopping destination"
            className="w-full px-3 py-2 rounded-lg bg-purple-900 text-white border border-purple-600 focus:outline-none"
          />
        </div>

        {/* Default Language */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Default Language
          </label>
          <select className="w-full px-3 py-2 rounded-lg bg-purple-900 text-white border border-purple-600 focus:outline-none">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>

        {/* Tax Rate */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Tax Rate (%)
          </label>
          <input
            type="number"
            defaultValue="8.5"
            className="w-full px-3 py-2 rounded-lg bg-purple-900 text-white border border-purple-600 focus:outline-none"
          />
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Theme</label>
          <select className="w-full px-3 py-2 rounded-lg bg-purple-900 text-white border border-purple-600 focus:outline-none">
            <option>Dark</option>
            <option>Light</option>
          </select>
        </div>
      </div>

      <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition">
        Save Site Settings
      </button>
    </div>
  );
};

export default SiteSettings;
