import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";


const useWishlist = () => {
  const axiosSecure = useAxiosPublic();
  const queryClient = useQueryClient();

  const { mutate: addToWishlist, isPending: adding } = useMutation({
    mutationFn: async (wishlistData) => {
      const res = await axiosSecure.post("/api/wishlist", wishlistData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
  });

  const { mutate: removeFromWishlist, isPending: removing } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/api/wishlist/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
  });

  return { addToWishlist, removeFromWishlist, adding, removing };
};

export default useWishlist;
