import React, { useEffect, useState } from "react";
import { Bar } from "recharts";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useAxiosSecure from "@/utils/useAxiosSecure";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const ReviewTraking = ({ dateRange, onDataUpdate }) => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  const itemsPerPage = 5;

  // Load real data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch reviews and products
        const [reviewsRes, productsRes] = await Promise.all([
          axiosSecure.get('/reviews/homepage?limit=100'),
          axiosSecure.get('/products/admin/all?all=true')
        ]);

        setReviews(reviewsRes.data.data || []);
        setProducts(productsRes.data.data || []);
      } catch (err) {
        console.error("Error loading reviews:", err);
        setError("Failed to load review data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create product map for quick lookup
  const productMap = {};
  products.forEach(product => {
    productMap[product._id] = product;
  });

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
      const reviewDate = new Date(r.createdAt);
      return reviewDate >= startDate && reviewDate <= now;
    });
  };

  // Filtered data (date + search)
  const filteredData = filterByDate().filter(
    (r) =>
      (r.userName && r.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.productName && r.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
    (filteredData.filter((r) => r.rating >= 4).length / totalReviews) * 100 || 0
  ).toFixed(1);
  const negativePercent = (
    (filteredData.filter((r) => r.rating <= 2).length / totalReviews) * 100 || 0
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
        backgroundColor: [
          "#F87171",
          "#FBBF24",
          "#60A5FA",
          "#34D399",
          "#10B981",
        ],
      },
    ],
  };

  // 🟩 Send data back to parent for Excel export
  useEffect(() => {
    if (!onDataUpdate) return;

    const timer = setTimeout(() => {
      onDataUpdate({
        reviews: filteredData,
        summary: {
          totalReviews,
          avgRating,
          positivePercent,
          negativePercent,
        },
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [filteredData, onDataUpdate, totalReviews, avgRating, positivePercent, negativePercent]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <div className="text-red-600 font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background via-background to-primary/5 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Review Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor customer feedback and product ratings
          </p>
          {dateRange && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 w-fit mt-4">
              <span className="text-sm font-medium text-primary">{dateRange}</span>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by user, product, or rating..."
            className="w-full md:w-1/2 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-card text-foreground border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Reviews</p>
            <p className="text-2xl font-bold text-foreground">{totalReviews}</p>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <p className="text-muted-foreground text-sm font-medium mb-1">Avg Rating</p>
            <p className="text-2xl font-bold text-foreground">{avgRating}</p>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <p className="text-muted-foreground text-sm font-medium mb-1">Positive %</p>
            <p className="text-2xl font-bold text-foreground text-green-600">
              {positivePercent}%
            </p>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm">
            <p className="text-muted-foreground text-sm font-medium mb-1">Negative %</p>
            <p className="text-2xl font-bold text-foreground text-red-600">
              {negativePercent}%
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-blue-50 border-b border-border/30 px-6 py-4">
            <h2 className="text-lg font-bold text-foreground">Review Details</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
                  <th className="p-4 text-left font-bold">User</th>
                  <th className="p-4 text-left font-bold">Product</th>
                  <th className="p-4 text-center font-bold">Rating</th>
                  <th className="p-4 text-left font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((r, index) => (
                    <tr
                      key={r._id}
                      className={`
                        border-b border-border/30 transition-colors cursor-pointer
                        ${index % 2 === 0
                          ? "bg-white hover:bg-primary/5"
                          : "bg-muted/30 hover:bg-primary/5"
                        }
                      `}
                      onClick={() => setSelectedReview(r)}
                    >
                      <td className="p-4 text-foreground font-medium">
                        {r.userName || "Anonymous"}
                      </td>
                      <td className="p-4 text-foreground">
                        {r.productName || "Unknown Product"}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                          {r.rating}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition text-foreground border-border"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-foreground">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages || 1))}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition text-foreground border-border"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Chart */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Rating Distribution
          </h2>
          {filteredData.length > 0 ? (
            <div className="h-80">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.raw} reviews`
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              No data available for chart
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-card rounded-xl w-full max-w-md relative border border-border shadow-lg">
              <button
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl font-bold"
                onClick={() => setSelectedReview(null)}
              >
                ✕
              </button>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Review Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">User</p>
                    <p className="font-medium text-foreground">
                      {selectedReview.userName || "Anonymous"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Product</p>
                    <p className="font-medium text-foreground">
                      {selectedReview.productName || "Unknown Product"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="font-medium text-foreground">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold mr-2">
                        {selectedReview.rating}
                      </span>
                      {selectedReview.rating}/5
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedReview.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Comment</p>
                    <p className="font-medium text-foreground">
                      {selectedReview.comment || selectedReview.title || "No comment provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
