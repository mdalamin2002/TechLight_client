import React, { useState } from "react";

// Initial integration data
const initialData = [
  {
    category: "Payment Gateways",
    items: [
      { name: "Stripe", desc: "Credit card processing", status: "Connected", actions: ["Configure"] },
      { name: "PayPal", desc: "PayPal payments", status: "Not Connected", actions: ["Connect"] },
    ],
  },
  {
    category: "Shipping Partners",
    items: [
      { name: "FedEx", desc: "Express shipping", status: "Connected", actions: ["Configure"] },
      { name: "UPS", desc: "Standard shipping", status: "Not Connected", actions: ["Connect"] },
    ],
  },
  {
    category: "Email Services",
    items: [
      { name: "SMTP Server", desc: "smtp.example.com", status: "Pending", actions: ["Configure"] },
      { name: "Username", desc: "user@example.com", status: "Pending", actions: ["Configure"] },
      { name: "Password", desc: "********", status: "Pending", actions: ["Configure"] },
    ],
  },
];

// Helper for status colors
const getStatusColor = (status) => {
  switch (status) {
    case "Connected":
      return "bg-green-100 text-green-800";
    case "Not Connected":
      return "bg-gray-200 text-gray-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const IntegrationsSettings = () => {
  const [integrations, setIntegrations] = useState(initialData);
  const [addingItem, setAddingItem] = useState(null); // category being added

  const handleAddIntegration = (category) => {
    setAddingItem(category);
  };

  const handleSaveNewItem = (category, name, desc) => {
    if (!name || !desc) return;
    setIntegrations((prev) =>
      prev.map((section) =>
        section.category === category
          ? {
              ...section,
              items: [
                ...section.items,
                { name, desc, status: "Not Connected", actions: ["Connect"] },
              ],
            }
          : section
      )
    );
    setAddingItem(null);
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-xl shadow-md text-gray-800">
      <h3 className="text-2xl font-bold text-gray-900">Third-Party Integrations</h3>
      <p className="text-gray-600 mb-4">
        Connect and manage external services dynamically.
      </p>

      {integrations.map((section) => (
        <div key={section.category} className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-800">{section.category}</h4>
            <button
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition"
              onClick={() => handleAddIntegration(section.category)}
            >
              + Add New
            </button>
          </div>

          <div className="space-y-2">
            {section.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <div className="flex gap-2 items-center">
                  {item.status && (
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  )}
                  {item.actions.map((action, i) => (
                    <button
                      key={i}
                      className={`px-3 py-1 rounded text-sm font-medium transition ${
                        action.toLowerCase().includes("connect")
                          ? "bg-gray-300 hover:bg-gray-400 text-gray-800"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Inline Add New Form */}
            {addingItem === section.category && (
              <div className="flex flex-col md:flex-row gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Integration Name"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id={`new-name-${section.category}`}
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id={`new-desc-${section.category}`}
                />
                <button
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                  onClick={() =>
                    handleSaveNewItem(
                      section.category,
                      document.getElementById(`new-name-${section.category}`).value,
                      document.getElementById(`new-desc-${section.category}`).value
                    )
                  }
                >
                  Add
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition"
                  onClick={() => setAddingItem(null)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition">
          Save Integration Settings
        </button>
      </div>
    </div>
  );
};

export default IntegrationsSettings;
