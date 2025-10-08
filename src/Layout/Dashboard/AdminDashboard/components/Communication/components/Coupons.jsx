import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X, Settings } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const Coupons = () => {
  const axiosSecure = useAxiosSecure();
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  //  Fetch coupons
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError("Failed to load coupons!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  //  Add or Update Coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      code: e.target.code.value,
      discount: e.target.discount.value,
      expiry: e.target.expiry.value,
      status: e.target.status.value,
    };

    try {
      if (editingCoupon) {
        await axiosSecure.put(`/coupons/${editingCoupon._id}`, data);
      } else {
        await axiosSecure.post("/coupons", data);
      }
      setShowModal(false);
      setEditingCoupon(null);
      e.target.reset();
      fetchCoupons();
    } catch (err) {
      console.error("Error saving coupon:", err);
      setError("Failed to save coupon!");
    } finally {
      setLoading(false);
    }
  };

  //  Edit
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
    setOpenMenuId(null);
  };

  //  Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await axiosSecure.delete(`/coupons/${id}`);
      setCoupons(coupons.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting coupon:", err);
      setError("Failed to delete coupon!");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Coupons</h2>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full shadow-md transition"
        >
          <Plus className="w-5 h-5" /> New Coupon
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* List */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Discount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Expiry</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {coupons.length > 0 ? (
              coupons.map((c, i) => (
                <tr
                  key={i}
                  className={`${i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"} hover:bg-indigo-100/70 transition-colors`}
                >
                  <td className="px-4 py-3 font-medium">{c.code}</td>
                  <td className="px-4 py-3">{c.discount}</td>
                  <td className="px-4 py-3">{c.expiry}</td>
                  <td className={`px-4 py-3 font-semibold ${c.status === "Active" ? "text-green-600" : "text-yellow-600"}`}>
                    {c.status}
                  </td>
                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === c._id ? null : c._id)}
                      className="p-2 rounded-md hover:bg-indigo-50"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    {openMenuId === c._id && (
                      <div className="absolute right-10 top-8 bg-white border shadow-lg rounded-lg z-10 w-36">
                        <button
                          onClick={() => handleEdit(c)}
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-indigo-50 text-left text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-indigo-50 text-left text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500 bg-gray-50 font-medium">
                  No Coupons Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*  Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-8 relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 p-2 rounded-full"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="code"
                defaultValue={editingCoupon?.code || ""}
                placeholder="Coupon Code"
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="discount"
                defaultValue={editingCoupon?.discount || ""}
                placeholder="Discount Amount"
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                name="expiry"
                defaultValue={editingCoupon?.expiry || ""}
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                name="status"
                defaultValue={editingCoupon?.status || "Active"}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md transition"
              >
                {loading
                  ? "Processing..."
                  : editingCoupon
                  ? "Update Coupon"
                  : "Add Coupon"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
