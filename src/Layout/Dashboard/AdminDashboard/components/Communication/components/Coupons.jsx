import React, { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Plus,
  X,
  MoreVertical,
  Tag,
  AlertCircle,
  CheckCircle,
  Calendar,
  Percent,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosSecure from "@/utils/useAxiosSecure";

const Coupons = () => {
  const axiosSecure = useAxiosSecure();
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [copied, setCopied] = useState(null);

  // Fetch coupons
  const fetchCoupons = async () => {
    setFetchLoading(true);
    try {
      const res = await axiosSecure.get("/coupons");
      setCoupons(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError("Failed to load coupons!");
      toast.error("Failed to load coupons");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Add or Update Coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const code = e.target.code.value.toUpperCase();
    const discount = e.target.discount.value;
    const expiry = e.target.expiry.value;
    const status = e.target.status.value;

    // Validation
    if (!code.trim() || !discount || !expiry) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all fields",
        customClass: { popup: "rounded-2xl" },
      });
      setLoading(false);
      return;
    }

    if (isNaN(discount) || discount <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Discount",
        text: "Discount must be a positive number",
        customClass: { popup: "rounded-2xl" },
      });
      setLoading(false);
      return;
    }

    const data = { code, discount, expiry, status };

    try {
      if (editingCoupon) {
        await axiosSecure.put(`/coupons/${editingCoupon._id}`, data);
        toast.success("Coupon updated successfully!");
      } else {
        await axiosSecure.post("/coupons", data);
        toast.success("Coupon created successfully!");
      }
      setShowModal(false);
      setEditingCoupon(null);
      e.target.reset();
      fetchCoupons();
    } catch (err) {
      console.error("Error saving coupon:", err);
      toast.error("Failed to save coupon!");
      setError("Failed to save coupon!");
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
    setOpenMenuId(null);
  };

  // Delete with SweetAlert
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Coupon?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      customClass: {
        popup: "rounded-2xl",
        header: "rounded-t-2xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/coupons/${id}`);
          setCoupons(coupons.filter((c) => c._id !== id));
          toast.success("Coupon deleted successfully!");
          setOpenMenuId(null);
        } catch (err) {
          console.error("Error deleting coupon:", err);
          toast.error("Failed to delete coupon!");
        }
      }
    });
  };

  // Copy to clipboard
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Coupon code copied!");
  };

  // Filter coupons
  const filteredCoupons = coupons.filter((c) => {
    const matchSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    return status === "Active" ? (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
        <CheckCircle size={14} className="text-emerald-600" />
        <span className="text-xs font-semibold text-emerald-700">Active</span>
      </div>
    ) : (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
        <AlertCircle size={14} className="text-slate-600" />
        <span className="text-xs font-semibold text-slate-700">Inactive</span>
      </div>
    );
  };

  const isExpired = (expiry) => {
    return new Date(expiry) < new Date();
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <Tag size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Coupons</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage discount coupons</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingCoupon(null);
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:shadow-primary/30 text-primary-foreground px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all w-full md:w-auto"
          >
            <Plus size={18} />
            New Coupon
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search coupon code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-sm"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-sm font-medium min-w-[130px]"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-6 mt-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-700 hover:text-red-900 mt-1 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {fetchLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredCoupons.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">Discount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">Expiry</th>
                  <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-bold tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((c, i) => (
                  <tr
                    key={c._id}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-indigo-50/30"
                    } hover:bg-indigo-100/50 transition-colors border-b border-border/30 last:border-b-0`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                          <span className="font-bold text-primary text-sm">{c.code}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(c.code)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                        >
                          {copied === c.code ? (
                            <Check size={16} className="text-emerald-600" />
                          ) : (
                            <Copy size={16} className="text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
                        <Percent size={14} className="text-amber-700" />
                        <span className="font-bold text-amber-700 text-sm">{c.discount}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span className={isExpired(c.expiry) ? "text-red-600 font-semibold" : "text-foreground"}>
                          {new Date(c.expiry).toLocaleDateString()}
                        </span>
                        {isExpired(c.expiry) && (
                          <span className="text-xs text-red-600 font-medium">(Expired)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(c.status)}</td>
                    <td className="px-6 py-4 text-center relative group">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === c._id ? null : c._id)
                        }
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                      >
                        <MoreVertical size={18} className="text-muted-foreground" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === c._id && (
                        <div className="absolute right-0 top-10 bg-card border border-border rounded-lg shadow-lg w-40 z-10 overflow-hidden">
                          <button
                            onClick={() => handleEdit(c)}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-muted transition-colors text-sm font-medium text-foreground border-b border-border/30"
                          >
                            <Edit size={16} className="text-primary" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-sm font-medium text-red-600"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Tag size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No coupons found</h3>
            <p className="text-muted-foreground text-sm text-center">
              {searchTerm || filterStatus !== "All"
                ? "Try adjusting your search or filter"
                : "Create your first coupon to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary/20 to-blue-50 border-b border-border/30 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCoupon(null);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Coupon Code
                </label>
                <input
                  type="text"
                  name="code"
                  defaultValue={editingCoupon?.code || ""}
                  placeholder="SUMMER2024"
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground text-sm uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Percent size={16} className="text-primary" />
                  Discount Amount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  defaultValue={editingCoupon?.discount || ""}
                  placeholder="10"
                  min="1"
                  max="100"
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiry"
                  defaultValue={editingCoupon?.expiry || ""}
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Status</label>
                <select
                  name="status"
                  defaultValue={editingCoupon?.status || "Active"}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground text-sm font-medium"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/30">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCoupon(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : editingCoupon
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
