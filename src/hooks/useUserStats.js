import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "@/utils/useAxiosSecure";

const useUserStats = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Get user statistics (orders, wishlist, cart)
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["userStats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        const [ordersRes, wishlistRes, cartRes, couponsRes] = await Promise.all([
          axiosSecure.get(`/user/user_dashboard_overview/${user.email}/orders`),
          axiosSecure.get(`/wishlist?userEmail=${user.email}`),
          axiosSecure.get(`/cart?email=${user.email}`),
          axiosSecure.get("/coupons"),
        ]);

        // Calculate total spent from orders
        const orderStats = ordersRes?.data || {};
        const wishlistCount = wishlistRes.data?.length || 0;
        const cartCount = cartRes.data?.length || 0;
        const allCoupons = couponsRes.data || [];
        
        // Filter active and valid coupons
        const now = new Date();
        const availableCoupons = allCoupons.filter(coupon => {
          const isActive = coupon.status === "active" || coupon.isActive;
          const notExpired = !coupon.expiryDate || new Date(coupon.expiryDate) > now;
          return isActive && notExpired;
        });

        return {
          totalOrders: orderStats?.length || 0,
          totalSpent: orderStats.reduce((acc, cur) => acc + cur?.total_amount, 0) || 0,
          completedOrders: orderStats?.filter(order => order.status === "success")?.length || 0,
          pendingOrders: orderStats?.filter(order => order.status === "pending")?.length || 0,
          wishlistItems: wishlistCount,
          cartItems: cartCount,
          coupons: availableCoupons.map(c => ({
            id: c._id,
            code: c.code || c.couponCode,
            discount: c.discount || c.discountValue,
            type: c.type || c.discountType || 'percentage',
            expiryDate: c.expiryDate,
            description: c.description
          }))
        };
      } catch (error) {
        console.error("Error fetching user stats:", error);
        // Return default values if API fails
        return {
          totalOrders: 0,
          totalSpent: 0,
          completedOrders: 0,
          pendingOrders: 0,
          wishlistItems: 0,
          cartItems: 0,
          coupons: []
        };
      }
    },
  });

  return { stats, isLoading };
};

export default useUserStats;
