import React, { useState } from "react";

const initialMethods = [
  { id: 1, name: "bKash", enabled: true },
  { id: 2, name: "Nagad", enabled: false },
  { id: 3, name: "Card", enabled: true },
  { id: 4, name: "Bank Transfer", enabled: false },
];

const Settings = () => {
  const [methods, setMethods] = useState(initialMethods);
  const [environment, setEnvironment] = useState("sandbox");
  const [apiKey, setApiKey] = useState("");
  const [newMethod, setNewMethod] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const toggleMethod = (id) => {
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const deleteMethod = (id) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const saveMethod = () => {
    if (!newMethod.trim()) return;
    if (editId) {
      // Edit existing method
      setMethods((prev) =>
        prev.map((m) => (m.id === editId ? { ...m, name: newMethod } : m))
      );
      setEditId(null);
    } else {
      // Add new method
      const nextId = methods.length ? Math.max(...methods.map((m) => m.id)) + 1 : 1;
      setMethods([...methods, { id: nextId, name: newMethod, enabled: false }]);
    }
    setNewMethod("");
  };

  const handleSaveSettings = () => {
    if (environment === "live" && !apiKey) {
      setError("API Key is required for Live environment!");
      return;
    }
    setError("");
    console.log("Environment:", environment);
    console.log("API Key:", apiKey);
    console.log("Payment Methods:", methods);
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Payment Settings</h1>

      {/* Environment */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Environment</h2>
        <div className="flex gap-4 flex-wrap">
          {["sandbox", "live"].map((env) => (
            <button
              key={env}
              onClick={() => setEnvironment(env)}
              className={`px-5 py-2 rounded-lg font-medium transition ${
                environment === env
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {env.charAt(0).toUpperCase() + env.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">API Key</h2>
        <input
          type="text"
          placeholder="Enter API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
      </div>

      {/* Payment Methods */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
        <div className="flex flex-col gap-4">
          {methods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <div className="flex items-center gap-4">
                <span className="font-medium">{method.name}</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-semibold ${
                    method.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {method.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={method.enabled}
                  onChange={() => toggleMethod(method.id)}
                  className="cursor-pointer"
                />
                <button
                  onClick={() => {
                    setEditId(method.id);
                    setNewMethod(method.name);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMethod(method.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add / Edit Method */}
          <div className="flex gap-3 mt-2">
            <input
              type="text"
              placeholder="Enter payment method"
              value={newMethod}
              onChange={(e) => setNewMethod(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={saveMethod}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
            >
              {editId ? "Update" : "Add"}
            </button>
            {editId && (
              <button
                onClick={() => {
                  setEditId(null);
                  setNewMethod("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 shadow transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
