import useAxiosSecure from "@/utils/useAxiosSecure";
import React, { useState } from "react";
// import useAxiosSecure from "@/hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const AddBannerOffer = () => {
  const axiosSecure = useAxiosSecure();
  const [banner, setBanner] = useState({
    title: "",
    subtitle: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBanner((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.post("/banners", banner);
      toast.success("Banner added successfully!");
      setBanner({ title: "", subtitle: "", image: "" });
    } catch (error) {
      toast.error("Failed to add banner!");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Banner Offer</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          value={banner.title}
          onChange={handleChange}
          placeholder="Banner Title"
          className="border p-2 rounded-md"
          required
        />
        <input
          name="subtitle"
          value={banner.subtitle}
          onChange={handleChange}
          placeholder="Subtitle (Offer Text)"
          className="border p-2 rounded-md"
          required
        />
        <input
          name="image"
          value={banner.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="border p-2 rounded-md"
          required
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Add Banner
        </button>
      </form>
    </div>
  );
};

export default AddBannerOffer;
