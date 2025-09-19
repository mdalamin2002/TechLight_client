import React, { useState } from "react";

export const Tracking = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);

  // Steps of tracking
  const steps = [
    { title: "Ordered", date: "Nov 20" },
    { title: "Order ready", date: "Nov 20" },
    { title: "Shipped", date: "Nov 21" },
    { title: "Out for delivery", date: "Nov 21" },
    { title: "Delivered", date: "Nov 22" },
  ];

  // Dummy order tracking simulation
  const handleTrack = () => {
    if (orderId === "12345") {
      setStatus({
        id: "12345",
        product: "Smartphone XYZ",
        progress: "Shipped",
        expected: "22 Sept 2025",
      });
    } else {
      setStatus("notfound");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6  shadow-lg rounded-2xl mt-12">
      <h2 className="text-2xl font-bold mb-4 border-b border-black/30 pb-2 text-black text-center">
        Track Your Order
      </h2>

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
        />

        <button
        onClick={handleTrack}
          className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-[#3749BB] text-[#FFFFFF] text-sm font-medium rounded-lg hover:opacity-90 transition"
        >
          Track
        </button>
      </div>

      {/* Result Section */}
      {status && (
        <div className="mt-6">
          {status === "notfound" ? (
            <p className="text-red-600 text-center font-semibold">
              ❌ Order not found. Please check your Order ID.
            </p>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="mb-2">
                <span className="font-semibold">Order ID:</span> {status.id}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Product:</span> {status.product}
              </p>
              <p className="mb-4">
                <span className="font-semibold">Expected Delivery:</span>{" "}
                {status.expected}
              </p>

              {/* Timeline */}
              <div className="relative border-l-4 border-blue-950 pl-6">
                {steps.map((step, index) => {
                  const isActive =
                    steps.findIndex((s) => s.title === status.progress) >=
                    index;

                  return (
                    <div key={index} className="mb-6 last:mb-0 relative">
                      {/* Circle */}
                      <span
                        className={`absolute -left-[37px] flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                          isActive
                            ? "bg-green-700 text-white border-green-700"
                            : "bg-white text-gray-400 border-gray-300"
                        }`}
                      >
                        ✓
                      </span>

                      {/* Text */}
                      <p
                        className={`font-semibold ${
                          isActive ? "text-blue-950" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-sm text-gray-500">{step.date}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
