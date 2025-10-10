import React, { useState } from "react";

const ModeratorSettings = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert(`Profile updated!\nName: ${profile.name}\nEmail: ${profile.email}`);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert("New password and confirm password do not match!");
      return;
    }
    alert("Password changed successfully!");
    setPassword({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Moderator Settings</h1>

      {/* Profile Update */}
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Profile</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
              placeholder="Current password"
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={password.new}
              onChange={(e) => setPassword({ ...password, new: e.target.value })}
              placeholder="New password"
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
              placeholder="Confirm new password"
              className="w-full border border-black rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModeratorSettings;
