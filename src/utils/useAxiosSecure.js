import useAuth from "@/hooks/useAuth";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";



const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_prod_baseURL,
});

const useAxiosSecure = () => {
  const { user, logOutUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.accessToken) {
      // Add request interceptor
      const requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
          return config;
        }
      );

      // Add response interceptor
      const responseInterceptor = axiosInstance.interceptors.response.use(
        (res) => res,
        (err) => {
          if (err?.response?.status === 40100 || err?.response?.status === 40300) {
            logOutUser()
              .then(() => {
                toast.error("Logged out due to token issue.")
                navigate("/auth/login")
              })
              .catch(console.error);
          }
          return Promise.reject(err);
        }
      );

      // Cleanup to prevent multiple interceptors on re-renders
      return () => {
        axiosInstance.interceptors.request.eject(requestInterceptor);
        axiosInstance.interceptors.response.eject(responseInterceptor);
      };
    }
  }, [user, loading,logOutUser]);

  return axiosInstance;
};

export default useAxiosSecure;
