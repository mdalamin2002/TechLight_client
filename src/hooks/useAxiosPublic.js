import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_prod_baseURL,
});

const useAxiosPublic = () => axiosPublic;
export default useAxiosPublic;
