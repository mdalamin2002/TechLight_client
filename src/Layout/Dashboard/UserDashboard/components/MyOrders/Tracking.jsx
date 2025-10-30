import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  Box,
  AlertCircle,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosSecure from "@/utils/useAxiosSecure";
import { toast } from "react-toastify";

const Tracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [toastShown, setToastShown] = useState(false);

  // Get order ID from location state if available
  useEffect(() => {
    if (location.state?.orderId) {
      setTrackingCode(location.state.orderId);
      // Auto-track if we have an order ID
      setTimeout(() => {
        handleTrack(location.state.orderId);
      }, 500);
    }
  }, [location.state]);

  const handleTrack = async (code = trackingCode) => {
    if (!code.trim()) {
      toast.error("Please enter an order ID");
      return;
    }

    setLoading(true);
    setToastShown(false); // Reset toast flag
    try {
      // Fetch order details directly by order ID
      const response = await axiosSecure.get(`/payments/details/order/${code}`);
      
      if (response.data) {
        // Transform the real data into the format expected by the UI
        const transformedData = transformOrderData(response.data, code);
        setTrackingData(transformedData);
        setOrderDetails(response.data);
        if (!toastShown) {
          toast.success("Order details loaded successfully");
          setToastShown(true);
        }
      } else {
        setTrackingData(null);
        setOrderDetails(null);
        if (!toastShown) {
          toast.error("Order not found. Please check the order ID and try again.");
          setToastShown(true);
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setTrackingData(null);
      setOrderDetails(null);
      if (!toastShown) {
        toast.error("Failed to load order details. Please try again.");
        setToastShown(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Transform real order data into tracking format
  const transformOrderData = (orderData, orderId) => {
    // Determine status and timeline based on order data
    const status = orderData.status || "processing";
    const createdAt = new Date(orderData.createdAt);
    
    // Generate timeline based on order status
    const timeline = generateTimeline(status, createdAt, orderData);
    
    return {
      trackingId: orderData.tran_id || orderId,
      orderId: orderId,
      courierName: "TechLight Logistics",
      status: status.charAt(0).toUpperCase() + status.slice(1),
      estimatedDelivery: getEstimatedDelivery(status, createdAt),
      timeline: timeline
    };
  };

  // Generate timeline based on order status
  const generateTimeline = (status, createdAt, orderData) => {
    const timeline = [
      {
        id: 1,
        title: "Order Processed",
        description: "Your order has been confirmed and is being prepared",
        location: "TechLight Fulfillment Center",
        dateTime: formatDate(createdAt),
        completed: true,
      }
    ];

    const shippedDate = new Date(createdAt);
    shippedDate.setDate(shippedDate.getDate() + 1);
    
    if (status === "processing" || status === "shipped" || status === "success") {
      timeline.push({
        id: 2,
        title: "Package Shipped",
        description: "Your package has left our facility and is on its way",
        location: "TechLight Distribution Center",
        dateTime: formatDate(shippedDate),
        completed: true,
      });
    }

    const inTransitDate = new Date(shippedDate);
    inTransitDate.setDate(inTransitDate.getDate() + 2);
    
    if (status === "shipped" || status === "success") {
      timeline.push({
        id: 3,
        title: "In Transit",
        description: "Package is traveling to the destination city",
        location: "Regional Distribution Hub",
        dateTime: formatDate(inTransitDate),
        completed: true,
      });
    }

    const outForDeliveryDate = new Date(inTransitDate);
    outForDeliveryDate.setDate(outForDeliveryDate.getDate() + 1);
    
    if (status === "shipped" || status === "success") {
      timeline.push({
        id: 4,
        title: "Out for Delivery",
        description: "Package is loaded on delivery vehicle",
        location: "Local Delivery Facility",
        dateTime: formatDate(outForDeliveryDate),
        completed: status === "success",
        current: status === "shipped"
      });
    }

    const deliveredDate = new Date(outForDeliveryDate);
    deliveredDate.setDate(deliveredDate.getDate() + 1);
    
    if (status === "success") {
      timeline.push({
        id: 5,
        title: "Delivered",
        description: "Package has been delivered successfully",
        location: orderData.customer?.address || "Customer's Address",
        dateTime: formatDate(deliveredDate),
        completed: true,
        current: true
      });
    } else if (status === "shipped") {
      timeline.push({
        id: 5,
        title: "Delivered",
        description: "Package will be delivered soon",
        location: orderData.customer?.address || "Customer's Address",
        dateTime: "Expected " + formatDate(deliveredDate),
        completed: false
      });
    }

    return timeline;
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get estimated delivery date
  const getEstimatedDelivery = (status, createdAt) => {
    const estimatedDate = new Date(createdAt);
    estimatedDate.setDate(estimatedDate.getDate() + 5);
    
    if (status === "success") {
      return "Delivered on " + formatDate(estimatedDate);
    }
    
    return "Expected by " + formatDate(estimatedDate);
  };

  const getStatusIcon = (step, isCompleted, isCurrent) => {
    if (isCompleted) {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    }
    if (isCurrent) {
      return (
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      );
    }
    return (
      <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
    );
  };

  const getStepIcon = (title) => {
    switch (title) {
      case "Order Processed":
        return <Box className="w-5 h-5" />;
      case "Package Shipped":
        return <Package className="w-5 h-5" />;
      case "In Transit":
        return <Truck className="w-5 h-5" />;
      case "Out for Delivery":
        return <Truck className="w-5 h-5" />;
      case "Delivered":
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-background min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>
        <h1 className="text-2xl font-bold text-foreground">Order Tracking</h1>
        <div></div> {/* Spacer for alignment */}
      </div>

      {/* Search Section */}
      <div className="mx-auto mb-8">
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter Order ID (e.g., ORD-876132)"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition"
              />
              <Package className="absolute right-3 top-3.5 w-5 h-5 text-muted-foreground" />
            </div>
            <button
              onClick={() => handleTrack()}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tracking Results */}
      {trackingData && (
        <div className="mx-auto">
          {/* Package Summary */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-foreground text-xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Tracking ID</p>
                  <p className="text-foreground font-semibold">
                    #{trackingData.trackingId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Box className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Order ID</p>
                  <p className="text-foreground font-semibold">
                    #{trackingData.orderId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Courier</p>
                  <p className="text-foreground font-semibold">
                    {trackingData.courierName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-lg ${
                    trackingData.status === "Success"
                      ? "bg-green-100"
                      : trackingData.status === "Shipped"
                      ? "bg-blue-100"
                      : trackingData.status === "Processing"
                      ? "bg-yellow-100"
                      : "bg-orange-100"
                  }`}
                >
                  {trackingData.status === "Success" ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : trackingData.status === "Shipped" ? (
                    <Truck className="w-6 h-6 text-blue-600" />
                  ) : trackingData.status === "Processing" ? (
                    <Clock className="w-6 h-6 text-yellow-600" />
                  ) : (
                    <Clock className="w-6 h-6 text-orange-600" />
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <p
                    className={`font-semibold ${
                      trackingData.status === "Success"
                        ? "text-green-600"
                        : trackingData.status === "Shipped"
                        ? "text-blue-600"
                        : trackingData.status === "Processing"
                        ? "text-yellow-600"
                        : "text-orange-600"
                    }`}
                  >
                    {trackingData.status}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:col-span-2 lg:col-span-2">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Estimated Delivery
                  </p>
                  <p className="text-foreground font-semibold">
                    {trackingData.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Timeline */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-4 sm:p-6">
            <h2 className="text-foreground text-xl font-semibold mb-6">
              Shipping Timeline
            </h2>

            <div className="relative overflow-x-auto md:overflow-x-visible">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 w-0.5 h-full bg-border hidden md:block"></div>

              {/* Timeline Steps */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {trackingData.timeline.map((step) => (
                  <div
                    key={step.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 relative"
                  >
                    {/* Step Icon */}
                    <div className="flex-shrink-0 flex flex-col items-center mt-1 sm:mt-0">
                      {getStatusIcon(step, step.completed, step.current)}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-3 sm:p-4 md:p-6 relative border border-border">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className={`p-1 sm:p-2 rounded-lg ${
                                step.completed
                                  ? "bg-green-100"
                                  : step.current
                                  ? "bg-blue-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              <div
                                className={`${
                                  step.completed
                                    ? "text-green-600"
                                    : step.current
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {getStepIcon(step.title)}
                              </div>
                            </div>
                            <h3
                              className={`font-semibold text-sm sm:text-base md:text-lg ${
                                step.completed
                                  ? "text-green-600"
                                  : step.current
                                  ? "text-blue-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {step.title}
                            </h3>
                          </div>

                          <div className="text-right mt-1 sm:mt-0">
                            <p className="text-muted-foreground text-xs sm:text-sm">
                              {step.dateTime}
                            </p>
                          </div>
                        </div>

                        <p className="text-foreground text-sm sm:text-base mb-1 sm:mb-3">
                          {step.description}
                        </p>

                        <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-sm">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{step.location}</span>
                        </div>

                        {step.current && (
                          <div className="absolute -left-1 sm:-left-2 top-4 sm:top-6 w-0 h-0 border-t-6 sm:border-t-8 border-b-6 sm:border-b-8 border-r-6 sm:border-r-8 border-transparent border-r-muted"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No results state */}
      {!trackingData && !loading && trackingCode && (
        <div className="mx-auto text-center">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-foreground text-xl font-semibold mb-2">
              No tracking information found
            </h3>
            <p className="text-muted-foreground">
              Please check your order ID and try again. Make sure you've
              entered the correct order number.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;