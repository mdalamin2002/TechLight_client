import React from "react";
import { Search, Download, Filter } from "lucide-react";
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
    <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search orders by ID or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter size={16} />
          <span>Filters:</span>
        </div>

        <select
          className="px-4 py-2.5 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
          value={selectedPayment}
          onChange={(e) => setSelectedPayment(e.target.value)}
        >
          {paymentStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          className="px-4 py-2.5 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
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
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        >
          <Download size={16} /> Export
        </CSVLink>
      </div>
    </div>
  );
};

export default OrderFilters;
