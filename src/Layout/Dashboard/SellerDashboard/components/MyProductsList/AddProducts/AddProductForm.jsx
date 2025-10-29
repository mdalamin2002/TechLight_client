import React, { useState, useEffect } from "react";
import { Plus, X, Upload, Star, Package, DollarSign, Tag, Eye, Save, Image } from "lucide-react";
import axios from "axios";
import useAxiosSecure from "@/utils/useAxiosSecure";

const AddProductForm = ({ onSubmitProduct }) => {
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    name: "",
    brand: "",
    model: "",
    price: "",
    regularPrice: "",
    stock: "in stock", // Renamed from status
    status: "pending", // New status field with default value
    productCode: "",
    stockQuantity: "",
    keyFeatures: [""],
    specifications: {},
    images: {
      main: null,
      mainPreview: "",
      gallery: [],
      galleryPreviews: []
    },
    description: "",
    rating: 0
  });

  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosSecure.get("/categories");
        const data = response.data;

        // Transform backend data to our format
        const formattedCategories = {};
        data.forEach(cat => {
          formattedCategories[cat.category] = cat.subCategory || [];
        });

        setCategories(formattedCategories);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Fallback to default categories if backend fails
        setCategories({
          "Computing": ["Laptops", "Desktops", "Monitors", "Accessories"],
          "Smart Home": ["Security Cameras", "Smart Speakers", "Smart Lights", "Thermostats"],
          "Mobile": ["Smartphones", "Tablets", "Accessories", "Smartwatches"],
          "Gaming": ["Consoles", "Controllers", "Headsets", "Monitors"],
          "Audio": ["Headphones", "Speakers", "Earbuds", "Amplifiers"]
        });
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [axiosSecure]);

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
      alert("Failed to upload image");
      return null;
    }
  };

  // Handle main image upload
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Preview
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        main: file,
        mainPreview: preview
      }
    }));
  };

  // Handle gallery images upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);

    // Validate
    const invalidFiles = files.filter(f => !f.type.startsWith("image/"));
    if (invalidFiles.length > 0) {
      alert("Please select only image files");
      return;
    }

    const oversizedFiles = files.filter(f => f.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert("All images should be less than 5MB");
      return;
    }

    // Create previews
    const newGallery = [...formData.images.gallery];
    const newPreviews = [...formData.images.galleryPreviews];

    files.forEach(file => {
      newGallery.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        gallery: newGallery,
        galleryPreviews: newPreviews
      }
    }));
  };

  const removeGalleryImage = (index) => {
    const newGallery = formData.images.gallery.filter((_, i) => i !== index);
    const newPreviews = formData.images.galleryPreviews.filter((_, i) => i !== index);

    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        gallery: newGallery,
        galleryPreviews: newPreviews
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKeyFeatureChange = (index, value) => {
    const newFeatures = [...formData.keyFeatures];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, keyFeatures: newFeatures }));
  };

  const addKeyFeature = () => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, ""]
    }));
  };

  const removeKeyFeature = (index) => {
    const newFeatures = formData.keyFeatures.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, keyFeatures: newFeatures }));
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setFormData(prev => ({
        ...prev,
        specifications: { ...prev.specifications, [specKey]: specValue }
      }));
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpecification = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.images.main) {
      alert("Main image is required!");
      return;
    }

    if (formData.images.gallery.length === 0) {
      alert("At least one gallery image is required!");
      return;
    }

    setUploading(true);

    try {
      // Upload main image
      const mainImageUrl = await uploadToCloudinary(formData.images.main);

      // Upload gallery images
      const galleryUrls = [];
      for (const file of formData.images.gallery) {
        const url = await uploadToCloudinary(file);
        if (url) galleryUrls.push(url);
      }

      const productData = {
        category: formData.category,
        subcategory: formData.subcategory,
        name: formData.name,
        brand: formData.brand,
        model: formData.model,
        price: parseFloat(formData.price),
        regularPrice: parseFloat(formData.regularPrice),
        stock: formData.stock, // Renamed from status
        status: formData.status, // New status field
        productCode: formData.productCode,
        stockQuantity: parseInt(formData.stockQuantity),
        keyFeatures: formData.keyFeatures.filter(f => f.trim()),
        specifications: formData.specifications,
        images: {
          main: mainImageUrl,
          gallery: galleryUrls
        },
        description: formData.description,
        rating: 0,
        totalReviews: 0
      };

      console.log("Product Data:", productData);

      // Call the parent submit handler
      await onSubmitProduct(productData);

      // Reset form
      setFormData({
        category: "",
        subcategory: "",
        name: "",
        brand: "",
        model: "",
        price: "",
        regularPrice: "",
        stock: "in stock", // Renamed from status
        status: "pending", // New status field
        productCode: "",
        stockQuantity: "",
        keyFeatures: [""],
        specifications: {},
        images: {
          main: null,
          mainPreview: "",
          gallery: [],
          galleryPreviews: []
        },
        description: "",
        rating: 0
      });
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to add product");
    } finally {
      setUploading(false);
    }
  };

  const discount = formData.regularPrice && formData.price
    ? Math.round(((formData.regularPrice - formData.price) / formData.regularPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
              <p className="text-sm text-muted-foreground">Fill in the details to add a product to your store</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Basic Information
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                    {loadingCategories ? (
                      <div className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground">
                        Loading categories...
                      </div>
                    ) : (
                      <select
                        name="category"
                        value={formData.category}
                        onChange={(e) => {
                          handleChange(e);
                          setFormData(prev => ({ ...prev, subcategory: "" }));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                      >
                        <option value="">Select Category</option>
                        {Object.keys(categories).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subcategory</label>
                    {loadingCategories ? (
                      <div className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground">
                        Loading subcategories...
                      </div>
                    ) : (
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        disabled={!formData.category}
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition disabled:opacity-50"
                      >
                        <option value="">Select Subcategory</option>
                        {formData.category && categories[formData.category]?.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., IMOU Ranger 2C 4MP Wi-Fi Indoor Camera"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="e.g., IMOU"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g., Ranger 2C"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed product description..."
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Pricing & Inventory
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Regular Price (৳)</label>
                    <input
                      type="number"
                      name="regularPrice"
                      value={formData.regularPrice}
                      onChange={handleChange}
                      placeholder="4290"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Sale Price (৳)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="3790"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      placeholder="5"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Product Code</label>
                    <input
                      type="text"
                      name="productCode"
                      value={formData.productCode}
                      onChange={handleChange}
                      placeholder="41050"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Stock Status</label>
                    <select
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                    >
                      <option value="in stock">In Stock</option>
                      <option value="out of stock">Out of Stock</option>
                      <option value="pre-order">Pre-Order</option>
                    </select>
                  </div>
                </div>

                {/* New Status Field - Read Only */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Product Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Status is set to pending by default and cannot be changed</p>
                </div>

                {discount > 0 && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      💰 {discount}% discount applied
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Key Features
                </h3>
                <button
                  type="button"
                  onClick={addKeyFeature}
                  className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {formData.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleKeyFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                    />
                    {formData.keyFeatures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKeyFeature(index)}
                        className="p-2.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4">Specifications</h3>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    placeholder="Spec name (e.g., Resolution)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                  />
                  <input
                    type="text"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    placeholder="Value (e.g., 2560x1440)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {Object.keys(formData.specifications).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(formData.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <span className="font-medium text-foreground">{key}:</span>
                          <span className="text-muted-foreground ml-2">{value}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSpecification(key)}
                          className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Images Upload */}
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                Product Images
              </h3>

              <div className="space-y-4">
                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Main Image *</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                      id="mainImage"
                    />
                    <label
                      htmlFor="mainImage"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer bg-background hover:bg-muted/50 transition"
                    >
                      {formData.images.mainPreview ? (
                        <img
                          src={formData.images.mainPreview}
                          alt="Main preview"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Click to upload main image</p>
                          <p className="text-xs text-muted-foreground mt-1">Max 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Gallery Images *</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                      id="galleryImages"
                    />
                    <label
                      htmlFor="galleryImages"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer bg-background hover:bg-muted/50 transition"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload gallery images</p>
                      <p className="text-xs text-muted-foreground mt-1">Multiple images allowed, Max 5MB each</p>
                    </label>

                    {/* Gallery Previews */}
                    {formData.images.galleryPreviews.length > 0 && (
                      <div className="grid grid-cols-4 gap-3">
                        {formData.images.galleryPreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Gallery ${index + 1}`}
                              className="w-full aspect-square object-cover rounded-lg border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Add Product
                </>
              )}
            </button>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Live Preview
                </h3>
              </div>

              <div className="space-y-4">
                {/* Product Image */}
                <div className="aspect-square rounded-xl bg-muted overflow-hidden border border-border">
                  {formData.images.mainPreview ? (
                    <img src={formData.images.mainPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Gallery Thumbnails */}
                {formData.images.galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.galleryPreviews.map((preview, index) => (
                      <div key={index} className="aspect-square rounded-lg bg-muted overflow-hidden border border-border">
                        <img src={preview} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Product Info */}
                <div>
                  {formData.category && (
                    <p className="text-xs text-primary font-medium mb-1">{formData.category} / {formData.subcategory}</p>
                  )}
                  <h4 className="text-xl font-bold text-foreground mb-2">
                    {formData.name || "Product Name"}
                  </h4>
                  {formData.brand && (
                    <p className="text-sm text-muted-foreground mb-3">
                      Brand: <span className="font-medium text-foreground">{formData.brand}</span>
                      {formData.model && ` | Model: ${formData.model}`}
                    </p>
                  )}
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-foreground">
                    ৳{formData.price || "0"}
                  </span>
                  {formData.regularPrice && formData.regularPrice > formData.price && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        ৳{formData.regularPrice}
                      </span>
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Status & Stock */}
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    formData.stock === "in stock"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {formData.stock || "in stock"}
                  </span>
                  {formData.stockQuantity && (
                    <span className="text-xs text-muted-foreground">
                      {formData.stockQuantity} units available
                    </span>
                  )}
                </div>

                {/* Product Status */}
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    formData.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                      : formData.status === "approved"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {formData.status}
                  </span>
                </div>

                {/* Key Features */}
                {formData.keyFeatures.some(f => f) && (
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-2">Key Features:</h5>
                    <ul className="space-y-1">
                      {formData.keyFeatures.filter(f => f).map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Specifications */}
                {Object.keys(formData.specifications).length > 0 && (
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-2">Specifications:</h5>
                    <div className="space-y-1">
                      {Object.entries(formData.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium text-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {formData.description && (
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-2">Description:</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {formData.description}
                    </p>
                  </div>
                )}

                {/* Product Code */}
                {formData.productCode && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Product Code: <span className="font-mono">{formData.productCode}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
