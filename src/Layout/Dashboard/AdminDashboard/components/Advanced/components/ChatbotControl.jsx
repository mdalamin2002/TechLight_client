import React, { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";

const ChatbotControl = () => {
  const [chatbotName, setChatbotName] = useState("Customer Support Bot");
  const [description, setDescription] = useState("Handles customer inquiries and support tickets");
  const [faq, setFaq] = useState("Enter frequently asked questions and answers...");
  const [greeting, setGreeting] = useState("Hello! How can I help you today?");
  const [isActive, setIsActive] = useState(true); // ON/OFF state
  const [analytics] = useState({
    interactions: "1,245",
    resolutionRate: "78%",
    avgResponse: "2.3m",
  });

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">

      {/* Chatbot Status with Modern Toggle */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 flex items-center justify-between">
        <div>
          <p className="text-2xl font-semibold text-gray-900">{chatbotName}</p>
          <p className="text-gray-500 mt-1">{description}</p>
        </div>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center gap-3 px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
            isActive
              ? "bg-green-100 text-green-800 shadow hover:bg-green-200"
              : "bg-gray-200 text-gray-600 shadow hover:bg-gray-300"
          }`}
        >
          {isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
          <span className="text-lg">{isActive ? "Active" : "Inactive"}</span>
        </button>
      </div>

      {/* Knowledge Base */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Knowledge Base</h3>
        <p className="text-gray-500 mb-2">Common Questions</p>
        <textarea
          className="w-full border border-gray-300 rounded-2xl p-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm hover:shadow-md resize-none"
          rows={5}
          value={faq}
          onChange={(e) => setFaq(e.target.value)}
          placeholder="Enter frequently asked questions and answers..."
        />
      </div>

      {/* Greeting Message */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Greeting Message</h3>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-2xl p-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm hover:shadow-md"
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
          placeholder="Hello! How can I help you today?"
        />
      </div>

      {/* Analytics */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-pink-50 border border-gray-200 rounded-3xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Analytics</h3>
        <div className="grid grid-cols-3 gap-5 text-center">
          {Object.entries(analytics).map(([key, value]) => (
            <div key={key} className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition-all duration-300">
              <p className="text-gray-400 capitalize text-sm">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="font-bold text-lg text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-indigo-600 text-white font-semibold px-7 py-3 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all duration-300">
          Save Chatbot Settings
        </button>
      </div>
    </div>
  );
};

export default ChatbotControl;
