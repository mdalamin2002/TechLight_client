import React, { useEffect, useState } from "react";
import { Search, Plus, Check, X, Download } from "lucide-react";
import { CSVLink } from "react-csv";
import Filter from "./Products/Filter";
import Searching from "./Products/Searching";
import FilledButton from "@/Components/Shared/Buttots/FilledButton";
import AddProduct from "./Products/AddProduct";
import ProductActions from "./Products/ProductActions";
import useAxiosSecure from "@/utils/useAxiosSecure";
import DashboardTableLoading from "@/Components/Shared/Loading/DashboardTableLoading";

const Products = () => {
  const [addProduct, setAddProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  //Fetching product data from database
  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get(`${selectCategory ? `/products/${selectCategory}` : "/products"}`)
      .then((res) => setProducts(res.data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [selectCategory, axiosSecure]);

  console.log(loading);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosSecure.get("/categories");
        setCategory(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [axiosSecure]);

  return (
    <>
      <div>
        {addProduct ? (
          <AddProduct></AddProduct>
        ) : (
          <div className="min-h-screen text-foreground p-6 transition-colors duration-300">
            <div className="">
              <h2 className="text-3xl font-bold text-foreground">Product Management</h2>
              <div className="flex gap-4 my-4">
                <Filter category={category} setSelectCategory={setSelectCategory}></Filter>
              </div>
            </div>
            <div className="flex gap-4 justify-between mb-3">
              <Searching></Searching>
              <div className="flex justify-center items-center gap-7">
                <FilledButton onClick={() => setAddProduct(true)}>Add Product</FilledButton>
                <FilledButton>
                  <CSVLink data={products} filename={"products-report.csv"} className="flex items-center gap-2">
                    <Download size={16} /> Export
                  </CSVLink>
                </FilledButton>
              </div>
            </div>

            {/* Products Table */}
            {loading ? (
              <DashboardTableLoading></DashboardTableLoading>
            ) : (
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
                        } hover:bg-indigo-100/70 transition-colors`}>
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3 font-medium">{p.category}</td>
                        <td className="px-4 py-3">{p.price}</td>
                        <td className="px-4 py-3 font-medium">{p.stock}</td>
                        <td className={`px-4 py-3 font-medium`}>
                          {p.discount ? <span>{p.discount}%</span> : <span>N/A</span>}
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
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
