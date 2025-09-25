import React, { useState } from "react";

const MultiLanguage = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD ($)");
  const [exchangeSource, setExchangeSource] = useState("Automatic (API)");
  const [autoDetect, setAutoDetect] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const languages = ["English", "Spanish", "French", "German", "Chinese"];

  const handleCheckboxChange = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  return (
    <div className="space-y-10 p-6 bg-gray-50 min-h-screen">
      
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-900">Multi-language & Multi-currency</h2>

      {/* Supported Languages */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Supported Languages</h3>
        <div className="space-y-3">
          {languages.map((lang, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(lang)}
                  onChange={() => handleCheckboxChange(lang)}
                  className="w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-indigo-400 transition"
                />
                <span className="text-gray-800 font-medium">{lang}</span>
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow hover:bg-indigo-700 transition-all duration-300">
                Edit Translations
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Currency Settings */}
      <div className="bg-white rounded-3xl shadow-lg p-6 space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Currency Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-2">Base Currency</label>
            <select
              className="border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
            >
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>JPY (¥)</option>
              <option>INR (₹)</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-2">Exchange Rate Source</label>
            <select
              className="border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
              value={exchangeSource}
              onChange={(e) => setExchangeSource(e.target.value)}
            >
              <option>Automatic (API)</option>
              <option>Manual</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={autoDetect}
            onChange={(e) => setAutoDetect(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-indigo-400 transition"
          />
          <label className="text-gray-700 font-medium">Auto-detect user location for currency</label>
        </div>

        <div className="flex justify-end">
          <button className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all duration-300">
            Save Language Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiLanguage;
