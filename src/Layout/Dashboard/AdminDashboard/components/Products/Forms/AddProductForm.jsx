import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Card } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { X, Upload } from "lucide-react";
import FormHeading from "./FormHeading";

const AddProductForm = ({ onSubmitProduct }) => {
  const [images, setImages] = useState([]);
  const [specs, setSpecs] = useState([{ name: "", value: "" }]);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

  //Upload to Cloudinary
  const uploadToCloudinary = async (files) => {
    const uploadedURLs = [];
    setUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_Upload_preset);
      formData.append("cloud_name", import.meta.env.VITE_Cloud_name);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_Cloud_name}/image/upload`,
        formData
      );
      uploadedURLs.push(res.data.secure_url);
    }

    setUploading(false);
    return uploadedURLs;
  };

  //Handle image select
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const urls = await uploadToCloudinary(files);
    setImages((prev) => [...prev, ...urls]);
  };

  // Remove uploaded image
  const removeImage = (url) => {
    setImages(images.filter((img) => img !== url));
  };

  //Specification logic
  const addSpec = () => setSpecs([...specs, { name: "", value: "" }]);
  const removeSpec = (i) => setSpecs(specs.filter((_, index) => index !== i));
  const handleSpecChange = (i, field, value) => {
    const updated = [...specs];
    updated[i][field] = value;
    setSpecs(updated);
  };

  //Final Submit Handler
  const onSubmit = (data) => {
    const productData = {
      ...data,
      specifications: specs,
      images,
    };
    onSubmitProduct(productData);
    reset();
    setImages([]);
  };

  return (
    <div className="space-y-6">
      <form id="addProductForm" onSubmit={handleSubmit(onSubmit)}>
        <FormHeading></FormHeading>
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
                  <Label>Price ($)</Label>
                  <Input type="number" step="0.01" {...register("price", { required: true })} />
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
                <Button className="cursor-pointer" type="button" onClick={addSpec}>
                  + Add Spec
                </Button>
              </div>
              <div className="space-y-3">
                {specs.map((spec, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                    <Input
                      placeholder="Specification name"
                      value={spec.name}
                      onChange={(e) => handleSpecChange(index, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                    />
                    <Button className="cursor-pointer" type="button" variant="ghost" size="icon" onClick={() => removeSpec(index)}>
                      <X className="w-4 h-4 cursor-pointer" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-5/12">
            <Card className="p-6 shadow-sm border space-y-4">
              <h4 className="text-xl font-semibold">Product Images</h4>
              <label
                htmlFor="imageUpload"
                className="w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/40 transition">
                <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {uploading ? "Uploading..." : "Click to upload images"}
                </span>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>

              {/* Image previews */}
              <div className="grid grid-cols-2 gap-3">
                {images.map((url, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden">
                    <img src={url} alt="Uploaded" className="w-full h-28 object-cover rounded-md border" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
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
