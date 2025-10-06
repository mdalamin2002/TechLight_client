import React, { useState } from "react";
import { Search, Plus, Check, X, Download } from "lucide-react";
import { CSVLink } from "react-csv";
import Filter from "./Products/Filter";
import Searching from "./Products/Searching";
import FilledButton from "@/Components/Shared/Buttots/FilledButton";
import AddProduct from "./Products/AddProduct";
import ProductActions from "./Products/ProductActions";

const Products = () => {
  const [addProduct, setAddProduct] = useState(false);
  const [products, setProducts] = useState([
    {
      name: "iPhone 15 Pro",
      category: "Electronics",
      price: 999,
      stock: 50,
      seller: "Tech Store Pro",
      status: "Approved",
      discount_price: 780,
      discount:20,
    },
    { name: "Nike Air Max", category: "Fashion", price: 129, stock: 25, seller: "Fashion Hub", status: "Pending" },
    {
      name: "MacBook Pro",
      category: "Electronics",
      price: 1999,
      stock: 15,
      seller: "Electronics World",
      status: "Approved",
    },
    { name: "Coffee Maker", category: "Home", price: 89, stock: 0, seller: "Home & Garden", status: "Rejected" },
    { name: "Gaming Chair", category: "Furniture", price: 299, stock: 8, seller: "Sports Central", status: "Pending" },
    {
      name: "iPhone 15 Pro",
      category: "Electronics",
      price: 999,
      stock: 50,
      seller: "Tech Store Pro",
      status: "In stock",
    },
    { name: "Nike Air Max", category: "Fashion", price: 129, stock: 25, seller: "Fashion Hub", status: "Pending" },
    {
      name: "MacBook Pro",
      category: "Electronics",
      price: 1999,
      stock: 15,
      seller: "Electronics World",
      status: "Out of stock",
    },
    { name: "Coffee Maker", category: "Home", price: 89, stock: 0, seller: "Home & Garden", status: "Rejected" },
    { name: "Gaming Chair", category: "Furniture", price: 299, stock: 8, seller: "Sports Central", status: "Pending" },
    {
      name: "iPhone 15 Pro",
      category: "Electronics",
      price: 999,
      stock: 50,
      seller: "Tech Store Pro",
      status: "Approved",
    },
    { name: "Nike Air Max", category: "Fashion", price: 129, stock: 25, seller: "Fashion Hub", status: "Pending" },
    {
      name: "MacBook Pro",
      category: "Electronics",
      price: 1999,
      stock: 15,
      seller: "Electronics World",
      status: "Approved",
    },
    { name: "Coffee Maker", category: "Home", price: 89, stock: 0, seller: "Home & Garden", status: "Rejected" },
    { name: "Gaming Chair", category: "Furniture", price: 299, stock: 8, seller: "Sports Central", status: "Pending" },
  ]);


  return (<>
    {
      addProduct ? <AddProduct></AddProduct>
        :
    <div className="min-h-screen text-foreground p-6 transition-colors duration-300">
      <div className="">
        <h2 className="text-3xl font-bold text-foreground">Product Management</h2>
        <div className="flex gap-4 my-4">
          <Filter></Filter>
          <Filter></Filter>
          <Filter></Filter>
          <Filter></Filter>
          <Filter></Filter>
        </div>
      </div>
        <div className="flex gap-4 justify-between mb-3">
          <Searching></Searching>
          <div className="flex justify-center items-center gap-7">
            <FilledButton onClick={()=>setAddProduct(true)}>Add Product</FilledButton>
            <FilledButton>
              <CSVLink data={products} filename={"products-report.csv"} className="flex items-center gap-2">
                <Download size={16} /> Export
              </CSVLink>
            </FilledButton>
          </div>
        </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full border-collapse">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-left">Product</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Category</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Price</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Stock</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Discount</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Status</th>
            <th className="px-4 py-3 text-sm font-semibold text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr
              key={i}
              className={`${
                i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"
              } hover:bg-indigo-100/70 transition-colors`}
            >
              <td className="px-4 py-3 text-purple-500 font-medium">{p.name}</td>
              <td className="px-4 py-3 font-medium">{p.category}</td>
              <td className="px-4 py-3">{p.price}</td>
              <td className="px-4 py-3 font-medium">{p.stock}</td>
              <td
                className={`px-4 py-3 font-medium`}
              >
                {p.discount ? <span>{ p.discount}%</span>:<span>N/A</span>}
              </td>
               <td className="px-4 py-3 font-medium">{p.status}</td>
              <td className="px-4 py-3 font-medium">
                <ProductActions></ProductActions>
               </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </div>

    }
  </>
  );
};

export default Products;
