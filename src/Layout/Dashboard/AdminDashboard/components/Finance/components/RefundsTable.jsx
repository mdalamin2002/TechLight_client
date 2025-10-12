import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";
import { CheckCircle, Clock, X, Check, Download, Search, Filter } from "lucide-react";
import { CSVLink } from "react-csv";

const RefundsTable = () => {
  const [refunds, setRefunds] = useState([
    { id: "RF-001", orderId: "ORD-002", user: "Jane Smith", email: "jane@example.com", amount: "$129", reason: "Defective Item", status: "Pending", date: "2024-01-15" },
    { id: "RF-002", orderId: "ORD-005", user: "David Brown", email: "david@example.com", amount: "$299", reason: "Not Delivered", status: "Approved", date: "2024-01-16" },
    { id: "RF-003", orderId: "ORD-007", user: "Mike Johnson", email: "mike@example.com", amount: "$89", reason: "Wrong Item", status: "Rejected", date: "2024-01-17" },
    { id: "RF-004", orderId: "ORD-009", user: "Alice Green", email: "alice@example.com", amount: "$199", reason: "Size Issue", status: "Pending", date: "2024-01-18" },
    { id: "RF-005", orderId: "ORD-011", user: "Bob White", email: "bob@example.com", amount: "$449", reason: "Changed Mind", status: "Approved", date: "2024-01-19" },
    { id: "RF-006", orderId: "ORD-013", user: "Carol Davis", email: "carol@example.com", amount: "$79", reason: "Damaged in Transit", status: "Pending", date: "2024-01-20" },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");

  // Get unique statuses for filter
  const statuses = useMemo(() => {
    const statusList = [...new Set(refunds.map(r => r.status))];
    return ["All Status", ...statusList];
  }, [refunds]);

  // Filter refunds based on search and status
  const filteredRefunds = useMemo(() => {
    return refunds.filter(rf => {
      const matchesSearch =
        rf.id.toLowerCase().includes(search.toLowerCase()) ||
        rf.orderId.toLowerCase().includes(search.toLowerCase()) ||
        rf.user.toLowerCase().includes(search.toLowerCase()) ||
        rf.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = filterStatus === "All Status" || rf.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [refunds, search, filterStatus]);

  // SweetAlert confirmation
  const handleAction = (rf, newStatus) => {
    Swal.fire({
      title: `Change Status to "${newStatus}"?`,
      html: `
        <div class="text-left">
          <table style="text-align:left; width:100%; font-size:14px; line-height:1.5">
            <tr><td style="padding: 4px;"><b>Refund ID:</b></td><td style="padding: 4px;">${rf.id}</td></tr>
            <tr><td style="padding: 4px;"><b>Order ID:</b></td><td style="padding: 4px;">${rf.orderId}</td></tr>
            <tr><td style="padding: 4px;"><b>User:</b></td><td style="padding: 4px;">${rf.user}</td></tr>
            <tr><td style="padding: 4px;"><b>Email:</b></td><td style="padding: 4px;">${rf.email}</td></tr>
            <tr><td style="padding: 4px;"><b>Amount:</b></td><td style="padding: 4px;">${rf.amount}</td></tr>
            <tr><td style="padding: 4px;"><b>Reason:</b></td><td style="padding: 4px;">${rf.reason}</td></tr>
            <tr><td style="padding: 4px;"><b>Current Status:</b></td><td style="padding: 4px;">${rf.status}</td></tr>
          </table>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#5061fc",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, set to "${newStatus}"`,
      customClass: {
        popup: 'rounded-xl',
        header: 'rounded-t-xl',
      }
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
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-xl',
          }
        });
      }
    });
  };

  const renderActions = (rf) => {
    switch (rf.status) {
      case "Pending":
        return (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleAction(rf, "Approved")}
              className="p-1.5 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
              title="Approve"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
            <button
              onClick={() => handleAction(rf, "Rejected")}
              className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
              title="Reject"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        );
      case "Approved":
        return (
          <div className="flex justify-end">
            <CheckCircle className="w-5 h-5 text-green-500" title="Approved" />
          </div>
        );
      case "Rejected":
        return (
          <div className="flex justify-end">
            <X className="w-5 h-5 text-red-500" title="Rejected" />
          </div>
        );
      default:
        return (
          <div className="flex justify-end">
            <Clock className="w-5 h-5 text-amber-500" title="Unknown Status" />
          </div>
        );
    }
  };

  return (
    <div>
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search refunds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
          />
        </div>

        {/* Filters and Export */}
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter size={16} />
            <span>Filter:</span>
          </div>

          <select
            className="px-4 py-2.5 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <CSVLink
            data={filteredRefunds}
            filename={"refunds-report.csv"}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <Download size={16} /> Export
          </CSVLink>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredRefunds.length} of {refunds.length} refunds
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border-0 shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-4 py-4 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Refund ID</span>
              </th>
              <th className="px-4 py-4 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order ID</span>
              </th>
              <th className="px-4 py-4 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</span>
              </th>
              <th className="px-4 py-4 text-left hidden md:table-cell">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</span>
              </th>
              <th className="px-4 py-4 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</span>
              </th>
              <th className="px-4 py-4 text-left hidden md:table-cell">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reason</span>
              </th>
              <th className="px-4 py-4 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
              </th>
              <th className="px-4 py-4 text-left hidden md:table-cell">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</span>
              </th>
              <th className="px-4 py-4 text-right">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filteredRefunds.map((rf, i) => (
              <tr
                key={i}
                className="hover:bg-muted/20 transition-colors duration-150"
              >
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-primary">{rf.id}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-primary">{rf.orderId}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {rf.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-foreground">{rf.user}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">{rf.email}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-semibold text-foreground">{rf.amount}</span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground max-w-xs truncate" title={rf.reason}>
                    {rf.reason}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    rf.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : rf.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                      rf.status === "Approved"
                        ? "bg-green-500"
                        : rf.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-amber-500"
                    }`}></span>
                    {rf.status}
                  </span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">{rf.date}</span>
                </td>
                <td className="px-4 py-4">
                  {renderActions(rf)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefundsTable;
