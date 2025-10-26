import React, { useState, useMemo, useEffect } from "react";
import Swal from "sweetalert2";
import { CheckCircle, Clock, X, Check, Download, Search, Filter } from "lucide-react";
import { CSVLink } from "react-csv";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { toast } from "react-hot-toast";

const RefundsTable = () => {
  const [refunds, setRefunds] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchRefunds();
  }, [pagination.currentPage, filterStatus]);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const statusParam = filterStatus === "All Status" ? "all" : filterStatus;
      const response = await axiosSecure.get('/returns', {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
          status: statusParam,
        },
      });

      if (response.data.success) {
        setRefunds(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching refunds:', error);
      toast.error('Failed to load refunds');
    } finally {
      setLoading(false);
    }
  };

  // Filter refunds based on search
  const filteredRefunds = useMemo(() => {
    return refunds.filter(rf => {
      const matchesSearch =
        rf._id?.toLowerCase().includes(search.toLowerCase()) ||
        rf.orderId?.toLowerCase().includes(search.toLowerCase()) ||
        rf.userName?.toLowerCase().includes(search.toLowerCase()) ||
        rf.userEmail?.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [refunds, search]);

  // SweetAlert confirmation for status change
  const handleAction = async (rf, newStatus) => {
    Swal.fire({
      title: `Change Status to "${newStatus}"?`,
      html: `
        <div class="text-left">
          <table style="text-align:left; width:100%; font-size:14px; line-height:1.5">
            <tr><td style="padding: 4px;"><b>Refund ID:</b></td><td style="padding: 4px;">${rf._id || 'N/A'}</td></tr>
            <tr><td style="padding: 4px;"><b>Order ID:</b></td><td style="padding: 4px;">${rf.orderId || 'N/A'}</td></tr>
            <tr><td style="padding: 4px;"><b>User:</b></td><td style="padding: 4px;">${rf.userName || 'N/A'}</td></tr>
            <tr><td style="padding: 4px;"><b>Email:</b></td><td style="padding: 4px;">${rf.userEmail || 'N/A'}</td></tr>
            <tr><td style="padding: 4px;"><b>Amount:</b></td><td style="padding: 4px;">৳${rf.amount || '0'}</td></tr>
            <tr><td style="padding: 4px;"><b>Reason:</b></td><td style="padding: 4px;">${rf.reason || 'N/A'}</td></tr>
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
    }).then(async (result) => {
      if(result.isConfirmed){
        try {
          await axiosSecure.put(`/returns/${rf._id}`, { status: newStatus });
          
          setRefunds(prevRefunds =>
            prevRefunds.map(r => r._id === rf._id ? { ...r, status: newStatus } : r)
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
          
          // Refresh data
          fetchRefunds();
        } catch (error) {
          console.error('Error updating refund:', error);
          toast.error('Failed to update refund status');
        }
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
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPagination(prev => ({ ...prev, currentPage: 1 }));
            }}
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <CSVLink
            data={filteredRefunds.map(rf => ({
              refund_id: rf._id,
              order_id: rf.orderId,
              user: rf.userName,
              email: rf.userEmail,
              amount: rf.amount,
              reason: rf.reason,
              status: rf.status,
              date: new Date(rf.createdAt).toLocaleDateString(),
            }))}
            filename={"refunds-report.csv"}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <Download size={16} /> Export
          </CSVLink>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredRefunds.length} of {pagination.totalCount} refunds
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border-0 shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredRefunds.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No refunds found
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-600 text-white">
                <th className="px-4 py-4 text-left">
                  <span className="text-left text-xs md:text-sm font-bold uppercase tracking-wider">Refund ID</span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-left text-xs md:text-sm font-bold uppercase tracking-wider">Order ID</span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-left text-xs md:text-sm font-bold uppercase tracking-wider">User</span>
                </th>
                <th className="px-4 py-4 text-left hidden md:table-cell">
                  <span className="text-left text-xs md:text-sm font-bold uppercase tracking-wider">Email</span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-left text-xs md:text-sm font-bold uppercase tracking-wider">Amount</span>
                </th>
                <th className="px-4 py-4 text-left hidden md:table-cell">
                  <span className="text-left text-xs md:text-sm font-bold uppercase tracking-wider">Reason</span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-left text-xs md:text-sm font-bold uppercase tracking-wider">Status</span>
                </th>
                <th className="px-4 py-4 text-left hidden md:table-cell">
                  <span className="text-left text-xs md:text-sm font-bold uppercase tracking-wider">Date</span>
                </th>
                <th className="px-4 py-4 text-right">
                  <span className="text-left text-xs md:text-sm font-bold uppercase tracking-wider">Actions</span>
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
                    <span className="text-sm font-medium text-primary">{rf._id?.slice(-8).toUpperCase() || 'N/A'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-primary">{rf.orderId || 'N/A'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {rf.userName?.split(' ').map(n => n[0]).join('') || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-foreground">{rf.userName || 'Unknown'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{rf.userEmail || 'N/A'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-foreground">৳{rf.amount?.toLocaleString() || '0'}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground max-w-xs truncate" title={rf.reason}>
                      {rf.reason || 'N/A'}
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
                    <span className="text-sm text-muted-foreground">
                      {rf.createdAt ? new Date(rf.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {renderActions(rf)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 border border-border rounded-lg bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RefundsTable;
