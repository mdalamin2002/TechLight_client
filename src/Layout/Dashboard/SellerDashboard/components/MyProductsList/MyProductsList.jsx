import React, { useState, useEffect } from "react";
import { Search, PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import useAxiosSecure from "@/utils/useAxiosSecure";

const MyProductsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const axiosSecure = useAxiosSecure();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosSecure.get(`/products/seller`, {
          params: {
            page: page,
            limit: 10,
            search: searchTerm,
            status: statusFilter === "All" ? "" : statusFilter
          }
        });
        
        setProducts(response.data.data || []);
        setTotalPages(Math.ceil(response.data.total / response.data.limit));
      } catch (err) {
        setError("Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, searchTerm, statusFilter, axiosSecure]);

  const handleDeleteProduct = async (productId) => {
    // Implement delete functionality
    console.log("Delete product:", productId);
  };

  // Filter products based on search term and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">My Products List</h1>
          <p className="text-gray-500">Manage, edit, or remove your products easily.</p>
        </div>
        <Link to="/dashboard/addProduct" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
          <PlusCircle className="w-5 h-5" /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search product..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img 
                        src={product.images?.main || product.image || "https://placehold.co/100x100"} 
                        alt={product.name} 
                        className="w-12 h-12 rounded-lg object-cover" 
                        onError={(e) => {
                          e.target.src = "https://placehold.co/100x100";
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-gray-500 text-xs line-clamp-1">{product.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">${product.price}</td>
                    <td className="px-6 py-4">{product.stock || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === "approved" ? "bg-green-100 text-green-700" :
                        product.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        product.status === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center gap-3">
                      <Eye 
                        className="w-5 h-5 text-gray-600 hover:text-gray-800 transition cursor-pointer" 
                        onClick={() => setSelectedProduct(product)} 
                        title="View Details"
                      />
                      <Link to={`/dashboard/seller-product-edit/${product._id}`}>
                        <Edit 
                          className="w-5 h-5 text-blue-600 hover:text-blue-800 transition cursor-pointer" 
                          title="Edit"
                        />
                      </Link>
                      <Trash2 
                        className="w-5 h-5 text-red-600 hover:text-red-800 transition cursor-pointer" 
                        onClick={() => handleDeleteProduct(product._id)} 
                        title="Delete"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && products.length > 0 && (
        <div className="flex justify-between items-center">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg ${page === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Next
          </button>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-xl"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>
            <img 
              src={selectedProduct.images?.main || selectedProduct.image || "https://placehold.co/200x200"} 
              alt={selectedProduct.name} 
              className="w-32 h-32 rounded-lg object-cover mx-auto mb-4 shadow-md"
              onError={(e) => {
                e.target.src = "https://placehold.co/200x200";
              }}
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">{selectedProduct.name}</h2>
            <p className="text-gray-500 mb-1 text-center">{selectedProduct.category}</p>
            <p className="text-gray-800 font-bold mb-1 text-center">${selectedProduct.price}</p>
            <p className="text-gray-600 mb-1 text-center">Stock: {selectedProduct.stock || 0}</p>
            <p className="text-gray-600 text-center">{selectedProduct.description}</p>
            <div className="mt-4">
              <p className="text-gray-700">
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  selectedProduct.status === "approved" ? "bg-green-100 text-green-700" :
                  selectedProduct.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  selectedProduct.status === "rejected" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {selectedProduct.status.charAt(0).toUpperCase() + selectedProduct.status.slice(1)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsList;