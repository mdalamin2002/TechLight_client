import React, { useState, useEffect } from "react";
import { Send, Upload } from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";

const Support = () => {
  const axiosSecure = useAxiosSecure();
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    description: "",
    attachment: null,
    contact: "",
    priority: "Normal",
  });

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  // 🧾 Fetch support history (with localStorage cache)
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // প্রথমে localStorage থেকে data আনছি
        const cachedTickets = localStorage.getItem("supportTickets");
        console.log("Tickets data:", cachedTickets);
        if (cachedTickets) {
          try {
            const parsedTickets = JSON.parse(cachedTickets);
            // Ensure parsed data is an array
            const safeTickets = Array.isArray(parsedTickets) ? parsedTickets : [];
            setTickets(safeTickets);
            // background এ fresh data fetch করব
            refreshTickets();
          } catch (parseError) {
            console.error("❌ Error parsing cached tickets:", parseError);
            // Clear corrupted cache and fetch fresh data
            localStorage.removeItem("supportTickets");
            await refreshTickets();
          }
        } else {
          await refreshTickets();
        }
      } catch (error) {
        console.error("❌ Failed to fetch tickets:", error);
      }
    };

    // Fresh data আনার function
    const refreshTickets = async () => {
      try {
        const res = await axiosSecure.get("/support/user");
        // Ensure data is always an array
        const safeData = Array.isArray(res.data) ? res.data : [];
        setTickets(safeData);
        localStorage.setItem("supportTickets", JSON.stringify(safeData)); // cache এ save করছি
      } catch (err) {
        console.error("❌ Error fetching tickets:", err);
        // Set empty array on error to prevent crashes
        setTickets([]);
        localStorage.setItem("supportTickets", JSON.stringify([]));
      }
    };

    fetchTickets();
  }, [axiosSecure]);

  // 🧠 Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🖼️ Upload to ImgBB
  const uploadToImgBB = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: formDataImg,
      }
    );
    const data = await res.json();
    if (data.success) return data.data.url;
    throw new Error("❌ Image upload failed!");
  };

  // 🚀 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let attachmentUrl = null;
      if (formData.attachment) {
        attachmentUrl = await uploadToImgBB(formData.attachment);
      }

      const data = {
        subject: formData.subject,
        category: formData.category,
        description: formData.description,
        contact: formData.contact,
        priority: formData.priority,
        attachment: attachmentUrl,
      };

      const res = await axiosSecure.post("/support/user", data);
      if (res.data.success) {
        alert("✅ Ticket submitted successfully!");
        const newTicket = res.data.ticket;

        // UI ও localStorage দুই জায়গাতেই নতুন data সংরক্ষণ করছি
        const currentTickets = Array.isArray(tickets) ? tickets : [];
        const updatedTickets = [newTicket, ...currentTickets];
        setTickets(updatedTickets);
        localStorage.setItem("supportTickets", JSON.stringify(updatedTickets));

        // form reset
        setFormData({
          subject: "",
          category: "",
          description: "",
          attachment: null,
          contact: "",
          priority: "Normal",
        });
      }
    } catch (error) {
      console.error("❌ Failed to submit ticket:", error);
      alert("❌ Failed to submit ticket!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Support Ticket Form
      </h2>

      {/* 🧾 Support Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow-md"
      >
        {/* Subject */}
        <div className="md:col-span-2">
          <label className="font-semibold">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your issue subject"
          />
        </div>

        {/* Category */}
        <div>
          <label className="font-semibold">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="">Select Category</option>
            <option>Payment</option>
            <option>Order</option>
            <option>Technical</option>
            <option>Refund</option>
            <option>Other</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="font-semibold">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option>Normal</option>
            <option>Urgent</option>
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Write your issue in detail..."
            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Attachment */}
        <div>
          <label className="font-semibold">Attachment (optional)</label>
          <div className="flex items-center mt-1 border p-2 rounded-md">
            <Upload className="mr-2 text-gray-600" />
            <input
              type="file"
              name="attachment"
              onChange={handleChange}
              className="text-sm"
            />
          </div>
        </div>

        {/* Contact */}
        <div>
          <label className="font-semibold">Contact Info</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Enter email or phone"
            required
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            <Send size={18} /> {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>
      </form>

      {/* 🕓 Support History */}
      <h3 className="text-xl font-semibold mt-8 mb-3">
        Latest Support History
      </h3>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Ticket ID</th>
              <th className="px-4 py-2 border">Subject</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Priority</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tickets) && tickets.length > 0 ? (
              tickets.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{t.ticketId}</td>
                  <td className="px-4 py-2 border">{t.subject}</td>
                  <td className="px-4 py-2 border">{t.category}</td>
                  <td className="px-4 py-2 border">{t.priority}</td>
                  <td className="px-4 py-2 border text-blue-600 font-medium">
                    {t.status}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-3 text-gray-500">
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Support;
