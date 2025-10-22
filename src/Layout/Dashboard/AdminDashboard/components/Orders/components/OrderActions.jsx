import React from "react";
import Swal from "sweetalert2";
import { Eye, MoreVertical, Truck, CreditCard } from "lucide-react";

const OrderActions = ({
  order,
  openMenu,
  setOpenMenu,
  onStatusChange,
  paymentList,
  deliveryList,
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
        return "amber";
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
        <div class="text-left">
          <table style="text-align:left; width:100%; font-size:14px; line-height:1.5">
            <tr><td style="padding: 4px;"><b>Order ID:</b></td><td style="padding: 4px;">${order.id}</td></tr>
            <tr><td style="padding: 4px;"><b>Customer:</b></td><td style="padding: 4px;">${order.customer}</td></tr>
            <tr><td style="padding: 4px;"><b>Products:</b></td><td style="padding: 4px;">${order.products}</td></tr>
            <tr><td style="padding: 4px;"><b>Amount:</b></td><td style="padding: 4px;">${order.amount}</td></tr>
            <tr><td style="padding: 4px;"><b>Payment:</b></td><td style="padding: 4px; color:${getBadgeColor(order.payment)}; font-weight:bold;">${order.payment}</td></tr>
            <tr><td style="padding: 4px;"><b>Delivery:</b></td><td style="padding: 4px; color:${getBadgeColor(order.delivery)}; font-weight:bold;">${order.delivery}</td></tr>
            <tr><td style="padding: 4px;"><b>Date:</b></td><td style="padding: 4px;">${order.date}</td></tr>
            <tr><td style="padding: 4px;"><b>New ${type} Status:</b></td><td style="padding: 4px; color:${getBadgeColor(status)}; font-weight:bold;">${status}</td></tr>
          </table>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#5061fc",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
      customClass: {
        popup: 'rounded-xl',
        header: 'rounded-t-xl',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onStatusChange(order.id, type, status);
        Swal.fire({
          title: "Updated!",
          text: `${type} status changed to "${status}".`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-xl',
          }
        });
      }
      setOpenMenu(null);
    });
  };

  return (
    <div className="relative inline-block text-left">
      {/* Three dots button */}
      <button
        className="p-1.5 rounded-lg hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-foreground"
        onClick={() => setOpenMenu(openMenu === index ? null : index)}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      {openMenu === index && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpenMenu(null)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden">

            {/* View Details */}
            <button
              onClick={() => {
                setOpenMenu(null);
                // You can add view details functionality here
              }}
              className="w-full px-4 py-3 text-sm flex items-center gap-3 hover:bg-muted transition-colors duration-200 text-left"
            >
              <Eye size={16} className="text-primary" />
              <span>View Details</span>
            </button>

            <div className="border-t border-border/50"></div>

            {/* Delivery Status */}
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Delivery Status
              </div>
              {deliveryList.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange("delivery", status)}
                  className={`w-full px-4 py-2 text-sm hover:bg-muted text-left transition-colors duration-200 flex items-center gap-3 ${
                    getBadgeColor(status) === 'green' ? 'text-green-600' :
                    getBadgeColor(status) === 'red' ? 'text-red-600' :
                    getBadgeColor(status) === 'blue' ? 'text-blue-600' :
                    getBadgeColor(status) === 'amber' ? 'text-amber-600' :
                    'text-gray-600'
                  }`}
                >
                  <Truck size={16} />
                  <span>{status}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-border/50"></div>

            {/* Payment Status */}
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Payment Status
              </div>
              {paymentList.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange("payment", status)}
                  className={`w-full px-4 py-2 text-sm hover:bg-muted text-left transition-colors duration-200 flex items-center gap-3 ${
                    getBadgeColor(status) === 'green' ? 'text-green-600' :
                    getBadgeColor(status) === 'red' ? 'text-red-600' :
                    getBadgeColor(status) === 'blue' ? 'text-blue-600' :
                    getBadgeColor(status) === 'amber' ? 'text-amber-600' :
                    'text-gray-600'
                  }`}
                >
                  <CreditCard size={16} />
                  <span>{status}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderActions;
