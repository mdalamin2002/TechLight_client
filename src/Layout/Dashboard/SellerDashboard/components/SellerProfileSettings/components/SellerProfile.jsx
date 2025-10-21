// SellerProfile.jsx
import React from "react";

const SellerProfile = ({ profile, setProfile, handleLogoUpload, handleProfileUpdate }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Seller Profile Settings</h2>

      {/* Logo Upload */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
          {profile.logo ? (
            <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              Logo
            </div>
          )}
        </div>
        <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Upload Logo
          <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </label>
      </div>

      {/* Profile Inputs */}
      <div className="space-y-3">
        <input
          type="text"
          value={profile.sellerName}
          onChange={(e) => setProfile({ ...profile, sellerName: e.target.value })}
          placeholder="Seller Name"
          className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="text"
          value={profile.storeName}
          onChange={(e) => setProfile({ ...profile, storeName: e.target.value })}
          placeholder="Store Name"
          className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Email"
          className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="tel"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          placeholder="Phone"
          className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="text"
          value={profile.address}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          placeholder="Address"
          className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleProfileUpdate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default SellerProfile;
