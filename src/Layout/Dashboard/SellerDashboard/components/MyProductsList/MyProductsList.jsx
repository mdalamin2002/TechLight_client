import React, { useState } from "react";
import { Search, PlusCircle, Edit, Trash2, Eye } from "lucide-react";

const MyProductsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  

  const products = [
    { id: 1, name: "Galaxy Watch 5", category: "Smart Watch", price: "$249", stock: 32, status: "Active", image: "https://i.ibb.co.com/9MYzrSp/Samsung-Galaxy-Watch-4-Pink-Gold-1.webp", description: "Latest Samsung smartwatch with health tracking." },
    { id: 2, name: "Apple AirPods Pro", category: "Headphones", price: "$199", stock: 12, status: "Active", image: "https://i.ibb.co.com/bMJ2ywbf/Apple-Air-Pods-Pro-2nd-gen-hero-220907-big-jpg-large.jpg", description: "Noise-cancelling wireless earbuds by Apple." },
    { id: 3, name: "Logitech MX Master 3", category: "Accessories", price: "$99", stock: 0, status: "Out of Stock", image: "https://i.ibb.co.com/mV6jz31J/Logitech-MX-Master-3-Advanced-Wireless-7-Button-Mouse-3-1.webp", description: "Ergonomic wireless mouse with advanced features." },
    { id: 4, name: "Sony WH-1000XM5", category: "Headphones", price: "$349", stock: 15, status: "Active", image: "https://i.ibb.co.com/x8CcCMGB/images.jpg", description: "Premium noise-cancelling over-ear headphones." },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" ? true : product.status === statusFilter;
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
        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
          <PlusCircle className="w-5 h-5" /> Add Product
        </button>
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
          <option value="Active">Active</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
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
                <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-gray-500 text-xs">{product.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>{product.status}</span>
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-3">
                    <Eye className="w-5 h-5 text-gray-600 hover:text-gray-800 transition" onClick={() => setSelectedProduct(product)} title="View Details"/>
                    <Edit className="w-5 h-5 text-blue-600 hover:text-blue-800 transition" title="Edit"/>
                    <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800 transition" title="Delete"/>
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
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-32 h-32 rounded-lg object-cover mx-auto mb-4 shadow-md"/>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">{selectedProduct.name}</h2>
            <p className="text-gray-500 mb-1 text-center">{selectedProduct.category}</p>
            <p className="text-gray-800 font-bold mb-1 text-center">{selectedProduct.price}</p>
            <p className="text-gray-600 mb-1 text-center">Stock: {selectedProduct.stock}</p>
            <p className="text-gray-600 text-center">{selectedProduct.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsList;
