import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";


const useCart = () => {
    const axiosSecure = useAxiosPublic();
    const queryClient = useQueryClient();
    const { user } = useAuth();



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



    return {

        addToCart,
        adding,

    };
};

export default useCart;
