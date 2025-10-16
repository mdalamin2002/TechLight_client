import useAuth from "./useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/utils/useAxiosSecure";

const useAddress = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all addresses
  const {
    data: addresses = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["addresses", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/addresses?email=${user?.email}`);
      return res.data;
    },
  });

  // Fetch default address
  const {
    data: defaultAddress = null,
    isLoading: loadingDefault,
    refetch: refetchDefault,
  } = useQuery({
    queryKey: ["defaultAddress", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/addresses/default?email=${user?.email}`);
      return res.data;
    },
  });

  // Add new address
  const addAddress = useMutation({
    mutationFn: async (addressData) => {
      const payload = { ...addressData, userEmail: user?.email };
      const res = await axiosSecure.post("/addresses", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addresses", user?.email]);
      queryClient.invalidateQueries(["defaultAddress", user?.email]);
    },
  });

  // Update address
  const updateAddress = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await axiosSecure.put(`/addresses/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addresses", user?.email]);
      queryClient.invalidateQueries(["defaultAddress", user?.email]);
    },
  });

  // Delete address
  const deleteAddress = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/addresses/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addresses", user?.email]);
      queryClient.invalidateQueries(["defaultAddress", user?.email]);
    },
  });

  return {
    addresses,
    defaultAddress,
    isLoading,
    loadingDefault,
    refetch,
    refetchDefault,
    addAddress,
    updateAddress,
    deleteAddress,
  };
};

export default useAddress;
