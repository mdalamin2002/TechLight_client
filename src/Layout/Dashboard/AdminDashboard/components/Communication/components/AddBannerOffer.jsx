import React, { useEffect, useState } from "react";
import { Plus, X, Settings } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const AddBannerOffer = () => {
  const axiosSecure = useAxiosSecure();
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Fetch banners
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/banners");
      setBanners(res.data);
    } catch (err) {
      console.error("Error fetching banners:", err);
      setError("Failed to load banners!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Add or Update Banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      title: e.target.title.value,
      subtitle: e.target.subtitle.value,
      image: e.target.image.value,
      status: e.target.status.value,
    };

    try {
      if (editingBanner) {
        await axiosSecure.put(`/banners/${editingBanner._id}`, data);
      } else {
        await axiosSecure.post("/banners", data);
      }
      setShowModal(false);
      setEditingBanner(null);
      e.target.reset();
      fetchBanners();
    } catch (err) {
      console.error("Error saving banner:", err);
      setError("Failed to save banner!");
    } finally {
      setLoading(false);
    }
  };

  //  Edit Handler
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowModal(true);
    setOpenMenuId(null);
  };

  //  Delete Handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axiosSecure.delete(`/banners/${id}`);
      setBanners(banners.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error deleting banner:", err);
      setError("Failed to delete banner!");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-2xl border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Banner Offers</h2>
        <button
          onClick={() => {
            setEditingBanner(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full shadow-md transition"
        >
          <Plus className="w-5 h-5" /> New Banner
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Subtitle</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {banners.length > 0 ? (
              banners.map((b, i) => (
                <tr
                  key={i}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-indigo-50/40"
                  } hover:bg-indigo-100/70 transition-colors`}
                >
                  <td className="px-4 py-3 font-medium">{b.title}</td>
                  <td className="px-4 py-3">{b.subtitle}</td>
                  <td className="px-4 py-3">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-20 h-12 object-cover rounded-md border"
                    />
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      b.status === "Active" ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {b.status}
                  </td>
                  <td className="px-4 py-3 text-center relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === b._id ? null : b._id)}
                      className="p-2 rounded-md hover:bg-indigo-50"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    {openMenuId === b._id && (
                      <div className="absolute right-10 top-8 bg-white border shadow-lg rounded-lg z-10 w-36">
                        <button
                          onClick={() => handleEdit(b)}
                          className="flex items-center gap-2 w-full px-3 py-2 hover:bg-indigo-50 text-left text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b._id)}
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
                <td
                  colSpan="5"
                  className="text-center py-8 text-gray-500 bg-gray-50 font-medium"
                >
                  No Banners Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
              {editingBanner ? "Edit Banner" : "Add New Banner"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                defaultValue={editingBanner?.title || ""}
                placeholder="Banner Title"
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="subtitle"
                defaultValue={editingBanner?.subtitle || ""}
                placeholder="Subtitle"
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="image"
                defaultValue={editingBanner?.image || ""}
                placeholder="Image URL"
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                name="status"
                defaultValue={editingBanner?.status || "Active"}
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
                  : editingBanner
                  ? "Update Banner"
                  : "Add Banner"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBannerOffer;
