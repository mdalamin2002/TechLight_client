import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, Edit2, Trash2, X, Upload, Tag, Calendar, Store, Flame } from "lucide-react";

const Offers = () => {
  const [formData, setFormData] = useState({
    isHot: false,
    title: "",
    description: "",
    discount: "",
    originalPrice: "",
    bannerImage: "",
    bannerImageFile: null,
    bannerImagePreview: "",
    shopName: "",
    createdAt: "",
  });

  const [offers, setOffers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchOffers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_prod_baseURL}/offers`
      );
      setOffers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      toast.error("Failed to fetch offers");
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const uploadToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", import.meta.env.VITE_Upload_preset);
    formDataUpload.append("cloud_name", import.meta.env.VITE_Cloud_name);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_Cloud_name}/image/upload`,
        formDataUpload
      );
      return res.data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setFormData({
      ...formData,
      bannerImageFile: file,
      bannerImagePreview: previewUrl,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let discountValue = formData.discount.trim();
    if (!discountValue.endsWith("%")) discountValue += "%";

    let bannerImageUrl = formData.bannerImage;
    if (formData.bannerImageFile) {
      setUploading(true);
      bannerImageUrl = await uploadToCloudinary(formData.bannerImageFile);
      setUploading(false);

      if (!bannerImageUrl) {
        toast.error("Failed to upload image. Please try again.");
        return;
      }
    }

    const dataToSend = {
      ...formData,
      discount: discountValue,
      bannerImage: bannerImageUrl,
    };

    delete dataToSend.bannerImageFile;
    delete dataToSend.bannerImagePreview;

    try {
      if (editingId) {
        const response = await axios.put(
          `${import.meta.env.VITE_prod_baseURL}/offers/${editingId}`,
          dataToSend
        );

        if (response.status === 200) {
          toast.success("Offer updated successfully!");
          setShowForm(false);
          setEditingId(null);
          setTimeout(async () => {
            await fetchOffers();
          }, 500);
        }
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_prod_baseURL}/offers`,
          dataToSend
        );

        if (response.status === 201) {
          toast.success("Offer added successfully!");
          setShowForm(false);
          setTimeout(async () => {
            await fetchOffers();
          }, 500);
        }
      }

      setFormData({
        isHot: false,
        title: "",
        description: "",
        discount: "",
        originalPrice: "",
        bannerImage: "",
        bannerImageFile: null,
        bannerImagePreview: "",
        shopName: "",
        createdAt: "",
      });
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.response?.data?.message || "Failed to save offer");
    }
  };

  const handleDelete = async (_id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0071e3",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_prod_baseURL}/offers/${_id}`);
      toast.success("Offer deleted successfully!");
      setTimeout(async () => {
        await fetchOffers();
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete offer");
    }
  };

  const handleEdit = (offer) => {
    setEditingId(offer._id);
    setFormData({
      isHot: offer.isHot,
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      originalPrice: offer.originalPrice,
      bannerImage: offer.bannerImage,
      bannerImageFile: null,
      bannerImagePreview: offer.bannerImage,
      shopName: offer.shopName,
      createdAt: offer.createdAt ? offer.createdAt.split("T")[0] : "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      isHot: false,
      title: "",
      description: "",
      discount: "",
      originalPrice: "",
      bannerImage: "",
      bannerImageFile: null,
      bannerImagePreview: "",
      shopName: "",
      createdAt: "",
    });
  };

  useEffect(() => {
    return () => {
      if (formData.bannerImagePreview) {
        URL.revokeObjectURL(formData.bannerImagePreview);
      }
    };
  }, [formData.bannerImagePreview]);

  return (
    <div className="min-h-screen bg-background">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="bg-card border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground">Offers Management</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage all your special offers and deals
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Add New Offer
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {offers.length === 0 ? (
          <div className="bg-card rounded-xl border border-border/50 p-12 text-center">
            <Tag className="mx-auto text-muted-foreground mb-4" size={48} />
            <h3 className="text-foreground mb-2">No offers yet</h3>
            <p className="text-muted-foreground text-sm">
              Create your first offer to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-48 bg-muted">
                  <img
                    src={offer.bannerImage}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  {offer.isHot && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                      <Flame size={14} />
                      HOT DEAL
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-foreground font-semibold text-lg mb-2 line-clamp-1">
                    {offer.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {offer.description}
                  </p>

                  {/* Price Info */}
                  <div className="bg-primary/5 rounded-lg p-3 mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-muted-foreground text-sm line-through">
                        ৳{offer.originalPrice}
                      </span>
                      <span className="text-primary font-bold text-xs px-2 py-0.5 bg-primary/10 rounded">
                        {offer.discount} OFF
                      </span>
                    </div>
                    <div className="text-foreground font-bold text-2xl">
                      ৳
                      {offer.discount
                        ? (
                            offer.originalPrice -
                            (offer.originalPrice * parseFloat(offer.discount)) / 100
                          ).toFixed(2)
                        : offer.originalPrice}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-1">
                      <Store size={14} />
                      <span>{offer.shopName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(offer)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition font-medium"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition font-medium"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border/50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-foreground font-semibold text-xl">
                {editingId ? "Update Offer" : "Add New Offer"}
              </h2>
              <button
                onClick={resetForm}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Hot Deal Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Flame className="text-red-500" size={20} />
                  <span className="text-foreground font-medium">Mark as Hot Deal</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isHot"
                    checked={formData.isHot}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Offer Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter offer title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter offer description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="input-field resize-none"
                  required
                />
              </div>

              {/* Discount & Price */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="text"
                    name="discount"
                    placeholder="e.g., 18%"
                    value={formData.discount}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Original Price (৳)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    placeholder="Enter price"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Banner Image
                </label>
                <div className="border-2 border-dashed border-border/50 rounded-lg p-4 hover:border-primary/50 transition">
                  {(formData.bannerImagePreview || formData.bannerImage) ? (
                    <div className="relative">
                      <img
                        src={formData.bannerImagePreview || formData.bannerImage}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <label className="absolute bottom-3 right-3 px-4 py-2 bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg cursor-pointer hover:bg-card transition flex items-center gap-2">
                        <Upload size={16} />
                        <span className="text-sm font-medium">Change</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
                      <Upload className="text-muted-foreground mb-2" size={32} />
                      <span className="text-foreground font-medium mb-1">
                        Click to upload image
                      </span>
                      <span className="text-xs text-muted-foreground">
                        PNG, JPG up to 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Shop Name & Date */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    name="shopName"
                    placeholder="Enter shop name"
                    value={formData.shopName}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Created Date
                  </label>
                  <input
                    type="date"
                    name="createdAt"
                    value={formData.createdAt}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition ${
                    uploading
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "btn-primary"
                  }`}
                >
                  {uploading ? "Uploading..." : editingId ? "Update Offer" : "Create Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;
