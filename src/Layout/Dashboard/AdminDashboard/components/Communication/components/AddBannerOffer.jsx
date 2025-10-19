import React, { useEffect, useState } from "react";
import {
  Plus,
  X,
  MoreVertical,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Upload,
  Edit,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosSecure from "@/utils/useAxiosSecure";

const AddBannerOffer = () => {
  const axiosSecure = useAxiosSecure();
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  // Fetch banners
  const fetchBanners = async () => {
    setFetchLoading(true);
    try {
      const res = await axiosSecure.get("/banners");
      setBanners(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching banners:", err);
      setError("Failed to load banners!");
      toast.error("Failed to load banners");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Image to ImageBB
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success) return data.data.url;
      else throw new Error("Image upload failed");
    } catch (err) {
      console.error("Image upload error:", err);
      throw err;
    }
  };

  // Add or Update Banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const title = e.target.title.value.trim();
    const subtitle = e.target.subtitle.value.trim();
    const status = e.target.status.value;

    // Validation
    if (!title || !subtitle) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all fields",
        customClass: { popup: "rounded-2xl" },
      });
      setLoading(false);
      return;
    }

    try {
      let imageUrl = editingBanner?.image || null;

      if (imageFile) {
        toast.loading("Uploading image...");
        imageUrl = await uploadImage(imageFile);
        toast.dismiss();
      }

      if (!imageUrl && !editingBanner) {
        Swal.fire({
          icon: "warning",
          title: "Image Required",
          text: "Please upload an image for new banners",
          customClass: { popup: "rounded-2xl" },
        });
        setLoading(false);
        return;
      }

      const data = {
        title,
        subtitle,
        image: imageUrl,
        status,
      };

      if (editingBanner) {
        await axiosSecure.put(`/banners/${editingBanner._id}`, data);
        toast.success("Banner updated successfully!");
      } else {
        await axiosSecure.post("/banners", data);
        toast.success("Banner created successfully!");
      }

      setShowModal(false);
      setEditingBanner(null);
      setImageFile(null);
      setImagePreview(null);
      e.target.reset();
      fetchBanners();
    } catch (err) {
      console.error("Error saving banner:", err);
      toast.error("Failed to save banner!");
      setError("Failed to save banner!");
    } finally {
      setLoading(false);
    }
  };

  // Edit Handler
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setImagePreview(banner.image);
    setShowModal(true);
    setOpenMenuId(null);
  };

  // Delete Handler
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Banner?",
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
          await axiosSecure.delete(`/banners/${id}`);
          setBanners(banners.filter((b) => b._id !== id));
          toast.success("Banner deleted successfully!");
          setOpenMenuId(null);
        } catch (err) {
          console.error("Error deleting banner:", err);
          toast.error("Failed to delete banner!");
        }
      }
    });
  };

  // Filter banners
  const filteredBanners = banners.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || b.status === filterStatus;
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

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <Zap size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Banner Offers</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage promotional banners</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingBanner(null);
              setShowModal(true);
              setImageFile(null);
              setImagePreview(null);
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg hover:shadow-primary/30 text-primary-foreground px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all w-full md:w-auto"
          >
            <Plus size={18} />
            New Banner
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search banner title..."
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
        ) : filteredBanners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBanners.map((b) => (
              <div
                key={b._id}
                className="group rounded-xl border border-border/50 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Banner Image */}
                <div className="relative h-40 bg-muted overflow-hidden">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(b)}
                        className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Banner Info */}
                <div className="p-4 bg-card border-t border-border/30">
                  <h3 className="text-base font-bold text-foreground mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{b.subtitle}</p>
                  <div className="flex items-center justify-between">
                    {getStatusBadge(b.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <ImageIcon size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No banners found</h3>
            <p className="text-muted-foreground text-sm text-center">
              {searchTerm || filterStatus !== "All"
                ? "Try adjusting your search or filter"
                : "Create your first banner offer to get started"}
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
                {editingBanner ? "Edit Banner" : "Create New Banner"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingBanner(null);
                  setImageFile(null);
                  setImagePreview(null);
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
                  Banner Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingBanner?.title || ""}
                  placeholder="Summer Sale 2024"
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  defaultValue={editingBanner?.subtitle || ""}
                  placeholder="Get up to 50% off on all items"
                  required
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition text-foreground text-sm"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Upload size={16} className="text-primary" />
                  Banner Image
                </label>
                <label
                  htmlFor="banner-image-input"
                  className="block cursor-pointer border-2 border-dashed border-border/50 rounded-lg p-4 text-center hover:border-primary transition-colors"
                >
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="text-xs text-red-600 hover:text-red-700 underline"
                      >
                        Remove image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon size={32} className="mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload image (Max 5MB)
                      </p>
                    </div>
                  )}
                </label>
                <input
                  id="banner-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={editingBanner?.status || "Active"}
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
                    setEditingBanner(null);
                    setImageFile(null);
                    setImagePreview(null);
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
                  {loading ? "Processing..." : editingBanner ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBannerOffer;
