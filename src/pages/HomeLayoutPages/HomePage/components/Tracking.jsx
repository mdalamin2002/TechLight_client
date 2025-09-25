import React, { useState } from "react";
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
} from "lucide-react";

const Tracking = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Mock tracking data
  const mockTrackingData = {
    TRK123456789: {
      trackingId: "TRK123456789",
      orderId: "ORD-2024-001",
      courierName: "Express Shipping Co.",
      status: "Out for Delivery",
      estimatedDelivery: "Today by 6:00 PM",
      timeline: [
        {
          id: 1,
          title: "Order Processed",
          description: "Your order has been confirmed and is being prepared",
          location: "Fulfillment Center, New York",
          dateTime: "2024-01-15 09:30 AM",
          completed: true,
        },
        {
          id: 2,
          title: "Package Shipped",
          description: "Your package has left our facility and is on its way",
          location: "Fulfillment Center, New York",
          dateTime: "2024-01-15 02:45 PM",
          completed: true,
        },
        {
          id: 3,
          title: "In Transit",
          description: "Package is traveling to the destination city",
          location: "Distribution Hub, Philadelphia",
          dateTime: "2024-01-16 08:15 AM",
          completed: true,
        },
        {
          id: 4,
          title: "Out for Delivery",
          description: "Package is loaded on delivery vehicle",
          location: "Local Facility, Boston",
          dateTime: "2024-01-17 07:30 AM",
          completed: true,
          current: true,
        },
        {
          id: 5,
          title: "Delivered",
          description: "Package has been delivered successfully",
          location: "Customer's Address",
          dateTime: "Expected Today",
          completed: false,
        },
      ],
    },
    TRK987654321: {
      trackingId: "TRK987654321",
      orderId: "ORD-2024-002",
      courierName: "FastTrack Logistics",
      status: "Delivered",
      estimatedDelivery: "Delivered on Jan 16, 2024",
      timeline: [
        {
          id: 1,
          title: "Order Processed",
          description: "Your order has been confirmed and is being prepared",
          location: "Fulfillment Center, California",
          dateTime: "2024-01-14 11:15 AM",
          completed: true,
        },
        {
          id: 2,
          title: "Package Shipped",
          description: "Your package has left our facility and is on its way",
          location: "Fulfillment Center, California",
          dateTime: "2024-01-14 04:20 PM",
          completed: true,
        },
        {
          id: 3,
          title: "In Transit",
          description: "Package is traveling to the destination city",
          location: "Distribution Hub, Nevada",
          dateTime: "2024-01-15 10:30 AM",
          completed: true,
        },
        {
          id: 4,
          title: "Out for Delivery",
          description: "Package is loaded on delivery vehicle",
          location: "Local Facility, Los Angeles",
          dateTime: "2024-01-16 08:00 AM",
          completed: true,
        },
        {
          id: 5,
          title: "Delivered",
          description: "Package has been delivered successfully",
          location: "Customer's Address",
          dateTime: "2024-01-16 02:30 PM",
          completed: true,
          current: true,
        },
      ],
    },
  };

  const handleTrack = async () => {
    if (!trackingCode.trim()) {
      showErrorToast("Please enter a tracking code");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate API call delay
    setTimeout(() => {
      if (mockTrackingData[trackingCode.toUpperCase()]) {
        setTrackingData(mockTrackingData[trackingCode.toUpperCase()]);
        setError("");
      } else {
        setTrackingData(null);
        showErrorToast("Invalid Tracking Number. Please try again.");
      }
      setLoading(false);
    }, 1000);
  };

  const showErrorToast = (message) => {
    setError(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setError("");
    }, 4000);
  };

  const getStatusIcon = (step, isCompleted, isCurrent) => {
    if (isCompleted) {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    }
    if (isCurrent) {
      return (
        <div className="w-6 h-6 bg-custom-accent rounded-full pulse-animation flex items-center justify-center">
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
    <div className="bg-custom-background">
      {/* Toast Notification */}
      {showToast && error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="container mx-auto md:px-4 px-0 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2>Track Your Package</h2>
          <p className="text-custom-subtext text-lg max-w-2xl mx-auto">
            Enter your tracking code below to get real-time updates on your
            shipment and stay informed about your package's journey.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-custom-primary rounded-2xl shadow-lg p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Enter Tracking Code (e.g., TRK123456789)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                  className="w-full px-4 py-3 border border-custom-subtext rounded-lg custom-input text-custom-text bg-transparent"
                />
                <Package className="absolute right-3 top-3.5 w-5 h-5 text-custom-subtext" />
              </div>
              <button
                onClick={handleTrack}
                disabled={loading}
                className="bg-custom-accent hover:bg-[#3749BB] text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px]"
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

            {/* Demo codes */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-custom-subtext text-sm mb-2">
                Try demo tracking codes:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTrackingCode("TRK123456789")}
                  className="text-custom-accent hover:text-blue-600 text-sm px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                >
                  TRK123456789
                </button>
                <button
                  onClick={() => setTrackingCode("TRK987654321")}
                  className="text-custom-accent hover:text-blue-600 text-sm px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                >
                  TRK987654321
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="max-w-4xl mx-auto">
            {/* Package Summary */}
            <div className="bg-custom-primary rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-custom-text text-2xl font-semibold mb-6">
                Package Summary
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-custom-accent" />
                  </div>
                  <div>
                    <p className="text-custom-subtext text-sm">Tracking ID</p>
                    <p className="text-custom-text font-semibold">
                      #{trackingData.trackingId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Box className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-custom-subtext text-sm">Order ID</p>
                    <p className="text-custom-text font-semibold">
                      #{trackingData.orderId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Truck className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-custom-subtext text-sm">Courier</p>
                    <p className="text-custom-text font-semibold">
                      {trackingData.courierName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-lg ${
                      trackingData.status === "Delivered"
                        ? "bg-green-100"
                        : "bg-orange-100"
                    }`}
                  >
                    {trackingData.status === "Delivered" ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-custom-subtext text-sm">Status</p>
                    <p
                      className={`font-semibold ${
                        trackingData.status === "Delivered"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {trackingData.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:col-span-2 lg:col-span-2">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-custom-accent" />
                  </div>
                  <div>
                    <p className="text-custom-subtext text-sm">
                      Estimated Delivery
                    </p>
                    <p className="text-custom-text font-semibold">
                      {trackingData.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Timeline */}
            <div className="bg-custom-primary rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
              <h2 className="text-custom-text text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 md:mb-8">
                Shipping Timeline
              </h2>

              <div className="relative overflow-x-auto md:overflow-x-visible">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 w-0.5 h-full timeline-line hidden md:block"></div>

                {/* Timeline Steps */}
                <div className="space-y-4 sm:space-y-6 md:space-y-8 min-w-[300px]">
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
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 relative">
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
                                      ? "text-custom-accent"
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
                                    ? "text-custom-accent"
                                    : "text-gray-600"
                                }`}
                              >
                                {step.title}
                              </h3>
                            </div>

                            <div className="text-right mt-1 sm:mt-0">
                              <p className="text-custom-subtext text-xs sm:text-sm">
                                {step.dateTime}
                              </p>
                            </div>
                          </div>

                          <p className="text-custom-text text-sm sm:text-base mb-1 sm:mb-3">
                            {step.description}
                          </p>

                          <div className="flex items-center gap-1 sm:gap-2 text-custom-subtext text-xs sm:text-sm">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{step.location}</span>
                          </div>

                          {step.current && (
                            <div className="absolute -left-1 sm:-left-2 top-4 sm:top-6 w-0 h-0 border-t-6 sm:border-t-8 border-b-6 sm:border-b-8 border-r-6 sm:border-r-8 border-transparent border-r-gray-50"></div>
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
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-custom-primary rounded-2xl shadow-lg p-12">
              <Package className="w-16 h-16 text-custom-subtext mx-auto mb-4" />
              <h3 className="text-custom-text text-xl font-semibold mb-2">
                No tracking information found
              </h3>
              <p className="text-custom-subtext">
                Please check your tracking code and try again. Make sure you've
                entered the correct tracking number.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
