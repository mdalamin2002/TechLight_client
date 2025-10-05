import React from "react";
import { X } from "lucide-react";

const OrderModal = ({ modalType, order, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative">
        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"><X size={20} /></button>

        {modalType === "view" && (
          <>
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>
            <p><strong>ID:</strong> {order.id}</p>
            <p><strong>Customer:</strong> {order.customer}</p>
            <p><strong>Products:</strong> {order.products}</p>
            <p><strong>Amount:</strong> {order.amount}</p>
            <p><strong>Payment:</strong> {order.payment}</p>
            <p><strong>Delivery:</strong> {order.delivery}</p>
            <p><strong>Date:</strong> {order.date}</p>
          </>
        )}

        {modalType === "refund" && (
          <>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Confirm Refund</h3>
            <p>Are you sure you want to refund <strong>{order.id}</strong>?</p>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button onClick={() => { alert(`Refund processed for ${order.id}`); closeModal(); }} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Confirm</button>
            </div>
          </>
        )}

        {modalType === "cancel" && (
          <>
            <h3 className="text-xl font-semibold mb-4 text-red-600">Cancel Order</h3>
            <p>Do you really want to cancel <strong>{order.id}</strong>?</p>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg border">Back</button>
              <button onClick={() => { alert(`Order ${order.id} cancelled`); closeModal(); }} className="px-4 py-2 rounded-lg bg-red-600 text-white">Confirm Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
