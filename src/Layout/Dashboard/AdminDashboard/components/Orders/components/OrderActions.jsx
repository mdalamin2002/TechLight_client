import React from "react";
import Swal from "sweetalert2";
import { Eye, MoreVertical, Truck } from "lucide-react";

const OrderActions = ({
  order,
  openMenu,
  setOpenMenu,
  onStatusChange,
  deliveryList,
  index,
}) => {

  // Badge color logic
  const getBadgeColor = (status) => {
    switch (status) {
      case "success":
        return "green";
      case "pending":
        return "amber";
      case "shipped":
        return "blue";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get customer information
  const getCustomerInfo = (customer) => {
    if (!customer) return { name: "N/A", email: "N/A" };
    return {
      name: customer.fullName || customer.name || "N/A",
      email: customer.email || "N/A"
    };
  };

  // Get product information with name truncation
  const getProductInfo = (products) => {
    if (!products || !Array.isArray(products) || products.length === 0) return [];
    return products.map(p => ({
      name: p.name && p.name.length > 30 ? p.name.substring(0, 30) + "..." : p.name || "Unnamed Product",
      quantity: p.quantity || 1,
      price: p.price || 0,
      seller: p.seller?.name && p.seller.name.length > 20 ? p.seller.name.substring(0, 20) + "..." : p.seller?.name || "Unknown Seller"
    }));
  };

  // Get order status
  const getOrderStatus = (order) => {
    return order.status || "N/A";
  };

  // Get order amount
  const getOrderAmount = (order) => {
    if (order.total_amount) {
      return `BDT ${order.total_amount.toLocaleString()}`;
    }
    return "BDT 0";
  };

  // View order details
  const viewOrderDetails = () => {
    const customer = getCustomerInfo(order.customer);
    const products = getProductInfo(order.products);

    let productDetails = "";
    products.forEach((product, idx) => {
      productDetails += `
        <tr>
          <td style="padding: 4px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${product.name}">${idx + 1}.</td>
          <td style="padding: 4px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${product.name}">${product.name}</td>
          <td style="padding: 4px;">${product.quantity}</td>
          <td style="padding: 4px;">BDT ${product.price.toLocaleString()}</td>
          <td style="padding: 4px; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${product.seller}">${product.seller}</td>
        </tr>
      `;
    });

    Swal.fire({
      title: `Order Details - ${order.order_id}`,
      width: 800,
      html: `
        <div class="text-left">
          <h3 class="font-bold text-lg mb-2">Order Information</h3>
          <table style="text-align:left; width:100%; font-size:14px; line-height:1.5">
            <tr><td style="padding: 4px; width: 30%;"><b>Order ID:</b></td><td style="padding: 4px;">${order.order_id || "N/A"}</td></tr>
            <tr><td style="padding: 4px;"><b>Transaction ID:</b></td><td style="padding: 4px;">${order.tran_id || "N/A"}</td></tr>
            <tr><td style="padding: 4px;"><b>Order Date:</b></td><td style="padding: 4px;">${formatDate(order.createdAt)}</td></tr>
            <tr><td style="padding: 4px;"><b>Status:</b></td><td style="padding: 4px; color:${getBadgeColor(getOrderStatus(order))}; font-weight:bold;">${getOrderStatus(order)}</td></tr>
            <tr><td style="padding: 4px;"><b>Total Amount:</b></td><td style="padding: 4px;">${getOrderAmount(order)}</td></tr>
            <tr><td style="padding: 4px;"><b>Payment Method:</b></td><td style="padding: 4px;">${order.payment_method || "N/A"}</td></tr>
          </table>

          <h3 class="font-bold text-lg mt-4 mb-2">Customer Information</h3>
          <table style="text-align:left; width:100%; font-size:14px; line-height:1.5">
            <tr><td style="padding: 4px; width: 30%;"><b>Name:</b></td><td style="padding: 4px;">${customer.name}</td></tr>
            <tr><td style="padding: 4px;"><b>Email:</b></td><td style="padding: 4px;">${customer.email}</td></tr>
            <tr><td style="padding: 4px;"><b>Phone:</b></td><td style="padding: 4px;">${order.customer?.phone || "N/A"}</td></tr>
            <tr><td style="padding: 4px;"><b>Address:</b></td><td style="padding: 4px;">${order.customer?.address || "N/A"}</td></tr>
            <tr><td style="padding: 4px;"><b>City:</b></td><td style="padding: 4px;">${order.customer?.city || "N/A"}</td></tr>
            <tr><td style="padding: 4px;"><b>Postal Code:</b></td><td style="padding: 4px;">${order.customer?.postal || "N/A"}</td></tr>
            <tr><td style="padding: 4px;"><b>Country:</b></td><td style="padding: 4px;">${order.customer?.country || "N/A"}</td></tr>
          </table>

          <h3 class="font-bold text-lg mt-4 mb-2">Products</h3>
          <table style="text-align:left; width:100%; font-size:14px; line-height:1.5; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 6px; border: 1px solid #ddd;">#</th>
                <th style="padding: 6px; border: 1px solid #ddd;">Product</th>
                <th style="padding: 6px; border: 1px solid #ddd;">Qty</th>
                <th style="padding: 6px; border: 1px solid #ddd;">Price</th>
                <th style="padding: 6px; border: 1px solid #ddd;">Seller</th>
              </tr>
            </thead>
            <tbody>
              ${productDetails}
            </tbody>
          </table>
        </div>
      `,
      icon: "info",
      customClass: {
        popup: 'rounded-xl',
        header: 'rounded-t-xl',
      },
      confirmButtonText: "Close"
    });
    setOpenMenu(null);
  };

  // Confirmation alert with better UI
  const handleStatusChange = (newStatus) => {
    const customer = getCustomerInfo(order.customer);
    const products = getProductInfo(order.products);

    let productSummary = "";
    products.slice(0, 2).forEach((product, idx) => {
      productSummary += `${product.name}${idx < products.length - 1 ? ", " : ""}`;
    });
    if (products.length > 2) {
      productSummary += ` and ${products.length - 2} more`;
    }

    Swal.fire({
      title: `Change Order Status?`,
      html: `
        <div class="text-left">
          <table style="text-align:left; width:100%; font-size:14px; line-height:1.5">
            <tr><td style="padding: 4px;"><b>Order ID:</b></td><td style="padding: 4px;">${order.order_id || "N/A"}</td></tr>
            <tr><td style="padding: 4px;"><b>Customer:</b></td><td style="padding: 4px;">${customer.name}</td></tr>
            <tr><td style="padding: 4px;"><b>Products:</b></td><td style="padding: 4px;">${productSummary}</td></tr>
            <tr><td style="padding: 4px;"><b>Amount:</b></td><td style="padding: 4px;">${getOrderAmount(order)}</td></tr>
            <tr><td style="padding: 4px;"><b>Current Status:</b></td>
              <td style="padding: 4px; color:${getBadgeColor(getOrderStatus(order))}; font-weight:bold;">
                ${getOrderStatus(order)}
              </td>
            </tr>
            <tr><td style="padding: 4px;"><b>New Status:</b></td>
              <td style="padding: 4px; color:${getBadgeColor(newStatus)}; font-weight:bold;">${newStatus}</td>
            </tr>
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
        // Update the order status
        onStatusChange(order._id, "status", newStatus);

        Swal.fire({
          title: "Updated!",
          text: `Order status changed to "${newStatus}".`,
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
              onClick={viewOrderDetails}
              className="w-full px-4 py-3 text-sm flex items-center gap-3 hover:bg-muted transition-colors duration-200 text-left"
            >
              <Eye size={16} className="text-primary" />
              <span>View Details</span>
            </button>

            <div className="border-t border-border/50"></div>

            {/* Status Options */}
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Change Status
              </div>
              {deliveryList.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
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
          </div>
        </>
      )}
    </div>
  );
};

export default OrderActions;
