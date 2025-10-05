import React from "react";
import { Eye, RotateCcw, X, Settings, Truck, CreditCard } from "lucide-react";

const OrderActions = ({ order, openMenu, setOpenMenu, openModal, index }) => {
  return (
    <div className="relative inline-block text-left">
      {/* Main Action Button */}
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        onClick={() => setOpenMenu(openMenu === index ? null : index)}
      >
        <Settings className="w-5 h-5 text-gray-600" />
      </button>

      {/* Dropdown Menu */}
      {openMenu === index && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-xl z-20 animate-fadeIn">
          {/* View Details */}
          <button
            onClick={() => openModal("view", order)}
            className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 transition rounded-t-xl"
          >
            <Eye size={16} className="text-purple-600" /> View Details
          </button>

          {/* Delivery Status */}
          <div className="relative group">
            <button className="w-full px-4 py-2 text-sm flex items-center  gap-2 hover:bg-gray-100 transition">
              <Truck size={16} className="text-green-600" /> Delivery Status
            </button>
            <div className="absolute top-0 right-full mt-0 ml-2 w-44 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-30">
              {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    alert(`Delivery status for ${order.id} updated to ${status}`);
                    setOpenMenu(null);
                  }}
                  className="w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div className="relative group">
            <button className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 transition">
              <CreditCard size={16} className="text-blue-600" /> Payment Status
            </button>
            <div className="absolute top-0 right-full mt-0 ml-2 w-44 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-30">
              {["Pending", "Paid", "Refunded"].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    alert(`Payment status for ${order.id} updated to ${status}`);
                    setOpenMenu(null);
                  }}
                  className="w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Cancel Order */}
          <button
            onClick={() => openModal("cancel", order)}
            className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 transition text-red-600"
          >
            <X size={16} /> Cancel Order
          </button>

          {/* Refund Order */}
          <button
            onClick={() => openModal("refund", order)}
            className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 transition rounded-b-xl text-blue-600"
          >
            <RotateCcw size={16} /> Refund Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderActions;
