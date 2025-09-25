import React from "react";

const BackupSettings = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Backup Settings</h3>
      <p className="text-gray-300">
        Manage data backups and recovery options.
      </p>

      <div>
        <label className="block text-sm text-gray-300 mb-1">
          Backup Frequency
        </label>
        <select className="w-full px-3 py-2 rounded-lg bg-purple-900 text-white border border-purple-600 focus:outline-none">
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>

      <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-medium transition">
        Save Backup Settings
      </button>
    </div>
  );
};

export default BackupSettings;
