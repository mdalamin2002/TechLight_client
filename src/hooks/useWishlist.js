import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";

const useWishlist = () => {
  const axiosSecure = useAxiosPublic();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get all wishlist items
  const { data: wishlist = [], isLoading } = useQuery({
  queryKey: ["wishlist", user?.email],
  queryFn: async () => {
    const res = await axiosSecure.get(`/api/wishlist?userEmail=${user?.email}`);
    return res.data;
  },
});

  // Add to wishlist
  const { mutate: addToWishlist, isPending: adding } = useMutation({
    mutationFn: async (wishlistData) => {
      const res = await axiosSecure.post("/api/wishlist", wishlistData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
  });

  // Remove from wishlist
  const { mutate: removeFromWishlist, isPending: removing } = useMutation({
    mutationFn: async (id) => {
      console.log("Deleting wishlist item:", id);
      const res = await axiosSecure.delete(`/api/wishlist/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
  });

  return { wishlist, isLoading, addToWishlist, removeFromWishlist, adding, removing };
};

export default useWishlist;
