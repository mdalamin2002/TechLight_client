import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Card, CardContent } from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import {
  X,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  Settings,
  Package,
  DollarSign,
  FileText,
  Tag,
  Box,
  DollarSign as DollarSignIcon,
  Hash,
} from "lucide-react";
import FormHeading from "./FormHeading";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AddProductForm = ({ onSubmitProduct }) => {
  const [mainImage, setMainImage] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [specs, setSpecs] = useState([{ name: "", value: "" }]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Watch form values for preview
  const formValues = watch();

  // Upload to Cloudinary
  const uploadToCloudinary = async (files) => {
    const uploadedURLs = [];
    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_Upload_preset);
        formData.append("cloud_name", import.meta.env.VITE_Cloud_name);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_Cloud_name
          }/image/upload`,
          formData
        );
        uploadedURLs.push(res.data.secure_url);
      }

      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }

    return uploadedURLs;
  };

  // Handle main image upload (single)
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const [url] = await uploadToCloudinary([file]);
    setMainImage(url);
  };

  // Handle gallery upload (multiple)
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);

    // Validate file types
    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/")
    );
    if (invalidFiles.length > 0) {
      toast.error("Please select only image files");
      return;
    }

    // Validate file sizes
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("All images should be less than 5MB");
      return;
    }

    const urls = await uploadToCloudinary(files);
    setGalleryImages((prev) => [...prev, ...urls]);
  };

  const removeGalleryImage = (url) => {
    setGalleryImages(galleryImages.filter((img) => img !== url));
    toast.info("Image removed from gallery");
  };

  // Specification logic
  const addSpec = () => setSpecs([...specs, { name: "", value: "" }]);
  const removeSpec = (i) => {
    if (specs.length > 1) {
      setSpecs(specs.filter((_, index) => index !== i));
    } else {
      toast.info("At least one specification field is required");
    }
  };

  const handleSpecChange = (i, field, value) => {
    const updated = [...specs];
    updated[i][field] = value;
    setSpecs(updated);
  };

  // Final Submit
  const onSubmit = async (data) => {
    // Validation
    if (!mainImage) {
      toast.error("Main image is required!");
      return;
    }

    if (galleryImages.length === 0) {
      toast.error("At least one gallery image is required!");
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Confirm Product Submission",
      html: `
        <div class="text-left">
          <p><strong>Product Name:</strong> ${data.name}</p>
          <p><strong>Brand:</strong> ${data.brand}</p>
          <p><strong>Category:</strong> ${data.category}</p>
          <p><strong>Price:</strong> ${data.currency || "BDT"} ${data.price}</p>
          <p><strong>Discount Price:</strong> ${data.currency || "BDT"} ${
        data.discount_price
      }</p>
          <p><strong>Stock:</strong> ${data.stock} units</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#5061fc",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit product",
      customClass: {
        popup: "rounded-xl",
        header: "rounded-t-xl",
      },
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);

    try {
      // Convert specs array to object
      const specsObject = specs.reduce((acc, curr) => {
        if (curr.name.trim() && curr.value.trim()) {
          acc[curr.name] = curr.value;
        }
        return acc;
      }, {});

      const productData = {
        ...data,
        currency: data.currency || "BDT",
        specifications: specsObject,
        mainImage,
        galleryImages,
      };

      await onSubmitProduct(productData);

      // Reset form after successful submission
      reset();
      setSpecs([{ name: "", value: "" }]);
      setMainImage("");
      setGalleryImages([]);

      toast.success("Product submitted successfully!");
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Failed to submit product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form id="addProductForm" onSubmit={handleSubmit(onSubmit)}>
        <FormHeading />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Single Unified Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card rounded-2xl md:p-4 shadow-lg border border-border/50 backdrop-blur-sm">
              <CardContent className="p-8 space-y-8">
                {/* Section 1: Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-border/30">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Basic Information
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Product name, brand, category, and description
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        Product Name *
                      </Label>
                      <Input
                        id="name"
                        {...register("name", {
                          required: "Product name is required",
                        })}
                        placeholder="Enter product name"
                        className={`h-11 rounded-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.name
                            ? "border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="brand"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Box className="h-4 w-4 text-muted-foreground" />
                        Brand *
                      </Label>
                      <Input
                        id="brand"
                        {...register("brand", {
                          required: "Brand is required",
                        })}
                        placeholder="Enter brand name"
                        className={`h-11 rounded-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.brand
                            ? "border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                      />
                      {errors.brand && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.brand.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="category"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Package className="h-4 w-4 text-muted-foreground" />
                        Category *
                      </Label>
                      <Select onValueChange={(v) => setValue("category", v)}>
                        <SelectTrigger
                          className={`h-11 w-full rounded-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                            errors.category
                              ? "border-red-500 focus:ring-red-500/20"
                              : ""
                          }`}
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laptop">Laptop</SelectItem>
                          <SelectItem value="Desktop">Desktop</SelectItem>
                          <SelectItem value="Phone">Phone</SelectItem>
                          <SelectItem value="Tablet">Tablet</SelectItem>
                          <SelectItem value="Accessories">
                            Accessories
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          Category is required
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="subcategory"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        Sub Category *
                      </Label>
                      <Select onValueChange={(v) => setValue("subcategory", v)}>
                        <SelectTrigger
                          className={`h-11 w-full rounded-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                            errors.subcategory
                              ? "border-red-500 focus:ring-red-500/20"
                              : ""
                          }`}
                        >
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gaming">Gaming</SelectItem>
                          <SelectItem value="Office">Office</SelectItem>
                          <SelectItem value="Budget">Budget</SelectItem>
                          <SelectItem value="Premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.subcategory && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          Subcategory is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Enter detailed product description"
                      rows={4}
                      className="rounded-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Section 2: Pricing & Stock */}
                <div className="space-y-6 pt-6 border-t border-border/20">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Pricing & Stock
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Price, discount, currency, and inventory
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currency"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                        Currency *
                      </Label>
                      <Select
                        onValueChange={(v) => setValue("currency", v)}
                        defaultValue="BDT"
                      >
                        <SelectTrigger className="h-11 w-full rounded-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BDT">BDT</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="SAR">SAR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="stock"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Box className="h-4 w-4 text-muted-foreground" />
                        Stock Quantity *
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        {...register("stock", {
                          required: "Stock is required",
                          min: { value: 0, message: "Stock must be positive" },
                        })}
                        placeholder="0"
                        className={`h-11 rounded-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.stock
                            ? "border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                      />
                      {errors.stock && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.stock.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="price"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                        Price *
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        {...register("price", {
                          required: "Price is required",
                          min: { value: 0, message: "Price must be positive" },
                        })}
                        placeholder="0.00"
                        className={`h-11 rounded-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.price
                            ? "border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                      />
                      {errors.price && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.price.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="discount_price"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        Discount Price *
                      </Label>
                      <Input
                        id="discount_price"
                        type="number"
                        step="0.01"
                        {...register("discount_price", {
                          required: "Discount price is required",
                          min: {
                            value: 0,
                            message: "Discount price must be positive",
                          },
                        })}
                        placeholder="0.00"
                        className={`h-11 rounded-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          errors.discount_price
                            ? "border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                      />
                      {errors.discount_price && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <X className="h-3 w-3" />
                          {errors.discount_price.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Media */}
                <div className="space-y-6 pt-6 border-t border-border/20">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Media
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Product images and gallery
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Image */}
                    <div className="space-y-4">
                      <h4 className="text-base font-medium flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Main Image
                      </h4>
                      <label
                        htmlFor="mainImageUpload"
                        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl p-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                      >
                        <Upload className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm text-muted-foreground text-center group-hover:text-foreground transition-colors">
                          {uploading
                            ? "Uploading..."
                            : "Click to upload main image"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, GIF up to 5MB
                        </span>
                        <input
                          id="mainImageUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleMainImageUpload}
                          required
                        />
                      </label>

                      {mainImage && (
                        <div className="relative group rounded-xl overflow-hidden border border-border/50">
                          <img
                            src={mainImage}
                            alt="Main"
                            className="w-full h-40 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setMainImage("")}
                            className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <div className="bg-red-500 text-white p-2 rounded-lg">
                              <X className="w-5 h-5" />
                            </div>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Gallery Images */}
                    <div className="space-y-4">
                      <h4 className="text-base font-medium flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Gallery Images
                      </h4>
                      <label
                        htmlFor="galleryUpload"
                        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl p-6 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                      >
                        <Upload className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm text-muted-foreground text-center group-hover:text-foreground transition-colors">
                          {uploading
                            ? "Uploading..."
                            : "Click to upload gallery images"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, GIF up to 5MB each
                        </span>
                        <input
                          id="galleryUpload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleGalleryUpload}
                          required
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        {galleryImages.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-xl overflow-hidden border border-border/50"
                          >
                            <img
                              src={url}
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-28 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(url)}
                              className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <div className="bg-red-500 text-white p-1.5 rounded-lg">
                                <X className="w-4 h-4" />
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Advanced Options */}
                <div className="space-y-6 pt-6 border-t border-border/20">
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Settings className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Specifications
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Technical details and features
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={addSpec}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 rounded-lg"
                    >
                      <Plus className="h-4 w-4" />
                      Add Spec
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {specs.map((spec, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center"
                      >
                        <Input
                          placeholder="Key (e.g. Processor)"
                          value={spec.name}
                          onChange={(e) =>
                            handleSpecChange(index, "name", e.target.value)
                          }
                          className="h-11 rounded-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <Input
                          placeholder="Value (e.g. Intel i5)"
                          value={spec.value}
                          onChange={(e) =>
                            handleSpecChange(index, "value", e.target.value)
                          }
                          className="h-11 rounded-lg border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSpec(index)}
                          disabled={specs.length === 1}
                          className="rounded-lg hover:bg-muted"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Preview Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 bg-card rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-border/30">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Live Preview
                  </h3>
                </div>

                {/* Product Image */}
                <div className="aspect-square bg-muted/30 rounded-xl overflow-hidden border border-border/50">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt="Product preview"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                      <p className="text-sm">Product image</p>
                      <p className="text-xs mt-1">Upload to see preview</p>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {formValues.name || "Product Name"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formValues.brand || "Brand"}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">
                      {formValues.currency || "BDT"} {formValues.price || "0"}
                    </span>
                    {formValues.discount_price &&
                      formValues.discount_price !== "0" && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formValues.currency || "BDT"}{" "}
                          {formValues.discount_price}
                        </span>
                      )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Stock:
                    </span>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        (formValues.stock || 0) > 10
                          ? "bg-green-100 text-green-700"
                          : (formValues.stock || 0) > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {formValues.stock || "0"} units
                    </span>
                  </div>
                </div>

                {/* Gallery */}
                {galleryImages.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Gallery</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {galleryImages.slice(0, 6).map((url, idx) => (
                        <div
                          key={idx}
                          className="aspect-square bg-muted/30 rounded-lg overflow-hidden border border-border/50"
                        >
                          <img
                            src={url}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                      {galleryImages.length > 6 && (
                        <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground border border-border/50">
                          +{galleryImages.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {formValues.description && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Description</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {formValues.description}
                    </p>
                  </div>
                )}

                {/* Specifications */}
                {specs.some((spec) => spec.name && spec.value) && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Specifications</h4>
                    <div className="space-y-2">
                      {specs
                        .filter((spec) => spec.name && spec.value)
                        .map((spec, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm p-2 bg-muted/30 rounded-lg"
                          >
                            <span className="text-muted-foreground">
                              {spec.name}:
                            </span>
                            <span className="font-medium">{spec.value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 transition-all"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
