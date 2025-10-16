// src/pages/PaymentCancel.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";

const PaymentCancel = () => {
  const { tranId } = useParams();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-yellow-50">
      <h1 className="text-3xl font-bold text-yellow-600 mb-2">⚠️ Payment Cancelled!</h1>
      <p className="text-gray-600 mb-4">Transaction ID: {tranId}</p>
      <Link
        to="/"
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Go Home
      </Link>
    </div>
  );
};

export default PaymentCancel;
