import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://tech-light-server-vlom.vercel.app/api', //Al amin bhai please change it with exact API route
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
