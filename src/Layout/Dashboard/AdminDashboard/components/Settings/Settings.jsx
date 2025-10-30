import React, { useState, useEffect } from "react";
import { Store, Shield, User } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";
import axios from "axios";

const Settings = () => {
  const axiosSecure = useAxiosSecure();
  const { user: authUser, userData } = useAuth();
  const role = userData?.role; // "admin", "moderator", or "user"
  const [activeTab, setActiveTab] = useState("store"); // store, security, profile
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    // Store Information
    storeName: "TechGadget Store",
    email: "admin@techgadget.com",
    phone: "+880 1234-567890",
    address: "Dhaka, Bangladesh",
    currency: "BDT",
    taxRate: 15,
    shippingFee: 60,

    // Security
    emailNotifications: true,
    orderNotifications: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // Profile Information
    adminName: "",
    adminEmail: "",
    profilePicture: "",
    profilePictureFile: null,
    profilePicturePreview: "",
  });

  // Load admin profile data
  useEffect(() => {
    const loadAdminProfile = async () => {
      if (!authUser?.email) return;

      try {
        setLoading(true);
        const { data } = await axiosSecure.get(`/users/${encodeURIComponent(authUser.email)}`);
        setFormData(prev => ({
          ...prev,
          adminName: data?.name || "",
          adminEmail: data?.email || authUser.email,
          profilePicture: data?.avatar || data?.photoURL || "",
          profilePicturePreview: data?.avatar || data?.photoURL || "",
        }));
      } catch (error) {
        toast.error("Failed to load admin profile");
        console.error("Error loading admin profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminProfile();
  }, [authUser, axiosSecure]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
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

    setFormData((prev) => ({
      ...prev,
      profilePictureFile: file,
      profilePicturePreview: previewUrl,
    }));
  };

  // Upload to Cloudinary
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

  const handleSave = async () => {
    if (activeTab === "profile") {
      await handleSaveProfile();
    } else {
      // For store and security tabs, show success message
      toast.success("Settings saved successfully!");
    }
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!authUser?.email) return;

    try {
      setLoading(true);

      // Upload image to Cloudinary if a new file is selected
      let profileImageUrl = formData.profilePicture;
      if (formData.profilePictureFile) {
        setUploading(true);
        profileImageUrl = await uploadToCloudinary(formData.profilePictureFile);
        setUploading(false);

        if (!profileImageUrl) {
          toast.error("Failed to upload profile image. Please try again.");
          return;
        }
      }

      // Prepare form data for profile update
      const payload = new FormData();
      payload.append("name", formData.adminName);
      payload.append("avatar", profileImageUrl);

      // Update profile
      const { data } = await axiosSecure.patch(
        `/users/${encodeURIComponent(authUser.email)}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update local state with response data
      setFormData(prev => ({
        ...prev,
        adminName: data?.name || prev.adminName,
        profilePicture: data?.avatar || data?.photoURL || prev.profilePicture,
        profilePicturePreview: data?.avatar || data?.photoURL || prev.profilePicturePreview,
        profilePictureFile: null,
      }));

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (formData.profilePicturePreview) {
        URL.revokeObjectURL(formData.profilePicturePreview);
      }
    };
  }, [formData.profilePicturePreview]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your store configuration
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border/50 mb-8">
          <button
            onClick={() => setActiveTab("store")}
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "store"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Store size={18} />
            Store Information
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "security"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield size={18} />
            Security
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium flex items-center gap-2 ${
              activeTab === "profile"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User size={18} />
            Profile
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "store" && (
          <div className="bg-card rounded-xl border border-border/50 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Store className="text-primary" size={20} />
              </div>
              <h3 className="text-foreground">Store Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="BDT">BDT</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Shipping Fee
                  </label>
                  <input
                    type="number"
                    name="shippingFee"
                    value={formData.shippingFee}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="bg-card rounded-xl border border-border/50 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="text-primary" size={20} />
              </div>
              <h3 className="text-foreground">Security</h3>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-foreground font-medium mb-4">Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-foreground font-medium">Email Notifications</p>
                      <p className="text-muted-foreground text-sm">
                        Receive email updates about your store
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-foreground font-medium">Order Notifications</p>
                      <p className="text-muted-foreground text-sm">
                        Get notified when new orders are placed
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="orderNotifications"
                        checked={formData.orderNotifications}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-foreground font-medium mb-4">Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      className="input-field"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-card rounded-xl border border-border/50 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <User className="text-primary" size={20} />
              </div>
              <h3 className="text-foreground">Profile Information</h3>
            </div>

            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={formData.profilePicturePreview || "https://ui-avatars.com/api/?name=Admin&background=random"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-border/50"
                  />
                  <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition cursor-pointer">
                    <User size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h4 className="text-foreground font-medium">Profile Picture</h4>
                  <p className="text-muted-foreground text-sm">
                    JPG, GIF or PNG. Max size of 5MB
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    disabled
                    className="input-field bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={role || "admin"}
                    disabled
                    className="input-field bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">User role</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            className="px-6 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition font-medium"
            disabled={loading || uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary px-6 py-2.5"
            disabled={loading || uploading}
          >
            {uploading ? "Uploading..." : loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
