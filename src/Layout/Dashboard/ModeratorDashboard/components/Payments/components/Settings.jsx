import React, { useState } from "react";
import { UploadCloud, Plus, X } from "lucide-react";

export default function Settings() {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    subcategory: "",
    currency: "",
    price: "",
    discountPrice: "",
    stock: "",
    description: "",
  });

  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [mainImage, setMainImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [gallery, setGallery] = useState([]); // array of { file, url }

  // --- Form handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const addSpec = () => setSpecs((s) => [...s, { key: "", value: "" }]);
  const removeSpec = (i) => setSpecs((s) => s.filter((_, idx) => idx !== i));
  const updateSpec = (i, field, val) => {
    setSpecs((s) => s.map((spec, idx) => (idx === i ? { ...spec, [field]: val } : spec)));
  };

  // --- Image handlers ---
  const onMainImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainImageFile(file);
    setMainImage(URL.createObjectURL(file));
  };

  const onGallery = (e) => {
    const files = Array.from(e.target.files || []);
    const items = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setGallery((g) => [...g, ...items]);
  };

  const removeGallery = (i) => setGallery((g) => g.filter((_, idx) => idx !== i));

  // --- Simple validation & submit ---
  const validate = () => {
    if (!form.name.trim()) return "Product name required";
    if (!form.category) return "Category required";
    if (!form.price) return "Price required";
    return null;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    // Build FormData for backend upload
    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("brand", form.brand);
    payload.append("category", form.category);
    payload.append("subcategory", form.subcategory);
    payload.append("currency", form.currency);
    payload.append("price", form.price);
    payload.append("discountPrice", form.discountPrice);
    payload.append("stock", form.stock);
    payload.append("description", form.description);

    specs.forEach((s, i) => {
      if (s.key || s.value) payload.append(`specs[${i}]`, JSON.stringify(s));
    });

    if (mainImageFile) payload.append("mainImage", mainImageFile);
    gallery.forEach((g, i) => payload.append(`gallery[${i}]`, g.file));

    // TODO: send payload to your backend (fetch/axios)
    // fetch('/api/products', { method: 'POST', body: payload })...
    alert("Form prepared. Implement API call to submit product.");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Add New Product</h1>
          <div className="flex gap-3">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-lg border border-gray-200"
            >
              Back
            </button>
            <button
              onClick={onSubmit}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Save Product
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: fields & specs */}
          <div className="lg:col-span-2 space-y-6">
            <section className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <h2 className="font-medium mb-4">Product Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product Name *"
                  className="px-3 py-2 rounded-lg border border-gray-300 w-full"
                />

                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Brand"
                  className="px-3 py-2 rounded-lg border border-gray-300 w-full"
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-lg border border-gray-300 w-full"
                >
                  <option value="">Select Category *</option>
                  <option value="smartphone">Smartphones</option>
                  <option value="headphone">Headphones</option>
                  <option value="accessory">Accessories</option>
                </select>

                <input
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  placeholder="Sub Category"
                  className="px-3 py-2 rounded-lg border border-gray-300 w-full"
                />

                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-lg border border-gray-300 w-full"
                >
                  <option value="">Currency</option>
                  <option value="USD">USD</option>
                  <option value="BDT">BDT</option>
                </select>

                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price *"
                  type="number"
                  className="px-3 py-2 rounded-lg border border-gray-300 w-full"
                />

                <input
                  name="discountPrice"
                  value={form.discountPrice}
                  onChange={handleChange}
                  placeholder="Discount Price"
                  type="number"
                  className="px-3 py-2 rounded-lg border border-gray-300 w-full"
                />

                <input
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock Quantity"
                  type="number"
                  className="px-3 py-2 rounded-lg border border-gray-300 w-full"
                />
              </div>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Detailed description"
                className="mt-4 px-3 py-2 rounded-lg border border-gray-300 w-full h-28"
              />
            </section>

            {/* specifications */}
            <section className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-medium">Specifications</h2>
                <button
                  type="button"
                  onClick={addSpec}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md border bg-white text-sm"
                >
                  <Plus size={14} /> Add Spec
                </button>
              </div>

              <div className="space-y-2">
                {specs.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={s.key}
                      onChange={(e) => updateSpec(i, "key", e.target.value)}
                      placeholder="Key (e.g. Processor)"
                      className="px-3 py-2 rounded-lg border border-gray-300 flex-1"
                    />
                    <input
                      value={s.value}
                      onChange={(e) => updateSpec(i, "value", e.target.value)}
                      placeholder="Value (e.g. Intel i5)"
                      className="px-3 py-2 rounded-lg border border-gray-300 flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(i)}
                      className="px-2 rounded-md text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: images + preview */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <h3 className="font-medium mb-3">Main Image</h3>
              <label className="block cursor-pointer border-2 border-dashed rounded-lg p-3 text-center">
                {mainImage ? (
                  <img src={mainImage} alt="main" className="w-full h-44 object-cover rounded-md" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <UploadCloud />
                    <span>Click to upload main image</span>
                  </div>
                )}
                <input accept="image/*" type="file" onChange={onMainImage} className="hidden" />
              </label>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
              <h3 className="font-medium mb-3">Gallery Images</h3>
              <label className="block cursor-pointer border-2 border-dashed rounded-lg p-3 text-center">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <UploadCloud />
                  <span>Click to upload gallery images</span>
                </div>
                <input accept="image/*" type="file" multiple onChange={onGallery} className="hidden" />
              </label>

              <div className="grid grid-cols-3 gap-2 mt-3">
                {gallery.map((g, i) => (
                  <div key={i} className="relative">
                    <img src={g.url} alt={`g${i}`} className="w-full h-20 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => removeGallery(i)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Live preview card */}
            <div className="p-4 rounded-xl border border-gray-200 bg-white">
              <h3 className="font-medium mb-2">Live Preview</h3>
              <div className="flex flex-col items-start gap-2">
                <div className="w-full bg-gray-100 rounded-md h-36 flex items-center justify-center overflow-hidden">
                  {mainImage ? (
                    <img src={mainImage} alt="preview-main" className="object-contain h-full" />
                  ) : (
                    <span className="text-sm text-gray-400">Main image preview</span>
                  )}
                </div>

                <div className="w-full">
                  <h4 className="font-semibold">{form.name || "Product title"}</h4>
                  <p className="text-sm text-gray-500">{form.brand || "Brand"}</p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <div className="font-bold">{form.price ? `${form.currency ? form.currency + ' ' : ''}${form.price}` : "Price"}</div>
                    {form.discountPrice && (
                      <div className="text-sm line-through text-gray-400">{form.discountPrice}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
