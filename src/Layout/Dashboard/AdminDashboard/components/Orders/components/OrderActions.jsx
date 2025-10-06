import React from "react";
import Swal from "sweetalert2";
import { Eye, Settings, Truck, CreditCard } from "lucide-react";

const OrderActions = ({
  order,
  openMenu,
  setOpenMenu,
  onStatusChange,
  paymentList,
  deliveryList,
  openModal,
  index,
}) => {

  // Badge color logic
  const getBadgeColor = (s) => {
    switch (s.toLowerCase()) {
      case "paid":
      case "delivered":
        return "green";
      case "pending":
      case "processing":
        return "orange";
      case "shipped":
        return "blue";
      case "refunded":
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  // Confirmation alert with better UI
  const handleStatusChange = (type, status) => {
    Swal.fire({
      title: `Change ${type} Status?`,
      html: `
        <table style="text-align:left; width:100%; font-size:14px; line-height:1.5">
          <tr><td><b>Order ID:</b></td><td>${order.id}</td></tr>
          <tr><td><b>Customer:</b></td><td>${order.customer}</td></tr>
          <tr><td><b>Products:</b></td><td>${order.products}</td></tr>
          <tr><td><b>Amount:</b></td><td>${order.amount}</td></tr>
          <tr><td><b>Payment:</b></td><td style="color:${getBadgeColor(order.payment)}; font-weight:bold;">${order.payment}</td></tr>
          <tr><td><b>Delivery:</b></td><td style="color:${getBadgeColor(order.delivery)}; font-weight:bold;">${order.delivery}</td></tr>
          <tr><td><b>Date:</b></td><td>${order.date}</td></tr>
          <tr><td><b>New ${type} Status:</b></td><td style="color:${getBadgeColor(status)}; font-weight:bold;">${status}</td></tr>
        </table>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onStatusChange(order.id, type, status);
        Swal.fire({
          title: "Updated!",
          text: `${type} status changed to "${status}".`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setOpenMenu(null);
    });
  };

  return (
    <div className="relative inline-block text-left">
      {/* Settings Button */}
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition shadow-sm"
        onClick={() => setOpenMenu(openMenu === index ? null : index)}
      >
        <Settings className="w-5 h-5 text-gray-600" />
      </button>

      {/* Dropdown Menu */}
      {openMenu === index && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-xl z-20">
          
          {/* View Details */}
          <button
            onClick={() => {
              openModal("view", order);
              setOpenMenu(null);
            }}
            className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 transition rounded-t-xl"
          >
            <Eye size={16} className="text-purple-600" /> View Details
          </button>

          {/* Delivery Status */}
          <div className="relative group">
            <button className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 transition">
              <Truck size={16} className="text-green-600" /> Delivery Status
            </button>
            <div className="absolute top-0 right-full ml-2 w-44 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
              {deliveryList.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange("delivery", status)}
                  className={`w-full px-4 py-2 text-sm hover:bg-gray-100 text-left transition flex items-center gap-2 ${getBadgeColor(status) === 'green' ? 'text-green-600' : getBadgeColor(status) === 'red' ? 'text-red-600' : getBadgeColor(status) === 'blue' ? 'text-blue-600' : 'text-orange-600'}`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full bg-${getBadgeColor(status)}-500`}></span> {status}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div className="relative group">
            <button className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 transition">
              <CreditCard size={16} className="text-blue-600" /> Payment Status
            </button>
            <div className="absolute top-0 right-full ml-2 w-44 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
              {paymentList.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange("payment", status)}
                  className={`w-full px-4 py-2 text-sm hover:bg-gray-100 text-left transition flex items-center gap-2 ${getBadgeColor(status) === 'green' ? 'text-green-600' : getBadgeColor(status) === 'red' ? 'text-red-600' : getBadgeColor(status) === 'blue' ? 'text-blue-600' : 'text-orange-600'}`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full bg-${getBadgeColor(status)}-500`}></span> {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderActions;
