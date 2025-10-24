import React, { useEffect, useState } from "react";
import axios from "axios";

const Offers = () => {
  const [formData, setFormData] = useState({
    isHot: false,
    title: "",
    description: "",
    discount: "",
    originalPrice: "",
    bannerImage: "",
    shopName: "",
    createdAt: "",
  });

  const [offers, setOffers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false); // For modal popup

  // Fetch all offers
  const fetchOffers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_prod_baseURL}/offers`
      );
      setOffers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure discount ends with %
    let discountValue = formData.discount.trim();
    if (!discountValue.endsWith("%")) discountValue += "%";

    const dataToSend = { ...formData, discount: discountValue };

    try {
      if (editingId) {
        // Update offer
        await axios.put(
          `${import.meta.env.VITE_prod_baseURL}/offers/${editingId}`,
          dataToSend
        );

        alert("Offer updated successfully!");

        // Refresh offers from backend
        await fetchOffers();

        // Close modal and reset editing state
        setShowForm(false);
        setEditingId(null);
      } else {
        // Add new offer
        const res = await axios.post(
          `${import.meta.env.VITE_prod_baseURL}/offers`,
          dataToSend
        );
        alert("Offer added successfully!");

        // Refresh offers from backend
        await fetchOffers();

        setShowForm(false); // Close modal
      }

      // Reset form
      setFormData({
        isHot: false,
        title: "",
        description: "",
        discount: "",
        originalPrice: "",
        bannerImage: "",
        shopName: "",
        createdAt: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to submit offer");
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_prod_baseURL}/offers/${_id}`);
      fetchOffers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete offer");
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
      shopName: offer.shopName,
      createdAt: offer.createdAt ? offer.createdAt.split("T")[0] : "",
    });
    setShowForm(true);
    fetchOffers();
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      {/* Add New Offer Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition"
        >
          Add New Offer
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({
                  isHot: false,
                  title: "",
                  description: "",
                  discount: "",
                  originalPrice: "",
                  bannerImage: "",
                  shopName: "",
                  createdAt: "",
                });
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {editingId ? "Update Offer" : "Add New Offer"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hot Deal */}
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isHot"
                  checked={formData.isHot}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700 font-medium">Hot Deal</span>
              </label>

              <input
                type="text"
                name="title"
                placeholder="Offer Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                name="discount"
                placeholder="Discount (e.g., 18%)"
                value={formData.discount}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="number"
                name="originalPrice"
                placeholder="Original Price"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                name="bannerImage"
                placeholder="Banner Image URL"
                value={formData.bannerImage}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                name="shopName"
                placeholder="Shop Name"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="date"
                name="createdAt"
                value={formData.createdAt}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                {editingId ? "Update Offer" : "Submit Offer"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Offer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={offer.bannerImage}
              alt={offer.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              {offer.isHot && (
                <span className="inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold mb-2">
                  HOT DEAL
                </span>
              )}
              <h3 className="text-lg font-bold mb-1">{offer.title}</h3>
              <p className="text-gray-700 text-sm mb-2">{offer.description}</p>
              <div className="text-green-600 font-bold mb-2">
                ৳{offer.originalPrice} - {offer.discount} ={" "}
                {offer.discount
                  ? (
                      offer.originalPrice -
                      (offer.originalPrice * parseFloat(offer.discount)) / 100
                    ).toFixed(2)
                  : offer.originalPrice}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(offer)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(offer._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
