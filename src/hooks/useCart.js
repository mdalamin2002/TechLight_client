import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "@/utils/useAxiosSecure";


const useCart = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();


  // Get all cart items for logged-in user
  const { data: cart = [], isLoading } = useQuery({
    queryKey: ["cart", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/cart?email=${user.email}`);
      return res.data;
    },
  });

  // Add to cart
  const { mutate: addToCart, isPending: adding } = useMutation({
    mutationFn: async (cartData) => {
      const res = await axiosSecure.post("/cart", cartData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", user?.email]);
    },
  });

  // Remove item from cart
  const { mutate: removeFromCart, isPending: removing } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/cart/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", user?.email]);
    },
  });

  // Update quantity (increase/decrease)
  const { mutate: updateQuantity, isPending: updating } = useMutation({
    mutationFn: async ({ id, action }) => {
      const res = await axiosSecure.patch(`/cart/${id}`, { action });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", user?.email]);
    },
  });

  // Clear entire cart (after successful payment)
  const { mutate: clearCart, isPending: clearing } = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.delete(`/cart/clear?email=${user.email}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", user?.email]);
    },
  });

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    adding,
    removing,
    updating,
    clearing,
  };
};

export default useCart;
