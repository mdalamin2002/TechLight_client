// src/pages/PaymentSuccess.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const { tranId } = useParams();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-4">Transaction ID: {tranId}</p>
      <Link
        to="/"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Go Home
      </Link>
    </div>
  );
};

export default PaymentSuccess;
