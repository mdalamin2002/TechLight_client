import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Download,
  TrendingUp,
  Package,
  ChevronLeft,
  ChevronRight,
  Filter as FilterIcon,
  RefreshCw,
} from "lucide-react";
import { CSVLink } from "react-csv";
import Filter from "./Products/Filter";
import Searching from "./Products/Searching";
import FilledButton from "@/Components/Shared/Buttots/FilledButton";
import ProductActions from "./Products/ProductActions";
import useAxiosSecure from "@/utils/useAxiosSecure";
import DashboardTableLoading from "@/Components/Shared/Loading/DashboardTableLoading";
import { useNavigate } from "react-router";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const axiosSecure = useAxiosSecure();

  // Fetching product data from database
  useEffect(() => {
    fetchProducts();
  }, [selectCategory, axiosSecure]);

  const fetchProducts = () => {
    setLoading(true);
    axiosSecure
      .get(`${selectCategory ? `/products/${selectCategory}` : "/products"}`)
      .then((res) => setProducts(res.data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleProductAction = (action, productId, data) => {
    console.log(`Action: ${action}, Product ID: ${productId}`, data);
    // API call based on action
    if (action === "delete" || action === "archive") {
      fetchProducts(); // Refresh after delete/archive
    }
  };

  const getStockBadge = (stock) => {
    if (stock > 50)
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {stock} units
        </span>
      );
    if (stock > 20)
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          {stock} units
        </span>
      );
    if (stock > 0)
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
          {stock} units
        </span>
      );
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
        Out of Stock
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "in stock": "bg-green-50 text-green-600 border border-green-100",
      "out of stock": "bg-red-50 text-red-600 border border-red-100",
      pending: "bg-amber-50 text-amber-600 border border-amber-100",
      active: "bg-primary/10 text-primary border border-primary/20",
      inactive: "bg-slate-50 text-slate-600 border border-slate-100",
      discontinued: "bg-rose-50 text-rose-600 border border-rose-100",
    };

    const bgClass =
      statusConfig[status?.toLowerCase()] || statusConfig["inactive"];

    return (
      <span
        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${bgClass}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-indigo-50/30">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Product Management
                </h1>
                <p className="text-muted-foreground text-sm md:text-base mt-1">
                  Manage your electronic gadgets inventory
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-card rounded-lg border border-border/50 shadow-sm">
                <span className="text-xs text-muted-foreground">
                  Total Products:
                </span>
                <span className="ml-2 text-lg font-bold text-foreground">
                  {products.length}
                </span>
              </div>
              <button
                onClick={fetchProducts}
                className="p-2 rounded-lg bg-card border border-border/50 hover:bg-muted transition-colors"
                title="Refresh"
              >
                <RefreshCw size={20} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <FilterIcon size={18} className="text-muted-foreground" />
                <Filter
                  category={category}
                  setSelectCategory={setSelectCategory}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Searching />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end mb-6">
          <FilledButton
            onClick={() => navigate("/dashboard/products/addProduct")}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            Add Product
          </FilledButton>
          <FilledButton className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
            <CSVLink
              data={products}
              filename={`products-${
                new Date().toISOString().split("T")[0]
              }.csv`}
              className="flex items-center gap-2"
            >
              <Download size={18} />
              Export CSV
            </CSVLink>
          </FilledButton>
        </div>

        {/* Table Section */}
        {loading ? (
          <DashboardTableLoading />
        ) : currentProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-card border border-dashed border-border rounded-2xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center mb-4">
              <Package size={40} className="text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground text-center mb-8 max-w-sm">
              {selectCategory
                ? "No products in this category. Try a different filter."
                : "Start by adding your first product to the inventory"}
            </p>
            <FilledButton
              onClick={() => navigate("/dashboard/products/addProduct")}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-lg font-semibold"
            >
              <Plus size={18} />
              Add First Product
            </FilledButton>
          </div>
        ) : (
          <>
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-600 text-white">
                      <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold tracking-wide">
                        PRODUCT
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold tracking-wide">
                        CATEGORY
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold tracking-wide">
                        PRICE
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold tracking-wide">
                        STOCK
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold tracking-wide">
                        DISCOUNT
                      </th>
                      <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold tracking-wide">
                        STATUS
                      </th>
                      <th className="px-4 md:px-6 py-4 text-center text-xs md:text-sm font-bold tracking-wide">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((p, i) => (
                      <tr
                        key={i}
                        className={`${
                          i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"
                        } hover:bg-indigo-100/70 transition-colors border-b border-border/30 last:border-b-0`}
                      >
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                              {p.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-foreground text-sm md:text-base">
                              {p.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <span className="inline-flex px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs md:text-sm font-semibold">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <span className="font-bold text-foreground text-sm md:text-base">
                            ${parseFloat(p.price).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          {getStockBadge(p.stock)}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          {p.discount ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300">
                              <TrendingUp
                                size={14}
                                className="text-amber-700"
                              />
                              <span className="font-bold text-amber-700 text-xs md:text-sm">
                                {p.discount}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          {getStatusBadge(p.status)}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex justify-center">
                            <ProductActions
                              productId={p._id || p.id}
                              onAction={handleProductAction}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gradient-to-r from-muted/50 to-indigo-50/50 border-t border-border/30 px-4 md:px-6 py-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Showing{" "}
                      <span className="font-semibold text-foreground">
                        {indexOfFirstItem + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-semibold text-foreground">
                        {Math.min(indexOfLastItem, products.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-foreground">
                        {products.length}
                      </span>{" "}
                      products
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNum = index + 1;
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 &&
                              pageNum <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                                  currentPage === pageNum
                                    ? "bg-gradient-to-r from-primary/90 to-primary text-white shadow-md"
                                    : "bg-card border border-border hover:bg-muted text-foreground"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            pageNum === currentPage - 2 ||
                            pageNum === currentPage + 2
                          ) {
                            return (
                              <span
                                key={pageNum}
                                className="px-2 text-muted-foreground"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Items per page:
                      </span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
