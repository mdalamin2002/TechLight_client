import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', //Al amin bhai please change it with exact API route
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
