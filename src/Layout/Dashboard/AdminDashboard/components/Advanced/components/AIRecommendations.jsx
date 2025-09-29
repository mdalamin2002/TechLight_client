import React from "react";

const AIRecommendations = () => {
  return (
    <div className="space-y-6">
      {/* Recommendation Weights */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">
          AI Recommendation Engine
        </h3>
        <div className="space-y-4">
          <div>
            <p className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Based on View History</span> <span>70%</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "70%" }}></div>
            </div>
          </div>

          <div>
            <p className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Based on Purchase History</span> <span>85%</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-pink-500 h-2 rounded-full" style={{ width: "85%" }}></div>
            </div>
          </div>

          <div>
            <p className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Trending Products</span> <span>45%</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: "45%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-3 text-center">
          <div>
            <p className="text-green-600 font-bold text-xl">12.5%</p>
            <p className="text-gray-500 text-sm">Click-through Rate</p>
          </div>
          <div>
            <p className="text-blue-600 font-bold text-xl">8.3%</p>
            <p className="text-gray-500 text-sm">Conversion Rate</p>
          </div>
          <div>
            <p className="text-purple-600 font-bold text-xl">$45.20</p>
            <p className="text-gray-500 text-sm">Avg. Order Value</p>
          </div>
        </div>
      </div>

      {/* Exclusion Settings */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Exclusion Settings</h3>
        <label className="block text-sm text-gray-600 mb-1">
          Excluded Categories
        </label>
        <input
          type="text"
          placeholder="Enter categories to exclude (comma-separated)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Save Button */}
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
        Save AI Settings
      </button>
    </div>
  );
};

export default AIRecommendations;
