// src/pages/PaymentFail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";

const PaymentFail = () => {
  const { tranId } = useParams();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed!</h1>
      <p className="text-gray-600 mb-4">Transaction ID: {tranId}</p>
      <Link
        to="/"
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Try Again
      </Link>
    </div>
  );
};

export default PaymentFail;
