import React, { useState, useEffect } from "react";
import { Search, DollarSign, Calendar, Eye, X, Download, TrendingUp, ShoppingCart, Package, Award } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const MyProductsEarnings = () => {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    completedPayout: 0,
    totalSold: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosSecure = useAxiosSecure();

  // Fetch earnings data from backend
  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get("/payments/seller/earnings", {
          params: {
            startDate: dateRange.from,
            endDate: dateRange.to
          }
        });
        
        if (response.data.success) {
          // Transform the data to match the existing structure
          const transformedProducts = response.data.data.products.map((product, index) => ({
            id: product.productId || index + 1,
            name: product.productName,
            sold: product.totalSold,
            earnings: product.totalEarnings,
            status: product.status,
            date: product.transactions.length > 0 
              ? new Date(product.transactions[0].createdAt).toISOString().split('T')[0] 
              : new Date().toISOString().split('T')[0]
          }));
          
          setProducts(transformedProducts);
          // Remove pendingPayout from summary
          const { totalSales, completedPayout, totalSold } = response.data.data.summary;
          setSummary({ totalSales, completedPayout, totalSold });
          setError(null);
        } else {
          setError("Failed to fetch earnings data");
        }
      } catch (err) {
        console.error("Error fetching earnings data:", err);
        setError("Failed to load earnings data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, [dateRange, axiosSecure]);

  // 🔍 Filter logic
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const inDateRange =
      (!dateRange.from || new Date(p.date) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(p.date) <= new Date(dateRange.to));
    return matchesSearch && inDateRange;
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Product Name', 'Units Sold', 'Earnings', 'Status', 'Date'];
    const rows = filtered.map(product => [
      product.name,
      product.sold,
      formatCurrency(product.earnings),
      product.status,
      formatDate(product.date)
    ].join(','));
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'earnings-report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-5 md:p-8 space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Product Earnings</h1>
          <p className="text-gray-600 mt-2">Track and analyze your product performance</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl px-5 py-3 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
        >
          <Download className="w-5 h-5" />
          <span className="hidden sm:inline">Export Report</span>
        </button>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <X className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Earnings Summary */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {formatCurrency(summary.totalSales)}
                  </p>
                </div>
                <div className="p-3.5 bg-blue-500/10 rounded-xl">
                  <DollarSign className="text-blue-600 w-7 h-7" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Completed Payout
                  </p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {formatCurrency(summary.completedPayout)}
                  </p>
                </div>
                <div className="p-3.5 bg-green-500/10 rounded-xl">
                  <Award className="text-green-600 w-7 h-7" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Total Units Sold
                  </p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">
                    {summary.totalSold.toLocaleString()}
                  </p>
                </div>
                <div className="p-3.5 bg-purple-500/10 rounded-xl">
                  <ShoppingCart className="text-purple-600 w-7 h-7" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 shadow-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div className="relative">
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, from: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none shadow-sm"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none shadow-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setDateRange({ from: "", to: "" })}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg px-3.5 py-2.5 transition-all duration-200 font-medium"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Earnings Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Sold</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Earnings</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50 transition-all duration-150">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{p.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                          {p.sold.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-green-600">{formatCurrency(p.earnings)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 inline-flex text-sm leading-5 font-bold rounded-full ${
                            p.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {formatDate(p.date)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="p-4 bg-gray-100 rounded-full mb-4">
                            <Package className="h-10 w-10 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                          <p className="text-gray-600 max-w-md">
                            {search || dateRange.from || dateRange.to
                              ? "No products match your search criteria."
                              : "You don't have any product earnings yet."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <h4 className="font-bold text-gray-900 text-lg mb-4">{selectedProduct.name}</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Units Sold
                      </span>
                      <span className="font-bold text-lg">{selectedProduct.sold.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Total Earnings
                      </span>
                      <span className="font-bold text-lg text-green-600">{formatCurrency(selectedProduct.earnings)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Status
                      </span>
                      <span
                        className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                          selectedProduct.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedProduct.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </span>
                      <span className="font-medium">{formatDate(selectedProduct.date)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                  <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Payout Breakdown
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Gross Earnings</span>
                      <span className="font-medium">{formatCurrency(selectedProduct.earnings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Platform Fee (10%)</span>
                      <span className="font-medium text-red-600">-{formatCurrency(selectedProduct.earnings * 0.1)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="text-gray-900 font-bold">Net Payout</span>
                      <span className="font-bold text-green-600 text-lg">{formatCurrency(selectedProduct.earnings * 0.9)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-5 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsEarnings;