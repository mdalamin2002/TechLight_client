import React, { useState } from "react";
import OrderActions from "./OrderActions";

const OrderTable = ({ orders, openModal }) => {
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full border-collapse">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-left">Order ID</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Customer</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Products</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Amount</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Payment</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Delivery</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Date</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"} hover:bg-indigo-100/70 transition-colors`}>
              <td className="px-4 py-3 text-purple-500 font-medium">{order.id}</td>
              <td className="px-4 py-3 font-medium">{order.customer}</td>
              <td className="px-4 py-3">{order.products}</td>
              <td className="px-4 py-3 font-medium">{order.amount}</td>
              <td className={`px-4 py-3 font-medium ${order.payment === "Paid" ? "text-green-600" : order.payment === "Pending" ? "text-yellow-600" : "text-red-600"}`}>{order.payment}</td>
              <td className={`px-4 py-3 font-medium ${order.delivery === "Delivered" ? "text-green-600" : order.delivery === "Shipped" ? "text-blue-600" : order.delivery === "Processing" ? "text-yellow-600" : order.delivery === "Cancelled" ? "text-red-600" : "text-orange-600"}`}>{order.delivery}</td>
              <td className="px-4 py-3">{order.date}</td>
              <td className="px-4 py-3 relative">
                <OrderActions order={order} openMenu={openMenu} setOpenMenu={setOpenMenu} openModal={openModal} index={i} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
