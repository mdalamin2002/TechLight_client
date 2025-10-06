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

      {/* Products Table */}
      <div className="text-card-foreground mt-10">
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
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-muted/60">
              <tr className="text-left">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Stock</th>
                <th className="py-3 px-4 font-semibold">Discount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr
                  key={i}
                  className={`border-t border-border hover:bg-muted/30 transition-colors ${
                    i % 2 === 0 ? "bg-background/50" : "bg-card/80"
                  }`}>
                  <td className="px-4 py-3 font-medium text-primary">{p.name}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">
                    {
                      p.discount_price ?<>
                      <span className="line-through font-normal text-sm text-red-400">{p.price}</span> <br />
                        <span>{ p.discount_price}</span>
                      </> : <span>{ p.price}</span>
                    }
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    {p.discount ? <span>{p.discount }%</span>: <span>N/A</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                        p.status === "In stock"
                          ? "bg-green-500/10 text-green-500 border border-green-500/30"
                          : p.status === "Out of stock"
                          ? "bg-red-500/10 text-red-500 border border-red-500/30"
                          : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30"
                      }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ProductActions></ProductActions>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    }
  </>
  );
};

export default Products;
