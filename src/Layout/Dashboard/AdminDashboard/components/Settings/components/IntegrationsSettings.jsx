import React from "react";

const IntegrationsSettings = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Integrations</h3>
      <p className="text-gray-300">
        Connect your platform with third-party services and tools.
      </p>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="stripe" className="w-4 h-4" />
        <label htmlFor="stripe">Enable Stripe Payments</label>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" id="paypal" className="w-4 h-4" />
        <label htmlFor="paypal">Enable PayPal Payments</label>
      </div>

      <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition">
        Save Integration Settings
      </button>
    </div>
  );
};

export default IntegrationsSettings;
