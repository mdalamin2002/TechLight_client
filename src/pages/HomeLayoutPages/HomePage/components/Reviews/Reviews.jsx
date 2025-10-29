import React, { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import ReviewCard from "./ReviewCard";
import useAxiosSecure from "@/utils/useAxiosSecure";
import GlobalLoading from "@/Components/Shared/Loading/GlobalLoading";
import { toast } from "react-toastify";

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const axiosSecure = useAxiosSecure();

  const getReviewsPerView = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [reviewsPerView, setReviewsPerView] = useState(getReviewsPerView());
  const maxIndex = Math.max(0, reviews.length - reviewsPerView);

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return "Recently";
    const now = new Date();
    const reviewDate = new Date(date);
    const diffInMs = now - reviewDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  // Fetch all approved reviews from database
  const fetchReviews = async () => {
    setLoading(true);
    try {
      console.log("Fetching reviews from API...");
      const response = await axiosSecure.get("/reviews/homepage?limit=12");
      console.log("API Response:", response.data);
      const apiReviews = response.data.data || [];
      console.log("API Reviews:", apiReviews);

      // Transform API data to match component format
      const transformedReviews = apiReviews.map(review => ({
        id: review._id,
        name: review.userName || "Anonymous",
        role: "Customer",
        avatar: review.userPhotoURL || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 20) + 1}`,
        rating: review.rating,
        date: formatDate(review.createdAt),
        review: review.comment || review.title || "Great product!",
        product: review.productName || "Product",
        verified: review.verified || true,
        helpful: review.helpful || 0,
      }));

      console.log("Transformed Reviews:", transformedReviews);
      setReviews(transformedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Load reviews when component mounts
  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setReviewsPerView(getReviewsPerView());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlay || isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlay, isDragging, maxIndex]);

  const nextSlide = () => {
    if (currentIndex < maxIndex) setCurrentIndex((prev) => prev + 1);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    setIsAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    setIsAutoPlay(false);
    const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(translateX) > 50) {
      if (translateX > 0 && currentIndex > 0) setCurrentIndex((prev) => prev - 1);
      else if (translateX < 0 && currentIndex < maxIndex)
        setCurrentIndex((prev) => prev + 1);
    }
    setTranslateX(0);
  };

  const cardWidth = 100 / reviewsPerView;
  const translateValue = isDragging
    ? -(currentIndex * cardWidth) +
      (translateX / (containerRef.current?.offsetWidth || 1)) * 100
    : -(currentIndex * cardWidth);

  return (
    <section className="relative section bg-gradient-to-b from-background via-muted/20 to-background  overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Customer Reviews
            </span>
          </div>
          <h2 className="text-foreground mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real experiences from real customers who love our electronic gadgets
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <GlobalLoading />
          </div>
        )}

        {/* Slider */}
        {!loading && (
          <div className="relative container mx-auto">
            {/* Navigation */}
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-card border-2 border-border rounded-full flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6 text-foreground group-hover:text-white" />
            </button>

            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-card border-2 border-border rounded-full flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6 text-foreground group-hover:text-white" />
            </button>

            {/* Slides */}
            <div className="overflow-hidden px-2" ref={containerRef}>
              <div
                className="flex gap-6 transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing"
                style={{ transform: `translateX(${translateValue}%)` }}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex-shrink-0 py-10"
                      style={{
                        width: `calc(${cardWidth}% - ${
                          ((reviewsPerView - 1) * 24) / reviewsPerView
                        }px)`,
                      }}
                    >
                      <ReviewCard review={review} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      No reviews available yet. Be the first to review our products!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Dots */}
            {reviews.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {[...Array(maxIndex + 1)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? "w-8 h-3 bg-gradient-to-r from-primary to-blue-600"
                        : "w-3 h-3 bg-border hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
