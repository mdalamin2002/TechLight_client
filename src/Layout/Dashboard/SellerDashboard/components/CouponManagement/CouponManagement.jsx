import React, { useState } from "react";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";

const CouponManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "SALE10",
      discount: "10",
      type: "Percentage",
      activeDate: "2025-10-21",
      expiredDate: "2025-12-31",
    },
    {
      id: 2,
      code: "NEWYEAR50",
      discount: "50",
      type: "Fixed",
      activeDate: "2025-01-01",
      expiredDate: "2025-01-10",
    },
  ]);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    type: "Percentage",
    activeDate: "",
    expiredDate: "",
  });

  // Determine status based on active & expired date
  const getStatus = (coupon) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const active = new Date(coupon.activeDate).setHours(0, 0, 0, 0);
    const expired = new Date(coupon.expiredDate).setHours(0, 0, 0, 0);

    if (today < active) return "Upcoming";
    if (today >= active && today <= expired) return "Active";
    if (today > expired) return "Expired";
    return "Unknown";
  };

  // Filtered coupons
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : getStatus(coupon) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Save or update coupon
  const handleSaveCoupon = () => {
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.activeDate || !newCoupon.expiredDate) {
      alert("Please fill all fields!");
      return;
    }

    if (editingCoupon) {
      setCoupons(
        coupons.map((c) => (c.id === editingCoupon.id ? { ...c, ...newCoupon } : c))
      );
      setEditingCoupon(null);
    } else {
      setCoupons([...coupons, { id: Date.now(), ...newCoupon }]);
    }

    setIsModalOpen(false);
    setNewCoupon({ code: "", discount: "", type: "Percentage", activeDate: "", expiredDate: "" });
  };

  // Delete coupon
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setCoupons(coupons.filter((c) => c.id !== id));
    }
  };

  // Edit coupon
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setNewCoupon({ ...coupon });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Coupon Management</h1>
          <p className="text-gray-500">Create, edit, and manage your discount coupons.</p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingCoupon(null);
            setNewCoupon({ code: "", discount: "", type: "Percentage", activeDate: "", expiredDate: "" });
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-5 h-5" /> Add New Coupon
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search coupon code..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Coupon Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="px-6 py-3 font-medium">Code</th>
              <th className="px-6 py-3 font-medium">Discount</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Start Date</th>
              <th className="px-6 py-3 font-medium">End Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.length > 0 ? (
              filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium">{coupon.code}</td>
                  <td className="px-6 py-4">{coupon.discount}</td>
                  <td className="px-6 py-4">{coupon.type}</td>
                  <td className="px-6 py-4">{coupon.activeDate}</td>
                  <td className="px-6 py-4">{coupon.expiredDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        getStatus(coupon) === "Active"
                          ? "bg-green-100 text-green-700"
                          : getStatus(coupon) === "Upcoming"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {getStatus(coupon)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-3">
                    <Edit
                      className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => handleEdit(coupon)}
                    />
                    <Trash2
                      onClick={() => handleDelete(coupon.id)}
                      className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Discount</label>
                <input
                  type="number"
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Type</label>
                <select
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={newCoupon.activeDate}
                  onChange={(e) => setNewCoupon({ ...newCoupon, activeDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={newCoupon.expiredDate}
                  onChange={(e) => setNewCoupon({ ...newCoupon, expiredDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCoupon}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingCoupon ? "Update Coupon" : "Save Coupon"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
