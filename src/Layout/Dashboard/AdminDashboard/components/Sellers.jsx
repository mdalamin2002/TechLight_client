import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  Star,
  Search,
  MoreVertical,
  Eye,
  UserX,
  UserCheck,
  TrendingUp,
  Users,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Sellers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sellers, setSellers] = useState([
    {
      id: 1,
      name: "Tech Store Pro",
      email: "tech@example.com",
      status: "Approved",
      sales: 245,
      rating: 4.8,
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Fashion Hub",
      email: "fashion@example.com",
      status: "Pending",
      sales: 0,
      rating: null,
      joinDate: "2024-10-10",
    },
    {
      id: 3,
      name: "Electronics World",
      email: "electronics@example.com",
      status: "Approved",
      sales: 189,
      rating: 4.6,
      joinDate: "2024-02-20",
    },
    {
      id: 4,
      name: "Home & Garden",
      email: "home@example.com",
      status: "Rejected",
      sales: 0,
      rating: null,
      joinDate: "2024-09-05",
    },
    {
      id: 5,
      name: "Sports Central",
      email: "sports@example.com",
      status: "Blocked",
      sales: 67,
      rating: 3.2,
      joinDate: "2024-03-12",
    },
    {
      id: 6,
      name: "Book Paradise",
      email: "books@example.com",
      status: "Approved",
      sales: 312,
      rating: 4.9,
      joinDate: "2024-01-08",
    },
    {
      id: 7,
      name: "Beauty Essentials",
      email: "beauty@example.com",
      status: "Pending",
      sales: 0,
      rating: null,
      joinDate: "2024-10-11",
    },
  ]);

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: sellers.length,
    pending: sellers.filter((s) => s.status === "Pending").length,
    approved: sellers.filter((s) => s.status === "Approved").length,
    totalSales: sellers.reduce((acc, s) => acc + s.sales, 0),
  };

  // Status Update Functions
  const handleApprove = async (seller) => {
    const result = await Swal.fire({
      title: "Approve Seller?",
      html: `Are you sure you want to approve <strong>${seller.name}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setSellers((prev) =>
        prev.map((s) => (s.id === seller.id ? { ...s, status: "Approved" } : s))
      );
      toast.success(`${seller.name} has been approved successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleReject = async (seller) => {
    const result = await Swal.fire({
      title: "Reject Seller?",
      html: `Are you sure you want to reject <strong>${seller.name}</strong>?<br/><small>This action can be reversed later.</small>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
      input: "textarea",
      inputPlaceholder: "Reason for rejection (optional)...",
      inputAttributes: {
        "aria-label": "Type your rejection reason here",
      },
    });

    if (result.isConfirmed) {
      setSellers((prev) =>
        prev.map((s) => (s.id === seller.id ? { ...s, status: "Rejected" } : s))
      );
      toast.error(`${seller.name} has been rejected.`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleBlock = async (seller) => {
    const result = await Swal.fire({
      title: "Block Seller?",
      html: `Are you sure you want to block <strong>${seller.name}</strong>?<br/><small class="text-red-500">They will not be able to sell on the platform.</small>`,
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Block",
      cancelButtonText: "Cancel",
      input: "textarea",
      inputPlaceholder: "Reason for blocking (required)...",
      inputValidator: (value) => {
        if (!value) {
          return "You need to provide a reason for blocking!";
        }
      },
    });

    if (result.isConfirmed) {
      setSellers((prev) =>
        prev.map((s) => (s.id === seller.id ? { ...s, status: "Blocked" } : s))
      );
      toast.error(`${seller.name} has been blocked.`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleUnblock = async (seller) => {
    const result = await Swal.fire({
      title: "Unblock Seller?",
      html: `Do you want to unblock <strong>${seller.name}</strong>?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Unblock",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setSellers((prev) =>
        prev.map((s) => (s.id === seller.id ? { ...s, status: "Approved" } : s))
      );
      toast.success(`${seller.name} has been unblocked!`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (seller) => {
    const result = await Swal.fire({
      title: "Delete Seller?",
      html: `Are you sure you want to permanently delete <strong>${seller.name}</strong>?<br/><small class="text-red-600">This action cannot be undone!</small>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      showDenyButton: true,
      denyButtonText: "Archive Instead",
      denyButtonColor: "#f59e0b",
    });

    if (result.isConfirmed) {
      setSellers((prev) => prev.filter((s) => s.id !== seller.id));
      toast.success(`${seller.name} has been deleted permanently.`, {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (result.isDenied) {
      toast.info(`${seller.name} has been archived.`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleViewDetails = (seller) => {
    Swal.fire({
      title: seller.name,
      html: `
        <div class="text-left space-y-2">
          <p><strong>Email:</strong> ${seller.email}</p>
          <p><strong>Status:</strong> <span class="font-semibold ${
            seller.status === "Approved"
              ? "text-green-600"
              : seller.status === "Pending"
              ? "text-amber-600"
              : "text-red-600"
          }">${seller.status}</span></p>
          <p><strong>Total Sales:</strong> ${seller.sales}</p>
          <p><strong>Rating:</strong> ${
            seller.rating ? seller.rating + " " : "N/A"
          }</p>
          <p><strong>Join Date:</strong> ${new Date(
            seller.joinDate
          ).toLocaleDateString()}</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Close",
      confirmButtonColor: "#0071e3",
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "Approved":
        return {
          color: "text-green-700  bg-green-50  border-green-200 ",
          icon: <CheckCircle className="w-3.5 h-3.5" />,
        };
      case "Pending":
        return {
          color: "text-amber-700  bg-amber-50  border-amber-200 ",
          icon: <Clock className="w-3.5 h-3.5" />,
        };
      case "Rejected":
        return {
          color: "text-red-700 border-red-200",
          icon: <XCircle className="w-3.5 h-3.5" />,
        };
      case "Blocked":
        return {
          color: "text-rose-700 border-rose-200 ",
          icon: <Ban className="w-3.5 h-3.5" />,
        };
      default:
        return {
          color: "text-muted-foreground bg-muted border-border",
          icon: null,
        };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-2 lg:p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Seller Management</h1>
          <p className="text-muted-foreground">
            Manage seller applications and monitor seller performance across
            your marketplace.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Sellers */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Total
              </span>
            </div>
            <h2 className="text-foreground mb-1">{stats.total}</h2>
            <p className="text-xs text-muted-foreground">Active Sellers</p>
          </div>

          {/* Pending */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Review
              </span>
            </div>
            <h2 className="text-amber-600 dark:text-amber-500 mb-1">
              {stats.pending}
            </h2>
            <p className="text-xs text-muted-foreground">Pending Approval</p>
          </div>

          {/* Approved */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Active
              </span>
            </div>
            <h2 className="text-green-600 dark:text-green-500 mb-1">
              {stats.approved}
            </h2>
            <p className="text-xs text-muted-foreground">Approved Sellers</p>
          </div>

          {/* Total Sales */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                Revenue
              </span>
            </div>
            <h2 className="text-blue-600 dark:text-blue-500 mb-1">
              {stats.totalSales}
            </h2>
            <p className="text-xs text-muted-foreground">Total Sales</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search sellers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                    Seller
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                    Sales
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">
                    Rating
                  </th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSellers.length > 0 ? (
                  filteredSellers.map((seller) => {
                    const statusConfig = getStatusConfig(seller.status);
                    return (
                      <tr
                        key={seller.id}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        {/* Seller Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold text-sm">
                              {seller.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground text-sm">
                                {seller.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {seller.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.color}`}
                          >
                            {statusConfig.icon}
                            <span>{seller.status}</span>
                          </div>
                        </td>

                        {/* Sales */}
                        <td className="py-4 px-6">
                          <span className="font-semibold text-foreground text-sm">
                            {seller.sales.toLocaleString()}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="py-4 px-6">
                          {seller.rating ? (
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="font-semibold text-foreground text-sm">
                                {seller.rating}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              N/A
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div className="flex justify-end items-center gap-2">
                            {seller.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(seller)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-all hover:scale-105"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(seller)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-all hover:scale-105"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  Reject
                                </button>
                              </>
                            )}
                            {seller.status === "Approved" && (
                              <>
                                <button
                                  onClick={() => handleViewDetails(seller)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/70 text-foreground rounded-lg text-xs font-medium transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View
                                </button>
                                <button
                                  onClick={() => handleBlock(seller)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-all hover:scale-105"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  Block
                                </button>
                              </>
                            )}
                            {seller.status === "Rejected" && (
                              <>
                                <button
                                  onClick={() => handleViewDetails(seller)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/70 text-foreground rounded-lg text-xs font-medium transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View
                                </button>
                                <button
                                  onClick={() => handleApprove(seller)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-all hover:scale-105"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  Approve
                                </button>
                              </>
                            )}
                            {seller.status === "Blocked" && (
                              <>
                                <button
                                  onClick={() => handleViewDetails(seller)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/70 text-foreground rounded-lg text-xs font-medium transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View
                                </button>
                                <button
                                  onClick={() => handleUnblock(seller)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-all hover:scale-105"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Unblock
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(seller)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors group"
                              title="Delete seller"
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-12 h-12 text-muted-foreground/40" />
                        <p className="text-muted-foreground font-medium">
                          No sellers found
                        </p>
                        <p className="text-sm text-muted-foreground/70">
                          Try adjusting your search criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sellers;
