import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,

  Settings,
  
} from "lucide-react";
import useAxiosSecure from "@/utils/useAxiosSecure";
import Swal from "sweetalert2";

const Returns = () => {
  const axiosSecure = useAxiosSecure();
  const [showReturns, setShowReturns] = useState(true);
  const [showComplaints, setShowComplaints] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("en");
  const [returns, setReturns] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [newReason, setNewReason] = useState("");
  const [sectionType, setSectionType] = useState("returns");
  const [activeMenu, setActiveMenu] = useState(null); // for dropdown toggle

  const translations = {
    en: {
      title: "Return & Complaint Reasons",
      description:
        "Manage reasons customers can choose when returning or complaining about items.",
      addButton: "Add Reason",
      returns: "Returns",
      complaints: "Complaints",
      noData: "No reasons found",
      edit: "Edit",
      delete: "Delete",
    },
    bn: {
      title: "রিটার্ন ও অভিযোগের কারণসমূহ",
      description:
        "গ্রাহকরা রিটার্ন বা অভিযোগ করার সময় যেসব কারণ বেছে নিতে পারেন, সেগুলো পরিচালনা করুন।",
      addButton: "কারণ যোগ করুন",
      returns: "রিটার্ন",
      complaints: "অভিযোগ",
      noData: "কোনও কারণ পাওয়া যায়নি",
      edit: "সম্পাদনা",
      delete: "মুছে ফেলুন",
    },
  };

  const t = translations[language];

  //  Load reasons from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosSecure.get("/returns");
        const data = res.data;
        setReturns(data.filter((r) => r.type === "returns"));
        setComplaints(data.filter((r) => r.type === "complaints"));
      } catch (err) {
        console.error("Error fetching returns:", err);
      }
    };
    fetchData();
  }, []);

  //  Add new reason
  const handleAddReason = async () => {
    if (!newReason.trim()) return;
    const newItem = {
      id: Date.now(),
      title: newReason,
      restock: "Restocked",
      type: sectionType,
    };
    try {
      await axiosSecure.post("/returns", newItem);
      if (sectionType === "returns") setReturns([...returns, newItem]);
      else setComplaints([...complaints, newItem]);
      setNewReason("");

      Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Reason added successfully ",
      showConfirmButton: false,
      timer: 1500,
    });


    } catch (err) {
      console.error("Error adding reason:", err);
    }
  };

  //  Delete reason
  const handleDelete = async (id, type) => {
    try {
      await axiosSecure.delete(`returns/${id}`);
      if (type === "returns")
        setReturns(returns.filter((r) => r.id !== id));
      else setComplaints(complaints.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting reason:", err);
    }
  };

  //  Filter by search
  const filterData = (data) =>
    data.filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()));

  //  Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-menu") && !e.target.closest(".settings-btn")) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {t.title}
        </h2>
        <select
          className="border rounded-md px-3 py-1 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
        </select>
      </div>

      <p className="text-gray-500 text-sm mb-4">{t.description}</p>

      {/* Add reason */}
      <div className="flex gap-2 mb-6">
        <select
          className="border rounded-md px-2 py-2 text-sm text-gray-700"
          value={sectionType}
          onChange={(e) => setSectionType(e.target.value)}
        >
          <option value="returns">{t.returns}</option>
          <option value="complaints">{t.complaints}</option>
        </select>
        <input
          type="text"
          placeholder="Write reason..."
          className="border rounded-md flex-1 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
        />
        <button
          onClick={handleAddReason}
          className="bg-blue-500 text-white text-sm px-3 py-2 rounded-md flex items-center gap-1 hover:bg-blue-600"
        >
           {t.addButton}
        </button>
      </div>

      {/* Returns Section */}
      <Section
        title={t.returns}
        show={showReturns}
        toggle={() => setShowReturns(!showReturns)}
        data={filterData(returns)}
        type="returns"
        onDelete={handleDelete}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        t={t}
      />

      {/* Complaints Section */}
      <Section
        title={t.complaints}
        show={showComplaints}
        toggle={() => setShowComplaints(!showComplaints)}
        data={filterData(complaints)}
        type="complaints"
        onDelete={handleDelete}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        t={t}
      />
    </div>
  );
};

// 🔹 Section Component
const Section = ({
  title,
  show,
  toggle,
  data,
  type,
  onDelete,
  activeMenu,
  setActiveMenu,
  t,
}) => (
  <div className="border rounded-lg mb-6 relative">
    <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b">
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <button onClick={toggle} className="text-sm text-blue-600 flex items-center gap-1">
        {show ? (
          <>
            Hide <ChevronUp size={16} />
          </>
        ) : (
          <>
            Show <ChevronDown size={16} />
          </>
        )}
      </button>
    </div>

    {show && (
      <table className="w-full text-sm relative">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="text-left px-4 py-2 font-medium">Reason</th>
            <th className="text-right px-4 py-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50 relative">
                <td className="px-4 py-2">{r.title}</td>
                <td className="px-4 py-2 text-right relative">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === r.id ? null : r.id)
                    }
                    className="settings-btn text-gray-600 hover:text-gray-800"
                  >
                    <Settings size={16} />
                  </button>

                  {activeMenu === r.id && (
                    <div className="dropdown-menu absolute right-4 mt-2 bg-white border rounded-lg shadow-md z-50 w-40">
                      <button
                        onClick={() => onDelete(r.id, type)}
                        className="flex w-full text-left px-3 py-2 text-sm hover:bg-indigo-50  "
                      >
                         {t.delete}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center py-3 text-gray-400">
                {t.noData}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>
);

export default Returns;
