import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";


const useCart = () => {
  const axiosSecure = useAxiosPublic();
  const queryClient = useQueryClient();
  const { user } = useAuth();


  // Get all cart items for logged-in user
  const { data: cart = [], isLoading } = useQuery({
    queryKey: ["cart", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/cart?email=${user.email}`);
      return res.data;
    },
  });

  // Add to cart
  const { mutate: addToCart, isPending: adding } = useMutation({
    mutationFn: async (cartData) => {
      const res = await axiosSecure.post("/api/cart", cartData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", user?.email]);
    },
  });

  // Remove item from cart
  const { mutate: removeFromCart, isPending: removing } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/api/cart/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", user?.email]);
    },
  });

  // Update quantity (increase/decrease)
  const { mutate: updateQuantity, isPending: updating } = useMutation({
    mutationFn: async ({ id, action }) => {
      const res = await axiosSecure.patch(`/api/cart/${id}`, { action });
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
    adding,
    removing,
    updating,
  };
};

export default useCart;
