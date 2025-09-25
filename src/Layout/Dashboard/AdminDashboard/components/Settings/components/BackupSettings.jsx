import React from "react";

const BackupSettings = () => {
  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow border border-gray-200 text-gray-800">
      {/* Header */}
      <h3 className="text-xl font-semibold text-gray-900">
        Backup Configuration
      </h3>
      <p className="text-gray-600">
        Manage automatic and manual data backups with ease.
      </p>

      {/* Automatic Backup */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-800 border-b pb-2">
          Automatic Backup
        </h4>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="auto-backup"
            className="w-4 h-4 accent-indigo-600"
          />
          <label htmlFor="auto-backup" className="text-gray-700">
            Enable automatic backups
          </label>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Backup Frequency
          </label>
          <select className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Retention Period (days)
          </label>
          <input
            type="number"
            defaultValue="30"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Manual Backup + Save Button */}
      <div className="pt-6 space-y-3">
        <h4 className="text-lg font-medium text-gray-800 border-b pb-2">
          Manual Backup
        </h4>
        <p className="text-gray-600 text-sm">
          Create an immediate backup of your database and files.
        </p>

        <div className="flex justify-between items-center gap-4 md:gap-99 pt-2">
          <button className="flex-1 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow">
            Create Backup Now
          </button>
          <button className="flex-1 px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition shadow">
            Save Backup Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;
