// SellerSettings.jsx
import React, { useState } from "react";
import SellerProfile from "./components/SellerProfile";

const SellerSettings = () => {
  const [profile, setProfile] = useState({
    sellerName: "John Doe",
    storeName: "Light Dev Store",
    email: "johndoe@example.com",
    phone: "+880123456789",
    address: "Dhaka, Bangladesh",
    logo: null, // Logo file or URL
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileUpdate = () => {
    alert("Profile updated successfully!");
    // এখানে API call যাবে
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert("Please fill all fields!");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
    // API call for password change
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, logo: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Profile Section */}
      <SellerProfile
        profile={profile}
        setProfile={setProfile}
        handleLogoUpload={handleLogoUpload}
        handleProfileUpdate={handleProfileUpdate}
      />

      {/* Change Password Section */}
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handlePasswordChange}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerSettings;
