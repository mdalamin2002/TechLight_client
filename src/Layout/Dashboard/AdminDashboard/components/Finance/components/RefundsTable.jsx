import React, { useState } from "react";
import Swal from "sweetalert2";
import { CheckCircle, Clock, X, Check, Download } from "lucide-react";
import { CSVLink } from "react-csv";

const RefundsTable = () => {
  const [refunds, setRefunds] = useState([
    { id: "RF-001", orderId: "ORD-002", user: "Jane Smith", amount: "$129", reason: "Defective Item", status: "Pending" },
    { id: "RF-002", orderId: "ORD-005", user: "David Brown", amount: "$299", reason: "Not Delivered", status: "Approved" },
    { id: "RF-003", orderId: "ORD-007", user: "Mike Johnson", amount: "$89", reason: "Wrong Item", status: "Rejected" },
  ]);

  //  SweetAlert confirmation
  const handleAction = (rf, newStatus) => {
    Swal.fire({
      title: `Change Status to "${newStatus}"?`,
      html: `
        <table style="text-align:left; width:100%; font-size:14px; line-height:1.5">
          <tr><td><b>Refund ID:</b></td><td>${rf.id}</td></tr>
          <tr><td><b>Order ID:</b></td><td>${rf.orderId}</td></tr>
          <tr><td><b>User:</b></td><td>${rf.user}</td></tr>
          <tr><td><b>Amount:</b></td><td>${rf.amount}</td></tr>
          <tr><td><b>Reason:</b></td><td>${rf.reason}</td></tr>
          <tr><td><b>Current Status:</b></td><td>${rf.status}</td></tr>
        </table>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, set to "${newStatus}"`,
    }).then((result) => {
      if(result.isConfirmed){
        setRefunds(prevRefunds =>
          prevRefunds.map(r => r.id === rf.id ? { ...r, status: newStatus } : r)
        );
        Swal.fire({
          title: "Updated!",
          text: `Refund status changed to "${newStatus}".`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const renderActions = (rf) => {
    switch (rf.status) {
      case "Pending":
        return (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => handleAction(rf, "Approved")}
              className="p-1 rounded bg-green-600/20 hover:bg-green-600/30 transition"
            >
              <Check className="w-4 h-4 text-green-400" />
            </button>
            <button
              onClick={() => handleAction(rf, "Rejected")}
              className="p-1 rounded bg-red-600/20 hover:bg-red-600/30 transition"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        );
      case "Approved":
        return (
          <div className="flex justify-end">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        );
      case "Rejected":
        return (
          <div className="flex justify-end">
            <X className="w-5 h-5 text-red-500" />
          </div>
        );
      default:
        return (
          <div className="flex justify-end">
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
        );
    }
  };

  return (
    <div className="rounded-2xl">
      {/* Export Button */}
      <div className="flex md:flex-row justify-end mb-4">
        <CSVLink
          data={refunds}
          filename={"refunds-report.csv"}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <Download size={16} /> Export
        </CSVLink>
      </div>

      {/* Refund Table */}
      <div className="overflow-x-auto rounded-xl border ">
        <table className="min-w-full border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-left">Refund ID</th>
              <th className="px-4 py-3 text-sm font-semibold text-left">Order ID</th>
              <th className="px-4 py-3 text-sm font-semibold text-left">User</th>
              <th className="px-4 py-3 text-sm font-semibold text-left">Amount</th>
              <th className="px-4 py-3 text-sm font-semibold text-left">Reason</th>
              <th className="px-4 py-3 text-sm font-semibold text-left">Status</th>
              <th className="px-4 py-3 text-sm font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {refunds.map((rf, i) => (
              <tr
                key={i}
                className={`${i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"} hover:bg-indigo-100/70 transition-colors`}
              >
                <td className="px-4 py-3 text-purple-600 font-medium">{rf.id}</td>
                <td className="px-4 py-3 text-purple-500 font-medium">{rf.orderId}</td>
                <td className="px-4 py-3 font-medium">{rf.user}</td>
                <td className="px-4 py-3 font-medium">{rf.amount}</td>
                <td className="py-3 px-4">{rf.reason}</td>
                <td className="py-3 px-4">
                  <span
                    className={`text-sm font-medium ${
                      rf.status === "Approved"
                        ? "text-green-600"
                        : rf.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {rf.status}
                  </span>
                </td>
                <td className="py-3 px-4">{renderActions(rf)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefundsTable;
