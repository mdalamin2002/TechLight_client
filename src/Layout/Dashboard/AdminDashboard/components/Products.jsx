import React, { useEffect, useState } from "react";
import {
  Plus,
  Download,
  TrendingUp,
  Package,
  ChevronLeft,
  ChevronRight,
  Filter as FilterIcon,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
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
  const [statusFilter, setStatusFilter] = useState(""); // Add status filter state
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchProducts();
  }, [selectCategory, statusFilter, axiosSecure]);

  const fetchProducts = () => {
    setLoading(true);
    // Use the admin endpoint to get all products without pagination
    axiosSecure
      .get(`/products/admin/all?all=true`)
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to fetch products");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosSecure.get("/categories");
        setCategory(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, [axiosSecure]);

  // Pagination Logic (for display purposes only)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleProductAction = (action, productId) => {
    if (action === "delete") {
      // Call the hard delete API
      axiosSecure
        .delete(`/products/admin/hard-delete/${productId}`)
        .then(() => {
          toast.success("Product permanently deleted!");
          // Refresh the product list
          fetchProducts();
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
          toast.error("Failed to delete product");
        });
    }
  };

  // Function to update product status
  const updateProductStatus = (productId, newStatus) => {
    axiosSecure
      .patch(`/products/status/${productId}`, { status: newStatus })
      .then(() => {
        toast.success(`Product status updated to ${newStatus}`);
        // Update the product in the local state
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product._id === productId
              ? { ...product, status: newStatus }
              : product
          )
        );
      })
      .catch((error) => {
        console.error("Error updating product status:", error);
        toast.error("Failed to update product status");
      });
  };

  const getStockBadge = (stock) => {
    if (stock > 50)
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {stock} units
        </span>
      );
    if (stock > 20)
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          {stock} units
        </span>
      );
    if (stock > 0)
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
          {stock} units
        </span>
      );
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
        Out of Stock
      </span>
    );
  };

  // Status change dropdown component
  const StatusChangeDropdown = ({ productId, currentStatus }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleStatusChange = (newStatus) => {
      if (newStatus !== currentStatus) {
        updateProductStatus(productId, newStatus);
      }
      setIsOpen(false);
    };

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1 rounded-lg bg-card border border-border hover:bg-muted text-foreground text-xs font-medium flex items-center gap-1"
        >
          {currentStatus?.charAt(0).toUpperCase() + currentStatus?.slice(1)}
          <ChevronDown size={14} />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-32 rounded-lg bg-card border border-border shadow-lg">
            <div className="py-1">
              {['pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`block w-full text-left px-4 py-2 text-xs ${
                    status === currentStatus
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-indigo-50/30">
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Product Management
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your electronic gadgets inventory
            </p>
          </div>

          <div className="flex justify-center lg:justify-end items-center gap-2 flex-wrap">
            <div className="px-3 py-2 bg-card rounded-lg border border-border/50 shadow-sm">
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
              <RefreshCw size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between flex-wrap">
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              <FilterIcon size={18} className="text-muted-foreground" />
              <Filter
                category={category}
                setSelectCategory={(value) => setSelectCategory(value === "all" ? "" : value)}
                setStatusFilter={(value) => setStatusFilter(value === "all-status" ? "" : value)} // Pass the setStatusFilter prop
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Searching className="w-full sm:w-auto" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end mb-6 w-full">
          <FilledButton className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
            <CSVLink
              data={products}
              filename={`products-${
                new Date().toISOString().split("T")[0]
              }.csv`}
              className="flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Download size={18} />
              Export CSV
            </CSVLink>
          </FilledButton>
        </div>

        {/* Table */}
        {loading ? (
          <DashboardTableLoading />
        ) : currentProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-card border border-dashed border-border rounded-2xl text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center mb-4">
              <Package size={40} className="text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground text-center mb-8 max-w-sm">
              {selectCategory
                ? "No products in this category. Try a different filter."
                : "Start by adding your first product to the inventory."}
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
          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-lg">
            {/* Scrollable Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm min-w-[700px] sm:min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-600 text-white text-xs sm:text-sm">
                    {[
                      "PRODUCT",
                      "CATEGORY",
                      "PRICE",
                      "STOCK",
                      "DISCOUNT",
                      "STATUS",
                      "ACTIONS",
                    ].map((heading, i) => (
                      <th
                        key={i}
                        className={`px-4 py-3 ${
                          heading === "ACTIONS" ? "text-center" : "text-left"
                        } font-bold tracking-wide`}
                      >
                        {heading}
                      </th>
                    ))}
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
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                            {p.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-foreground break-words text-sm md:text-base">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs md:text-sm">
                        <span className="inline-flex px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg font-semibold">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-foreground">
                        ${parseFloat(p.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">{getStockBadge(p.stock)}</td>
                      <td className="px-4 py-3">
                        {p.discount ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300">
                            <TrendingUp size={14} className="text-amber-700" />
                            <span className="font-bold text-amber-700 text-xs md:text-sm">
                              {p.discount}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusChangeDropdown
                          productId={p._id || p.id}
                          currentStatus={p.status}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
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
              <div className="bg-gradient-to-r from-muted/50 to-indigo-50/50 border-t border-border/30 px-4 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
                  <div className="text-muted-foreground text-center sm:text-left">
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

                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1.5 rounded-lg font-semibold ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-primary/90 to-primary text-white"
                              : "bg-card border border-border hover:bg-muted text-foreground"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      Items per page:
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {[5, 10, 20, 50].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
