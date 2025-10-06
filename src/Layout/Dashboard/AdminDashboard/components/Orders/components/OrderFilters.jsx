import React from "react";
import { Search, Download } from "lucide-react";
import { CSVLink } from "react-csv";

const OrderFilters = ({
  search,
  setSearch,
  selectedPayment,
  setSelectedPayment,
  selectedDelivery,
  setSelectedDelivery,
  paymentStatuses,
  deliveryStatuses,
  filteredOrders
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-6 gap-3 items-center">
      {/* Search */}
      <div className="relative w-72">
        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="py-2 pl-10 pr-3 bg-white shadow-sm border rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <select
          className="px-3 py-2 rounded-lg text-sm outline-none w-full md:w-auto bg-card shadow"
          value={selectedPayment}
          onChange={(e) => setSelectedPayment(e.target.value)}
        >
          {paymentStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          className="px-3 py-2 rounded-lg text-sm outline-none w-full md:w-auto bg-card shadow"
          value={selectedDelivery}
          onChange={(e) => setSelectedDelivery(e.target.value)}
        >
          {deliveryStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        {/* Export */}
        <CSVLink
          data={filteredOrders}
          filename={"orders-report.csv"}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <Download size={16} /> Export
        </CSVLink>
      </div>
    </div>
  );
};

export default OrderFilters;
