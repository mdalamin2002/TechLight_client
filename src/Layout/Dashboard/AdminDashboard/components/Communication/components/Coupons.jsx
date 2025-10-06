import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, X, Edit, Trash2 } from "lucide-react";

const API_URL = "http://localhost:5000/api/coupons";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null); // ✏️ Edit state

  // ✅ Fetch all coupons
  const fetchCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      setCoupons(res.data);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ✅ Add or Update coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const couponData = {
      code: e.target.code.value,
      discount: e.target.discount.value,
      expiry: e.target.expiry.value,
      status: e.target.status.value,
    };

    try {
      if (editingCoupon) {
        // ✏️ UPDATE REQUEST
        await axios.put(`${API_URL}/${editingCoupon._id}`, couponData);
        console.log("Coupon updated");
      } else {
        // ➕ CREATE REQUEST
        await axios.post(API_URL, couponData);
        console.log("Coupon added");
      }

      setShowModal(false);
      e.target.reset();
      setEditingCoupon(null);
      fetchCoupons();
    } catch (err) {
      console.error("Error saving coupon:", err);
      setError("Failed to save coupon");
    } finally {
      setLoading(false);
    }
  };

  // ✏️ EDIT CODE START
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };
  // ✏️ EDIT CODE END

  // 🗑️ DELETE CODE START
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCoupons(coupons.filter((c) => c._id !== id)); // UI side remove
    } catch (err) {
      console.error("Error deleting coupon:", err);
      setError("Failed to delete coupon");
    }
  };
  // 🗑️ DELETE CODE END

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 font-inter max-w-4xl mx-auto my-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Coupon Management</h3>
        <button
          onClick={() => {
            setEditingCoupon(null); // Reset editing
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2 text-sm bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" /> Add New Coupon
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
          <p className="font-bold">Error:</p>
          <span>{error}</span>
        </div>
      )}

      {coupons.length > 0 ? (
        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-100">
          <table className="w-full text-sm border-collapse text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase tracking-wider">
                <th className="p-4 border-b border-gray-200">Code</th>
                <th className="p-4 border-b border-gray-200">Discount</th>
                <th className="p-4 border-b border-gray-200">Expiry</th>
                <th className="p-4 border-b border-gray-200">Status</th>
                <th className="p-4 border-b border-gray-200 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors"
                >
                  <td className="p-4 font-mono text-purple-700 font-medium">
                    {coupon.code}
                  </td>
                  <td className="p-4 text-green-600 font-semibold">
                    {coupon.discount}
                  </td>
                  <td className="p-4 text-gray-500">{coupon.expiry}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        coupon.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          No coupons available. Click "Add New Coupon" to get started!
        </p>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">
              {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="code"
                defaultValue={editingCoupon?.code || ""}
                placeholder="Coupon Code"
                required
                className="w-full border p-3 rounded-lg"
              />
              <input
                type="text"
                name="discount"
                defaultValue={editingCoupon?.discount || ""}
                placeholder="Discount"
                required
                className="w-full border p-3 rounded-lg"
              />
              <input
                type="date"
                name="expiry"
                defaultValue={editingCoupon?.expiry || ""}
                required
                className="w-full border p-3 rounded-lg"
              />
              <select
                name="status"
                defaultValue={editingCoupon?.status || "Active"}
                className="w-full border p-3 rounded-lg"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold"
              >
                {loading
                  ? editingCoupon
                    ? "Updating..."
                    : "Adding..."
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
