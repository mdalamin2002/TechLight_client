import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, Check, Package, MoreHorizontal } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([
    {
      name: "iPhone 15 Pro",
      category: "Electronics",
      price: 999,
      stock: 50,
      seller: "Tech Store Pro",
      status: "Approved",
    },
    {
      name: "Nike Air Max",
      category: "Fashion",
      price: 129,
      stock: 25,
      seller: "Fashion Hub",
      status: "Pending",
    },
    {
      name: "MacBook Pro",
      category: "Electronics",
      price: 1999,
      stock: 15,
      seller: "Electronics World",
      status: "Approved",
    },
    {
      name: "Coffee Maker",
      category: "Home",
      price: 89,
      stock: 0,
      seller: "Home & Garden",
      status: "Rejected",
    },
    {
      name: "Gaming Chair",
      category: "Furniture",
      price: 299,
      stock: 8,
      seller: "Sports Central",
      status: "Pending",
    },
  ]);

  // Approve product
  const handleApprove = (index) => {
    const updated = [...products];
    updated[index].status = "Approved";
    setProducts(updated);
  };

  // Delete product
  const handleDelete = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  return (
    <div className="min-h-screen bg-background p-1">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
          <p className="text-sm text-gray-500">Manage your product catalog and inventory.</p>
        </div>
        <button className="flex items-center bg-gradient-to-r from-pink-200 to-purple-300  px-4 py-2 rounded-lg text-sm cursor-pointer shadow">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex items-center  rounded-lg px-3 w-full md:w-1/2">
          <Search className=" w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full "
          />
        </div>
        <select className="px-3 py-2 rounded-lg text-sm outline-none w-full md:w-auto ">
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Home</option>
          <option>Furniture</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-black/10">
            <tr>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Seller</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border-b transition hover:bg-black/5">
                <td className="py-3 px-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-pink-400" />
                  {p.name}
                </td>
                <td className="py-3 px-4">{p.category}</td>
                <td className="py-3 px-4 font-bold">${p.price}</td>
                <td
                  className={`py-3 px-4 font-medium ${
                    p.stock > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {p.stock}
                </td>
                <td className="py-3 px-4">{p.seller}</td>
                <td>
                  <span
                    className={`font-medium ${
                      p.status === "Approved"
                        ? "text-green-400"
                        : p.status === "Pending"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex items-center gap-3">
                  <Edit className="w-4 h-4 text-purple-400 cursor-pointer" />
                  <Trash2
                    onClick={() => handleDelete(i)}
                    className="w-4 h-4 text-red-500 cursor-pointer"
                  />
                  {p.status === "Pending" && (
                    <Check
                      onClick={() => handleApprove(i)}
                      className="w-4 h-4 text-green-400 cursor-pointer"
                    />
                  )}
                  <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
