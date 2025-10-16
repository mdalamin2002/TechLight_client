import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "@/utils/useAxiosSecure";

const useWishlist = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get all wishlist items
  const { data: wishlist = [], isLoading } = useQuery({
  queryKey: ["wishlist", user?.email],
  queryFn: async () => {
    const res = await axiosSecure.get(`/wishlist?userEmail=${user?.email}`);
    return res.data;
  },
});

  // Add to wishlist
  const { mutate: addToWishlist, isPending: adding } = useMutation({
    mutationFn: async (wishlistData) => {
      const res = await axiosSecure.post("/wishlist", wishlistData);
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
      const res = await axiosSecure.delete(`/wishlist/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
  });

  return { wishlist, isLoading, addToWishlist, removeFromWishlist, adding, removing };
};

export default useWishlist;
