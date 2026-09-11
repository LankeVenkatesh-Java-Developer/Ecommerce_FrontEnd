import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenUtils';
import { 
  USER_SERVICE_URL, 
  PRODUCTS_SERVICE_URL, 
  ADMIN_SERVICE_URL, 
  ORDER_SERVICE_URL 
} from './endpoints';

// Create axios instance factory function
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add JWT token
  instance.interceptors.request.use(
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
  instance.interceptors.response.use(
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

  return instance;
};

// Create axios instances for each service
export const userApi = createAxiosInstance(USER_SERVICE_URL);
export const productsApi = createAxiosInstance(PRODUCTS_SERVICE_URL);
export const adminApi = createAxiosInstance(ADMIN_SERVICE_URL);
export const orderApi = createAxiosInstance(ORDER_SERVICE_URL);

// Default export for backward compatibility (uses user service)
export default userApi;
