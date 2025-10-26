import React, { useState } from "react";
import { Star, ThumbsUp, Edit2, Trash2, X, Check, TrendingUp, Award, ShieldCheck, User, Calendar, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import useReviews from "@/hooks/useReviews";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";

const Reviews = ({ product }) => {
  const { user } = useAuth();
  console.log("User data:", user);
  console.log("User displayName:", user?.displayName);
  console.log("User email:", user?.email);

  const {
    reviews,
    reviewsStats,
    userReview,
    isLoading,
    isError,
    isLoadingUserReview,
    isCreating,
    isUpdating,
    isDeleting,
    isMarkingHelpful,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
  } = useReviews(product?._id);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: ""
  });

  // Calculate average rating from API data
  const averageRating = reviewsStats?.averageRating || product?.rating || 0;
  const totalReviews = reviewsStats?.totalReviews || reviews?.length || 0;
  const ratingDistribution = reviewsStats?.ratingDistribution || [];

  const handleSubmitReview = () => {
    if (!user?.email) {
      toast.warning("Please login first to write a review!");
      return;
    }

    if (!newReview.title || !newReview.comment) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newReview.comment.length < 20) {
      toast.error("Review must be at least 20 characters long");
      return;
    }

    if (editingReview) {
      console.log("Updating review:", editingReview._id);
      console.log("Update data:", newReview);

      updateReview(
        { reviewId: editingReview._id, ...newReview },
        {
          onSuccess: () => {
            toast.success("Review updated successfully!");
            setEditingReview(null);
            setNewReview({ rating: 5, title: "", comment: "" });
            setShowReviewForm(false);
          },
          onError: (error) => {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Failed to update review");
          }
        }
      );
    } else {
      createReview(newReview, {
        onSuccess: () => {
          toast.success("Review submitted successfully!");
          setNewReview({ rating: 5, title: "", comment: "" });
          setShowReviewForm(false);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to submit review");
        }
      });
    }
  };

  const handleEditReview = (review) => {
    console.log("Editing review:", review);
    console.log("Current user:", user?.email);
    console.log("Review user email:", review.userEmail);

    setEditingReview(review);
    setNewReview({
      rating: review.rating,
      title: review.title,
      comment: review.comment
    });
    setShowReviewForm(true);
  };

  const handleDeleteReview = (reviewId) => {
    console.log("Deleting review ID:", reviewId);
    console.log("Current user:", user?.email);

    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview(reviewId, {
        onSuccess: () => {
          toast.success("Review deleted successfully!");
        },
        onError: (error) => {
          console.error("Delete error:", error);
          toast.error(error.response?.data?.message || "Failed to delete review");
        }
      });
    }
  };

  const handleHelpful = (reviewId, reviewUserEmail, helpfulUsers) => {
    // Check if user is trying to like their own review
    if (reviewUserEmail === user?.email) {
      toast.warning("You cannot like your own review!");
      return;
    }

    // Check if user already liked this review
    if (helpfulUsers && helpfulUsers.includes(user?.email)) {
      toast.warning("You have already liked this review!");
      return;
    }

    markHelpful(reviewId, {
      onSuccess: () => {
        toast.success("Thank you for your feedback!");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to mark as helpful");
      }
    });
  };

  const cancelEdit = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    setNewReview({ rating: 5, title: "", comment: "" });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-2xl border border-border/50 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-2xl border border-border/50 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Reviews</h3>
          <p className="text-muted-foreground mb-4">There was an error loading the reviews. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Review Header with Stats */}
      <div className="bg-gradient-to-br from-card via-card to-muted/30 rounded-2xl border border-border/50 p-8 shadow-lg">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Average Rating Section */}
          <div className="text-center lg:border-r border-border/50">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 mb-4">
              <div className="text-4xl font-bold bg-gradient-to-br from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                {averageRating}
              </div>
            </div>
            <div className="flex items-center justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {totalReviews} Customer Reviews
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round(averageRating * 100 / 5)}% Satisfaction
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-foreground">Rating Breakdown</h4>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Trending Positive
                </span>
              </div>
            </div>

            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3 group">
                <div className="flex items-center gap-1.5 w-16">
                  <span className="text-sm font-medium text-foreground">{star}</span>
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500 group-hover:from-yellow-500 group-hover:to-yellow-600"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 w-16">
                  <span className="text-sm font-medium text-foreground">{count}</span>
                  <span className="text-xs text-muted-foreground">({Math.round(percentage)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-xl font-bold text-foreground">
                {reviews.filter(r => r.rating >= 4).length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Positive Reviews</p>
          </div>
          <div className="text-center border-x border-border/50">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xl font-bold text-foreground">
                {reviews.filter(r => r.verified).length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Verified Buyers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ThumbsUp className="w-4 h-4 text-primary" />
              <span className="text-xl font-bold text-foreground">
                {reviews.reduce((acc, r) => acc + (r.helpful || 0), 0)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Helpful Votes</p>
          </div>
        </div>

        {/* Write Review Button */}
        {!showReviewForm && (
          <div className="mt-6 text-center">
            {user?.email ? (
              userReview ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">You have already reviewed this product</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEditReview(userReview)}
                      className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Edit Your Review
                    </button>
                    <button
                      onClick={() => handleDeleteReview(userReview._id)}
                      className="px-4 py-2 bg-red-500/10 text-red-500 text-sm font-medium rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      Delete Review
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                >
                  Write Your Review
                </button>
              )
            ) : (
              <p className="text-sm text-muted-foreground">Please login to write a review</p>
            )}
          </div>
        )}
      </div>

      {/* Modern Review Form */}
      {showReviewForm && (
        <div className="bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-foreground">
                  {editingReview ? "Edit Your Review" : "Share Your Experience"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Help others make informed decisions
                </p>
              </div>
              <button
                onClick={cancelEdit}
                className="p-2 hover:bg-muted rounded-lg transition"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Rating Selector */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Your Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="transition-all duration-200 hover:scale-125"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= newReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted hover:text-yellow-400/50"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 self-center text-sm font-medium text-foreground">
                  {newReview.rating === 5 ? "Excellent!" :
                   newReview.rating === 4 ? "Good" :
                   newReview.rating === 3 ? "Average" :
                   newReview.rating === 2 ? "Below Average" : "Poor"}
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                placeholder="Summarize your experience in one line"
                className="w-full px-4 py-3 bg-background border border-border/70 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Detailed Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your thoughts about the product's quality, features, and overall experience..."
                rows="5"
                className="w-full px-4 py-3 bg-background border border-border/70 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Minimum 20 characters ({newReview.comment.length}/20)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={cancelEdit}
                className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={!newReview.title || newReview.comment.length < 20 || isCreating || isUpdating}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                <Check className="w-4 h-4" />
                {editingReview ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-semibold text-foreground">Customer Reviews</h4>
          <select className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none">
            <option>Most Helpful</option>
            <option>Most Recent</option>
            <option>Highest Rating</option>
            <option>Lowest Rating</option>
          </select>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-base font-semibold text-foreground mb-2">
                No Reviews Yet
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Be the first to share your experience with this product!
              </p>
              {user?.email && !userReview && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Write a Review
                </button>
              )}
            </div>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* User Avatar */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                    {review.userPhotoURL ? (
                      <img
                        src={review.userPhotoURL}
                        alt={review.userName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm ${review.userPhotoURL ? 'hidden' : 'flex'}`}
                    >
                      {review.userName?.split(' ').map(n => n[0]).join('') || <User className="w-6 h-6" />}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-foreground">{review.userName}</h5>
                      {review.verified && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit/Delete for own reviews */}
                {review.userEmail === user?.email && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="p-2 hover:bg-primary/10 rounded-lg transition"
                      title="Edit review"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                )}
              </div>

              {/* Review Content */}
              <h6 className="font-semibold text-foreground mb-2 text-base">{review.title}</h6>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {review.comment}
              </p>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <button
                  onClick={() => handleHelpful(review._id, review.userEmail, review.helpfulUsers)}
                  disabled={isMarkingHelpful || review.userEmail === user?.email || (review.helpfulUsers && review.helpfulUsers.includes(user?.email))}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition group/btn disabled:opacity-50 ${
                    review.userEmail === user?.email || (review.helpfulUsers && review.helpfulUsers.includes(user?.email))
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title={
                    review.userEmail === user?.email
                      ? "You cannot like your own review"
                      : (review.helpfulUsers && review.helpfulUsers.includes(user?.email))
                      ? "You have already liked this review"
                      : "Mark as helpful"
                  }
                >
                  <ThumbsUp className={`w-4 h-4 transition ${
                    review.userEmail === user?.email || (review.helpfulUsers && review.helpfulUsers.includes(user?.email))
                      ? "text-muted-foreground"
                      : "group-hover/btn:text-primary"
                  }`} />
                  <span className="font-medium">Helpful ({review.helpful || 0})</span>
                </button>

                <span className="text-xs text-muted-foreground">
                  {review.userEmail === user?.email ? "Your review" : "Was this review helpful to you?"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
