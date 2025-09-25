import React from "react";
import { CheckCircle, Clock, XCircle, Ban, Star, Search } from "lucide-react";

const Sellers = () => {
  const sellers = [
    { name: "Tech Store Pro", email: "tech@example.com", status: "Approved", sales: 245, rating: 4.8 },
    { name: "Fashion Hub", email: "fashion@example.com", status: "Pending", sales: 0, rating: null },
    { name: "Electronics World", email: "electronics@example.com", status: "Approved", sales: 189, rating: 4.6 },
    { name: "Home & Garden", email: "home@example.com", status: "Rejected", sales: 0, rating: null },
    { name: "Sports Central", email: "sports@example.com", status: "Blocked", sales: 67, rating: 3.2 },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Seller Management</h2>
        <p className="text-sm text-gray-500">
          Manage seller applications and monitor seller performance.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex items-center rounded-lg px-3 py-2 w-full md:w-1/2 bg-card mb-6">
        <Search className="w-5 h-5 mr-2 " />
        <input
          type="text"
          placeholder="Search sellers by name or email..."
          className="w-full"
        />
      </div>

      {/* Seller Table */}
      <div className="overflow-x-auto rounded-xl border  shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-700 bg-black/10">
            <tr>
              <th className="py-3 px-4">Seller</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Sales</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((sl, i) => (
              <tr key={i} className="border-b ">
                {/* Seller */}
                <td className="py-3 px-4">
                  <div className="font-medium">{sl.name}</div>
                  <div className="text-xs ">{sl.email}</div>
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {sl.status === "Approved" && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {sl.status === "Pending" && <Clock className="w-4 h-4 text-yellow-400" />}
                    {sl.status === "Rejected" && <XCircle className="w-4 h-4 text-red-500" />}
                    {sl.status === "Blocked" && <Ban className="w-4 h-4 text-red-600" />}
                    <span
                      className={`text-sm font-medium ${
                        sl.status === "Approved"
                          ? "text-green-500"
                          : sl.status === "Pending"
                          ? "text-yellow-400"
                          : "text-red-500"
                      }`}
                    >
                      {sl.status}
                    </span>
                  </div>
                </td>

                {/* Sales */}
                <td className="py-3 px-4">{sl.sales}</td>

                {/* Rating */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    {sl.rating ? (
                      <>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        {sl.rating}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    {sl.status === "Pending" && (
                      <>
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                          Reject
                        </button>
                      </>
                    )}
                    {sl.status === "Approved" && (
                      <button className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                        Block
                      </button>
                    )}
                    <button className="px-3 py-1 bg-gray-700 text-white rounded text-xs hover:bg-gray-600">
                      ...
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sellers;
