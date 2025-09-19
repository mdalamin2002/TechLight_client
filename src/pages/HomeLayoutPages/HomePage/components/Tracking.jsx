import React, { useState } from "react";

export const Tracking = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);

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
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-950">
        Track Your Order
      </h2>

      {/* Input Box */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-950"
        />
        <button
          onClick={handleTrack}
          className="bg-blue-950 text-white px-5 py-2 rounded-lg hover:bg-blue-900 transition cursor-pointer"
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
              <p>
                <span className="font-semibold">Order ID:</span> {status.id}
              </p>
              <p>
                <span className="font-semibold">Product:</span> {status.product}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className="text-green-600 font-semibold">
                  {status.progress}
                </span>
              </p>
              <p>
                <span className="font-semibold">Expected Delivery:</span>{" "}
                {status.expected}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
