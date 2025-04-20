import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your actual backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional bearer token handler
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (config.requireAuth && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;