import React from "react";

const SecuritySettings = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Security Settings</h3>
      <p className="text-gray-300">
        Configure password policies, 2FA, and login restrictions.
      </p>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="2fa" className="w-4 h-4" />
        <label htmlFor="2fa">Enable Two-Factor Authentication</label>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1">
          Password Expiry (days)
        </label>
        <input
          type="number"
          defaultValue="90"
          className="w-full px-3 py-2 rounded-lg bg-purple-900 text-white border border-purple-600 focus:outline-none"
        />
      </div>

      <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition">
        Save Security Settings
      </button>
    </div>
  );
};

export default SecuritySettings;
