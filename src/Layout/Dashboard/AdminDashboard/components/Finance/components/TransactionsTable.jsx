import { Download, Search, Filter } from "lucide-react";
import React, { useState, useMemo } from "react";
import { CSVLink } from "react-csv";

const TransactionsTable = () => {
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("All Methods");

  const transactions = [
    { id: "TXN-001", user: "John Doe", email: "john@example.com", amount: "$1049", method: "Credit Card", date: "2024-01-15", status: "Completed" },
    { id: "TXN-002", user: "Jane Smith", email: "jane@example.com", amount: "$129", method: "PayPal", date: "2024-01-16", status: "Completed" },
    { id: "TXN-003", user: "Tech Store Pro", email: "techstore@example.com", amount: "$500", method: "Bank Transfer", date: "2024-01-17", status: "Pending" },
    { id: "TXN-004", user: "Alice Green", email: "alice@example.com", amount: "$799", method: "Credit Card", date: "2024-01-18", status: "Completed" },
    { id: "TXN-005", user: "Bob White", email: "bob@example.com", amount: "$199", method: "PayPal", date: "2024-01-19", status: "Failed" },
    { id: "TXN-006", user: "Carol Davis", email: "carol@example.com", amount: "$299", method: "Credit Card", date: "2024-01-20", status: "Completed" },
    { id: "TXN-007", user: "David Brown", email: "david@example.com", amount: "$89", method: "Bank Transfer", date: "2024-01-21", status: "Completed" },
    { id: "TXN-008", user: "Eva Martinez", email: "eva@example.com", amount: "$449", method: "PayPal", date: "2024-01-22", status: "Pending" },
    { id: "TXN-009", user: "Frank Wilson", email: "frank@example.com", amount: "$1199", method: "Credit Card", date: "2024-01-23", status: "Completed" },
  ];

  // Get unique payment methods for filter
  const paymentMethods = useMemo(() => {
    const methods = [...new Set(transactions.map(t => t.method))];
    return ["All Methods", ...methods];
  }, [transactions]);

  // Filter transactions based on search and method
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch =
        txn.id.toLowerCase().includes(search.toLowerCase()) ||
        txn.user.toLowerCase().includes(search.toLowerCase()) ||
        txn.email.toLowerCase().includes(search.toLowerCase());

      const matchesMethod = filterMethod === "All Methods" || txn.method === filterMethod;

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
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>

          <CSVLink
            data={filteredTransactions}
            filename={"transactions-report.csv"}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <Download size={16} /> Export
          </CSVLink>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border-0 shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-4 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transaction ID</span>
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
              <th className="px-4 py-4 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Method</span>
              </th>
              <th className="px-4 py-4 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
              </th>
              <th className="px-4 py-4 text-left">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {filteredTransactions.map((txn, i) => (
              <tr
                key={i}
                className="hover:bg-muted/20 transition-colors duration-150"
              >
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-primary">{txn.id}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {txn.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-foreground">{txn.user}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">{txn.email}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-semibold text-foreground">{txn.amount}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-muted-foreground">{txn.method}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    txn.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : txn.status === "Pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                      txn.status === "Completed"
                        ? "bg-green-500"
                        : txn.status === "Pending"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}></span>
                    {txn.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-muted-foreground">{txn.date}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
