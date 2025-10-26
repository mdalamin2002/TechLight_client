import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "@/utils/useAxiosSecure";

const useReviews = (productId) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get all reviews for a product
  const {
    data: reviewsData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/product/${productId}`);
      return res.data;
    },
    enabled: !!productId,
  });

  // Get user's review for a product
  const {
    data: userReview,
    isLoading: isLoadingUserReview
  } = useQuery({
    queryKey: ["userReview", productId, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/user/${productId}`);
      return res.data;
    },
    enabled: !!productId && !!user?.email,
  });

  // Create a new review
  const { mutate: createReview, isPending: isCreating } = useMutation({
    mutationFn: async (reviewData) => {
      const res = await axiosSecure.post("/reviews", {
        ...reviewData,
        productId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", productId]);
      queryClient.invalidateQueries(["userReview", productId, user?.email]);
    },
  });

  // Update a review
  const { mutate: updateReview, isPending: isUpdating } = useMutation({
    mutationFn: async ({ reviewId, ...updateData }) => {
      const res = await axiosSecure.patch(`/reviews/${reviewId}`, updateData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", productId]);
      queryClient.invalidateQueries(["userReview", productId, user?.email]);
    },
  });

  // Delete a review
  const { mutate: deleteReview, isPending: isDeleting } = useMutation({
    mutationFn: async (reviewId) => {
      const res = await axiosSecure.delete(`/reviews/${reviewId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", productId]);
      queryClient.invalidateQueries(["userReview", productId, user?.email]);
    },
  });

  // Mark review as helpful
  const { mutate: markHelpful, isPending: isMarkingHelpful } = useMutation({
    mutationFn: async (reviewId) => {
      const res = await axiosSecure.patch(`/reviews/${reviewId}/helpful`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", productId]);
    },
  });

  return {
    // Data
    reviews: reviewsData?.data?.reviews || [],
    reviewsStats: reviewsData?.data?.stats || {},
    pagination: reviewsData?.data?.pagination || {},
    userReview: userReview?.data,

    // Loading states
    isLoading,
    isError,
    isLoadingUserReview,
    isCreating,
    isUpdating,
    isDeleting,
    isMarkingHelpful,

    // Actions
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    refetch,
  };
};

export default useReviews;
