import { PRODUCT_ENDPOINTS, CATEGORY_ENDPOINTS } from '../api/endpoints';
import { productsApi } from '../api/axiosConfig';

export const productService = {
  // Product operations
  getAllProducts: async (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
    );
    const response = await productsApi.get(PRODUCT_ENDPOINTS.GET_ALL_PRODUCTS, { params: cleanParams });
    return response.data;
  },

  // Admin-specific: Get all products without status filtering
  getAllProductsAdmin: async (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
    );
    const response = await productsApi.get('/products/admin/all', { params: cleanParams });
    return response.data;
  },

  getProductById: async (productId) => {
    const response = await productsApi.get(PRODUCT_ENDPOINTS.GET_PRODUCT(productId));
    return response.data;
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    const allParams = { ...params, category: categoryId };
    const response = await productsApi.get(PRODUCT_ENDPOINTS.GET_ALL_PRODUCTS, { params: allParams });
    return response.data;
  },

  searchProducts: async (searchTerm, params = {}) => {
    const allParams = { ...params, name: searchTerm };
    const response = await productsApi.get(PRODUCT_ENDPOINTS.SEARCH_PRODUCTS, { params: allParams });
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await productsApi.post(PRODUCT_ENDPOINTS.CREATE_PRODUCT, productData);
    return response.data;
  },

  updateProduct: async (productId, productData) => {
    const response = await productsApi.put(PRODUCT_ENDPOINTS.UPDATE_PRODUCT(productId), productData);
    return response.data;
  },

  deleteProduct: async (productId) => {
    const response = await productsApi.delete(PRODUCT_ENDPOINTS.DELETE_PRODUCT(productId));
    return response.data;
  },

  updateProductStatus: async (productId, status) => {
    const response = await productsApi.patch(`${PRODUCT_ENDPOINTS.UPDATE_STATUS(productId)}?status=${status}`, {});
    return response.data;
  },

  // Category operations
  getAllCategories: async () => {
    const response = await productsApi.get(CATEGORY_ENDPOINTS.GET_ALL_CATEGORIES);
    return response.data;
  },

  // Admin-specific: Get all categories including inactive
  getAllCategoriesAdmin: async () => {
    const response = await productsApi.get('/categories/admin/all');
    return response.data;
  },

  getCategoryById: async (categoryId) => {
    const response = await productsApi.get(CATEGORY_ENDPOINTS.GET_CATEGORY(categoryId));
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await productsApi.post(CATEGORY_ENDPOINTS.CREATE_CATEGORY, categoryData);
    return response.data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const response = await productsApi.put(CATEGORY_ENDPOINTS.UPDATE_CATEGORY(categoryId), categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await productsApi.delete(CATEGORY_ENDPOINTS.DELETE_CATEGORY(categoryId));
    return response.data;
  },
};
