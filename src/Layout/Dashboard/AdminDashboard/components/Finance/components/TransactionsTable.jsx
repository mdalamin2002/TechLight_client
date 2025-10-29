import { Download, Search, Filter } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { CSVLink } from "react-csv";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { toast } from "react-hot-toast";

const TransactionsTable = () => {
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("All Methods");
  const [filterStatus, setFilterStatus] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchTransactions();
  }, [pagination.currentPage, filterStatus]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/payments/admin/all', {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
          status: filterStatus,
        },
      });

      if (response.data.success) {
        setTransactions(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // Get unique payment methods for filter
  const paymentMethods = useMemo(() => {
    const methods = [...new Set(transactions.map(t => t.payment_method).filter(Boolean))];
    return ["All Methods", ...methods];
  }, [transactions]);

  // Map status to display format
  const getStatusDisplay = (status) => {
    const statusMap = {
      success: "Completed",
      pending: "Pending",
      failed: "Failed",
      cancelled: "Cancelled",
    };
    return statusMap[status] || status;
  };

  // Filter transactions based on search and method
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch =
        txn.tran_id?.toLowerCase().includes(search.toLowerCase()) ||
        txn.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        txn.customer?.email?.toLowerCase().includes(search.toLowerCase());

      const matchesMethod = filterMethod === "All Methods" || txn.payment_method === filterMethod;

      return matchesSearch && matchesMethod;
    });
  }, [transactions, search, filterMethod]);

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
            placeholder="Search transactions..."
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
            <option value="all">All Status</option>
            <option value="success">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="px-4 py-2.5 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>

          <CSVLink
            data={filteredTransactions.map(txn => ({
              transaction_id: txn.tran_id,
              order_id: txn.order_id,
              customer_name: txn.customer?.name,
              customer_email: txn.customer?.email,
              amount: txn.total_amount,
              method: txn.payment_method,
              status: getStatusDisplay(txn.status),
              date: new Date(txn.createdAt).toLocaleDateString(),
            }))}
            filename={"transactions-report.csv"}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <Download size={16} /> Export
          </CSVLink>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredTransactions.length} of {pagination.totalCount} transactions
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border-0 shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No transactions found
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-600 text-white">
                <th className="px-4 py-4 text-left">
                  <span className="text-left text-xs md:text-sm font-bold tracking-wide uppercase">Transaction ID</span>
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
                <th className="px-4 py-4 text-left">
                  <span className="text-left text-xs md:text-sm font-bold uppercase tracking-wider">Method</span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-left text-xs md:text-sm font-bold uppercase tracking-wider">Status</span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-left text-xs md:text-sm font-bold uppercase tracking-wider">Date</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredTransactions.map((txn, i) => {
                const displayStatus = getStatusDisplay(txn.status);
                return (
                  <tr
                    key={i}
                    className="hover:bg-muted/20 transition-colors duration-150"
                  >
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-primary">{txn.tran_id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {txn.customer?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-foreground">{txn.customer?.name || 'Unknown'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{txn.customer?.email || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-foreground">৳{txn.total_amount?.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-muted-foreground">{txn.payment_method || 'SSLCommerz'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        displayStatus === "Completed"
                          ? "bg-green-100 text-green-800"
                          : displayStatus === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                          displayStatus === "Completed"
                            ? "bg-green-500"
                            : displayStatus === "Pending"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}></span>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-muted-foreground">
                        {new Date(txn.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                  </tr>
                );
              })}
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

export default TransactionsTable;
