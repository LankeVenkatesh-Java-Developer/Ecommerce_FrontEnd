// User Service Endpoints
export const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE_URL;
export const ADMIN_SERVICE_URL = import.meta.env.VITE_ADMIN_SERVICE_URL;
export const PRODUCTS_SERVICE_URL = import.meta.env.VITE_PRODUCTS_SERVICE_URL;

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/api/v1/auth/login",
  REGISTER: "/api/v1/auth/register",
  FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
  RESET_PASSWORD: "/api/v1/auth/reset-password",
};

// User Endpoints
export const USER_ENDPOINTS = {
  GET_USER: (userId) => `/api/v1/users/${userId}`,
  UPDATE_USER: (userId) => `/api/v1/users/${userId}`,
  DELETE_USER: (userId) => `/api/v1/users/${userId}`,
};

// Address Endpoints
export const ADDRESS_ENDPOINTS = {
  ADD_ADDRESS: (userId) => `/api/v1/addresses/users/${userId}`,
  GET_ADDRESSES: (userId) => `/api/v1/addresses/users/${userId}`,
  GET_ADDRESS: (userId, addressId) =>
    `/api/v1/addresses/users/${userId}/${addressId}`,
  UPDATE_ADDRESS: (userId, addressId) =>
    `/api/v1/addresses/users/${userId}/${addressId}`,
  DELETE_ADDRESS: (userId, addressId) =>
    `/api/v1/addresses/users/${userId}/${addressId}`,
};

// Product Endpoints (Products Management Service)
export const PRODUCT_ENDPOINTS = {
  GET_ALL_PRODUCTS: "/api/products",
  GET_PRODUCT: (productId) => `/api/products/${productId}`,
  GET_PRODUCTS_BY_CATEGORY: (categoryId) =>
    `/api/products?categoryId=${categoryId}`,
  SEARCH_PRODUCTS: "/api/products",
  CREATE_PRODUCT: "/api/products",
  UPDATE_PRODUCT: (productId) => `/api/products/${productId}`,
  DELETE_PRODUCT: (productId) => `/api/products/${productId}`,
  UPDATE_STATUS: (productId) => `/api/products/${productId}/status`,
};

// Category Endpoints (Products Management Service)
export const CATEGORY_ENDPOINTS = {
  GET_ALL_CATEGORIES: "/api/categories",
  GET_CATEGORY: (categoryId) => `/api/categories/${categoryId}`,
  CREATE_CATEGORY: "/api/categories",
  UPDATE_CATEGORY: (categoryId) => `/api/categories/${categoryId}`,
  DELETE_CATEGORY: (categoryId) => `/api/categories/${categoryId}`,
};

// Order Endpoints (Placeholder - to be replaced with real backend)
export const ORDER_ENDPOINTS = {
  CREATE_ORDER: "/api/v1/orders",
  GET_ORDERS: (userId) => `/api/v1/orders/user/${userId}`,
  GET_ORDER: (orderId) => `/api/v1/orders/${orderId}`,
};

// Cart Endpoints (Placeholder - to be replaced with real backend)
export const CART_ENDPOINTS = {
  GET_CART: (userId) => `/api/v1/cart/${userId}`,
  ADD_TO_CART: (userId) => `/api/v1/cart/${userId}/items`,
  UPDATE_CART_ITEM: (userId, itemId) =>
    `/api/v1/cart/${userId}/items/${itemId}`,
  REMOVE_CART_ITEM: (userId, itemId) =>
    `/api/v1/cart/${userId}/items/${itemId}`,
  CLEAR_CART: (userId) => `/api/v1/cart/${userId}`,
};

// Payment Endpoints (Placeholder - to be replaced with real backend)
export const PAYMENT_ENDPOINTS = {
  CREATE_PAYMENT: "/api/v1/payments",
  VERIFY_PAYMENT: (paymentId) => `/api/v1/payments/${paymentId}/verify`,
};

// Admin Service Endpoints
export const ADMIN_CATEGORY_ENDPOINTS = {
  GET_ALL: "/api/admin/categories",
  GET_BY_ID: (id) => `/api/admin/categories/${id}`,
  SEARCH: "/api/admin/categories/search",
  CREATE: "/api/admin/categories",
  UPDATE: (id) => `/api/admin/categories/${id}`,
  UPDATE_STATUS: (id) => `/api/admin/categories/${id}/status`,
  DELETE: (id) => `/api/admin/categories/${id}`,
};

export const ADMIN_PRODUCT_ENDPOINTS = {
  GET_ALL: "/api/admin/products",
  GET_BY_ID: (id) => `/api/admin/products/${id}`,
  SEARCH: "/api/admin/products/search",
  CREATE: "/api/admin/products",
  UPDATE: (id) => `/api/admin/products/${id}`,
  UPDATE_STATUS: (id) => `/api/admin/products/${id}/status`,
  UPDATE_STOCK: (id) => `/api/admin/products/${id}/stock`,
  DELETE: (id) => `/api/admin/products/${id}`,
};

export const ADMIN_REPORT_ENDPOINTS = {
  PRODUCTS_EXCEL: "/api/admin/reports/products/excel",
  CATEGORIES_EXCEL: "/api/admin/reports/categories/excel",
  STOCK_EXCEL: "/api/admin/reports/stock/excel",
};
