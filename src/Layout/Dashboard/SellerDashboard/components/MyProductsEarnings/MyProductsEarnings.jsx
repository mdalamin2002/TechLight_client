import React, { useState, useEffect } from "react";
import { Search, DollarSign, Calendar, Eye, X } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure"; // Import axios hook

const MyProductsEarnings = () => {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [products, setProducts] = useState([]); // State for products
  const [summary, setSummary] = useState({
    totalSales: 0,
    pendingPayout: 0,
    completedPayout: 0,
    totalSold: 0
  }); // State for summary
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const axiosSecure = useAxiosSecure(); // Use axios hook

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
          setSummary(response.data.data.summary);
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
  }, [dateRange, axiosSecure]); // Re-fetch when date range or axiosSecure changes

  // 🔍 Filter logic
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const inDateRange =
      (!dateRange.from || new Date(p.date) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(p.date) <= new Date(dateRange.to));
    return matchesSearch && inDateRange;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <X className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Earnings Summary */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl text-center">
              <DollarSign className="text-blue-600 mx-auto mb-2" size={28} />
              <h3 className="text-gray-600 text-sm">Total Sales</h3>
              <p className="text-2xl font-semibold text-blue-700">
                ${summary.totalSales.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 p-5 rounded-2xl text-center">
              <DollarSign className="text-green-600 mx-auto mb-2" size={28} />
              <h3 className="text-gray-600 text-sm">Completed Payout</h3>
              <p className="text-2xl font-semibold text-green-700">
                ${summary.completedPayout.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl text-center">
              <Calendar className="text-purple-600 mx-auto mb-2" size={28} />
              <h3 className="text-gray-600 text-sm">Total Products Sold</h3>
              <p className="text-2xl font-semibold text-purple-700">{summary.totalSold}</p>
            </div>
          </div>

          {/*Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 w-full sm:w-1/3">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-2 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/*  Earnings Table */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow p-4 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Sold</th>
                  <th className="py-3 px-4">Earnings</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">
                      <span className="font-medium">{p.name}</span>
                    </td>
                    <td className="py-3 px-4">{p.sold}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">
                      ${p.earnings.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          p.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{p.date}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition mx-auto"
                      >
                        <Eye size={16} /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 🪟 Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative animate-fadeIn">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center space-y-3">
              <h2 className="text-lg font-semibold">
                {selectedProduct.name}
              </h2>
              <div className="w-full text-sm space-y-2">
                <p>
                  <strong>Sold:</strong> {selectedProduct.sold}
                </p>
                <p>
                  <strong>Earnings:</strong> ${selectedProduct.earnings.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {selectedProduct.status}
                </p>
                <p>
                  <strong>Date:</strong> {selectedProduct.date}
                </p>
                <p>
                  <strong>Commission (10%):</strong> $
                  {(selectedProduct.earnings * 0.1).toFixed(2)}
                </p>
                <p>
                  <strong>Net Payout:</strong> $
                  {(selectedProduct.earnings * 0.9).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsEarnings;