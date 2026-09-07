import axios from 'axios';
import { PRODUCT_ENDPOINTS, CATEGORY_ENDPOINTS, PRODUCTS_SERVICE_URL } from '../api/endpoints';
import { getToken } from '../utils/tokenUtils';

const BASE_URL = PRODUCTS_SERVICE_URL || 'http://localhost:8083';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
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

export const productService = {
  // Product operations
  getAllProducts: async (params = {}) => {
    // Filter out undefined and empty string values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const url = queryString ? `${BASE_URL}${PRODUCT_ENDPOINTS.GET_ALL_PRODUCTS}?${queryString}` : `${BASE_URL}${PRODUCT_ENDPOINTS.GET_ALL_PRODUCTS}`;
    console.log('Fetching products from:', url);
    console.log('BASE_URL:', BASE_URL);
    console.log('Params:', cleanParams);
    const response = await axiosInstance.get(url);
    console.log('Products response:', response.data);
    return response.data;
  },

  // Admin-specific: Get all products without status filtering
  getAllProductsAdmin: async (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const url = queryString ? `${BASE_URL}/api/products/admin/all?${queryString}` : `${BASE_URL}/api/products/admin/all`;
    console.log('Admin: Fetching all products from:', url);
    const response = await axiosInstance.get(url);
    console.log('Admin Products response:', response.data);
    return response.data;
  },

  getProductById: async (productId) => {
    const response = await axiosInstance.get(`${BASE_URL}${PRODUCT_ENDPOINTS.GET_PRODUCT(productId)}`);
    return response.data;
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    const allParams = { ...params, categoryId };
    const queryString = new URLSearchParams(allParams).toString();
    const response = await axiosInstance.get(`${BASE_URL}${PRODUCT_ENDPOINTS.GET_PRODUCTS_BY_CATEGORY(categoryId)}&${queryString}`);
    return response.data;
  },

  searchProducts: async (searchTerm, params = {}) => {
    const allParams = { ...params, search: searchTerm };
    const queryString = new URLSearchParams(allParams).toString();
    const response = await axiosInstance.get(`${BASE_URL}${PRODUCT_ENDPOINTS.SEARCH_PRODUCTS}?${queryString}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axiosInstance.post(`${BASE_URL}${PRODUCT_ENDPOINTS.CREATE_PRODUCT}`, productData);
    return response.data;
  },

  updateProduct: async (productId, productData) => {
    const response = await axiosInstance.put(`${BASE_URL}${PRODUCT_ENDPOINTS.UPDATE_PRODUCT(productId)}`, productData);
    return response.data;
  },

  deleteProduct: async (productId) => {
    const response = await axiosInstance.delete(`${BASE_URL}${PRODUCT_ENDPOINTS.DELETE_PRODUCT(productId)}`);
    return response.data;
  },

  updateProductStatus: async (productId, status) => {
    const response = await axiosInstance.patch(`${BASE_URL}${PRODUCT_ENDPOINTS.UPDATE_STATUS(productId)}?status=${status}`, {});
    return response.data;
  },

  // Category operations
  getAllCategories: async () => {
    const url = `${BASE_URL}${CATEGORY_ENDPOINTS.GET_ALL_CATEGORIES}`;
    console.log('Fetching categories from:', url);
    console.log('BASE_URL:', BASE_URL);
    const response = await axiosInstance.get(url);
    console.log('Categories response:', response.data);
    return response.data;
  },

  // Admin-specific: Get all categories including inactive
  getAllCategoriesAdmin: async () => {
    const url = `${BASE_URL}/api/categories/admin/all`;
    console.log('Admin: Fetching all categories from:', url);
    const response = await axiosInstance.get(url);
    console.log('Admin Categories response:', response.data);
    return response.data;
  },

  getCategoryById: async (categoryId) => {
    const response = await axiosInstance.get(`${BASE_URL}${CATEGORY_ENDPOINTS.GET_CATEGORY(categoryId)}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await axiosInstance.post(`${BASE_URL}${CATEGORY_ENDPOINTS.CREATE_CATEGORY}`, categoryData);
    return response.data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const response = await axiosInstance.put(`${BASE_URL}${CATEGORY_ENDPOINTS.UPDATE_CATEGORY(categoryId)}`, categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await axiosInstance.delete(`${BASE_URL}${CATEGORY_ENDPOINTS.DELETE_CATEGORY(categoryId)}`);
    return response.data;
  },
};
