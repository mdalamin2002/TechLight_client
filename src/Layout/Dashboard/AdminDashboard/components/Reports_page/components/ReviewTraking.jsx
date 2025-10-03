import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const ReviewTraking = ({ dateRange }) => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);

  const itemsPerPage = 5;

  // Load data from JSON file
  useEffect(() => {
    fetch("/ReviewTracking_Data.json")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error loading reviews:", err));
  }, []);

  // Filter by Date
  const filterByDate = () => {
    const now = new Date();
    let startDate;

    switch (dateRange) {
      case "Last 7 Days":
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;
      case "Last 30 Days":
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
        break;
      case "Last 6 Months":
        startDate = new Date();
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "Last 1 Year":
        startDate = new Date();
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date("2000-01-01");
    }

    return reviews.filter((r) => {
      const reviewDate = new Date(r.date);
      return reviewDate >= startDate && reviewDate <= now;
    });
  };

  // Filtered data (date + search)
  const filteredData = filterByDate().filter(
    (r) =>
      r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rating.toString().includes(searchTerm)
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Metrics
  const totalReviews = filteredData.length;
  const avgRating =
    totalReviews > 0
      ? (
          filteredData.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        ).toFixed(1)
      : 0;
  const positivePercent = (
    (filteredData.filter((r) => r.rating >= 4).length / totalReviews) *
      100 || 0
  ).toFixed(1);
  const negativePercent = (
    (filteredData.filter((r) => r.rating <= 2).length / totalReviews) *
      100 || 0
  ).toFixed(1);

  // Chart Data
  const ratingCounts = [1, 2, 3, 4, 5].map(
    (rating) => filteredData.filter((r) => r.rating === rating).length
  );

  const chartData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Reviews",
        data: ratingCounts,
        backgroundColor: ["#F87171", "#FBBF24", "#60A5FA", "#34D399", "#10B981"],
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Review Tracking ({dateRange})
      </h3>

      {/* Search + Export */}
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by user, product, or rating..."
          className="w-full md:w-1/2 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <CSVLink
          data={filteredData}
          filename="review-tracking.csv"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
        >
          Export CSV
        </CSVLink>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500 font-medium">Total Reviews</p>
          <p className="text-2xl font-bold text-gray-800">{totalReviews}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-blue-700 font-medium">Avg Rating</p>
          <p className="text-2xl font-bold text-blue-800">{avgRating}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-green-700 font-medium">Positive %</p>
          <p className="text-2xl font-bold text-green-800">{positivePercent}%</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-red-700 font-medium">Negative %</p>
          <p className="text-2xl font-bold text-red-800">{negativePercent}%</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-gray-600 font-medium">Review ID</th>
              <th className="p-4 text-gray-600 font-medium">User</th>
              <th className="p-4 text-gray-600 font-medium">Product</th>
              <th className="p-4 text-gray-600 font-medium">Rating</th>
              <th className="p-4 text-gray-600 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No reviews found.
                </td>
              </tr>
            ) : (
              paginatedData.map((r, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedReview(r)}
                >
                  <td className="p-4 text-gray-800 font-medium">{r.id}</td>
                  <td className="p-4 text-gray-700">{r.user}</td>
                  <td className="p-4 text-gray-700">{r.product}</td>
                  <td className="p-4 text-yellow-600 font-bold">{r.rating}★</td>
                  <td className="p-4 text-gray-500">{r.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 border rounded-lg hover:bg-gray-100"
        >
          Prev
        </button>
        <span className="text-gray-700">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 border rounded-lg hover:bg-gray-100"
        >
          Next
        </button>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h4 className="text-gray-700 font-semibold mb-2">
          Rating Distribution
        </h4>
        <Bar
          data={chartData}
          options={{ responsive: true, plugins: { legend: { position: "top" } } }}
        />
      </div>

      {/* Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setSelectedReview(null)}
            >
              ✕
            </button>
            <h4 className="text-lg font-semibold mb-2">Review Details</h4>
            <p><span className="font-medium">Review ID:</span> {selectedReview.id}</p>
            <p><span className="font-medium">User:</span> {selectedReview.user}</p>
            <p><span className="font-medium">Product:</span> {selectedReview.product}</p>
            <p><span className="font-medium">Rating:</span> {selectedReview.rating}★</p>
            <p><span className="font-medium">Date:</span> {selectedReview.date}</p>
            <p className="mt-2"><span className="font-medium">Comment:</span> {selectedReview.comment}</p>
          </div>
        </div>
      )}
    </div>
  );
};
