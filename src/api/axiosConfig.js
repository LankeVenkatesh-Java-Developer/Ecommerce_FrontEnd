import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenUtils';

const axiosConfig = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
axiosConfig.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Handle 401 Unauthorized - token expired or invalid
      if (status === 401) {
        removeToken();
        window.location.href = '/login';
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error('Access forbidden');
      }

      // Handle 404 Not Found
      if (status === 404) {
        console.error('Resource not found');
      }

      // Handle 409 Conflict
      if (status === 409) {
        console.error('Resource conflict');
      }

      // Handle 500 Server Error
      if (status === 500) {
        console.error('Server error');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosConfig;
