import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Card } from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { X, Upload } from "lucide-react";
import FormHeading from "./FormHeading";

const AddProductForm = ({ onSubmitProduct }) => {
  const [mainImage, setMainImage] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [specs, setSpecs] = useState([{ name: "", value: "" }]);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, setValue, } = useForm();

  // Upload to Cloudinary
  const uploadToCloudinary = async (files) => {
    const uploadedURLs = [];
    setUploading(true);
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

    setUploading(false);
    return uploadedURLs;
  };

  // Handle main image upload (single)
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const [url] = await uploadToCloudinary([file]);
    setMainImage(url);
  };

  // Handle gallery upload (multiple)
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    const urls = await uploadToCloudinary(files);
    setGalleryImages((prev) => [...prev, ...urls]);
  };

  const removeGalleryImage = (url) => {
    setGalleryImages(galleryImages.filter((img) => img !== url));
  };

  // Specification logic
  const addSpec = () => setSpecs([...specs, { name: "", value: "" }]);
  const removeSpec = (i) => setSpecs(specs.filter((_, index) => index !== i));
  const handleSpecChange = (i, field, value) => {
    const updated = [...specs];
    updated[i][field] = value;
    setSpecs(updated);
  };

  // Final Submit
  const onSubmit = (data) => {
    if (!mainImage) {
      alert("Main image is required!");
      return;
    }

    if (galleryImages.length === 0) {
      alert("At least one gallery image is required!");
      return;
    }

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

    onSubmitProduct(productData);
    reset();
    setSpecs([{ name: "", value: "" }]);
    setMainImage("");
    setGalleryImages([]);
  };

  return (
    <div className="space-y-6">
      <form id="addProductForm" onSubmit={handleSubmit(onSubmit)}>
        <FormHeading />
        <div className="flex gap-6 mt-10">
          {/* LEFT SIDE */}
          <div className="w-7/12">
            <Card className="p-6 space-y-6 shadow-sm border">
              <h4 className="text-xl font-semibold">Product Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input {...register("name", { required: true })} placeholder="Enter product name" />
                </div>

                <div>
                  <Label>Brand *</Label>
                  <Input {...register("brand", { required: true })} placeholder="Enter brand name" />
                </div>

                <div>
                  <Label>Category *</Label>
                  <Select onValueChange={(v) => setValue("category", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Desktop">Desktop</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Sub Category *</Label>
                  <Select onValueChange={(v) => setValue("subcategory", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Office">Office</SelectItem>
                      <SelectItem value="Budget">Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Currency *</Label>
                  <Select onValueChange={(v) => setValue("currency", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BDT">BDT</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EURO</SelectItem>
                      <SelectItem value="SAR">REAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Price *</Label>
                  <Input type="number" step="0.01" {...register("price", { required: true })} />
                </div>

                <div>
                  <Label>Discount Price *</Label>
                  <Input type="number" step="0.01" {...register("discount_price", { required: true })} />
                </div>

                <div>
                  <Label>Stock Quantity *</Label>
                  <Input type="number" {...register("stock", { required: true })} />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea {...register("description")} placeholder="Enter detailed product description" />
              </div>
            </Card>

            {/* Specifications */}
            <Card className="p-6 mt-6 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Specifications</h4>
                <Button type="button" onClick={addSpec}>
                  + Add Spec
                </Button>
              </div>
              <div className="space-y-3">
                {specs.map((spec, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                    <Input
                      placeholder="Key (e.g. Processor)"
                      value={spec.name}
                      onChange={(e) => handleSpecChange(index, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Value (e.g. Intel i5)"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpec(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-5/12 space-y-6">
            {/* Main Image */}
            <Card className="p-6 shadow-sm border space-y-4">
              <h4 className="text-xl font-semibold">Main Image</h4>
              <label
                htmlFor="mainImageUpload"
                className="w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/40 transition"
              >
                <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {uploading ? "Uploading..." : "Click to upload main image"}
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
                <div className="relative group rounded-lg overflow-hidden">
                  <img src={mainImage} alt="Main" className="w-full h-40 object-cover rounded-md border" />
                  <button
                    type="button"
                    onClick={() => setMainImage("")}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="text-white w-6 h-6" />
                  </button>
                </div>
              )}
            </Card>

            {/* Gallery Images */}
            <Card className="p-6 shadow-sm border space-y-4">
              <h4 className="text-xl font-semibold">Gallery Images</h4>
              <label
                htmlFor="galleryUpload"
                className="w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/40 transition"
              >
                <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {uploading ? "Uploading..." : "Click to upload gallery images"}
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
                  <div key={idx} className="relative group rounded-lg overflow-hidden">
                    <img src={url} alt="Gallery" className="w-full h-28 object-cover rounded-md border" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(url)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="text-white w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;