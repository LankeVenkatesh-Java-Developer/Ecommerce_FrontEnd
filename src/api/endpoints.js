// Service URLs
export const USER_SERVICE_URL = import.meta.env.VITE_API_USER_SERVICE;
export const PRODUCTS_SERVICE_URL = import.meta.env.VITE_API_PRODUCTS_SERVICE;
export const ADMIN_SERVICE_URL = import.meta.env.VITE_API_ADMIN_SERVICE;
export const ORDER_SERVICE_URL = import.meta.env.VITE_API_ORDER_SERVICE;
export const NOTIFICATION_SERVICE_URL = import.meta.env.VITE_API_NOTIFICATION_SERVICE;

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
};

// User Endpoints
export const USER_ENDPOINTS = {
  GET_PROFILE: "/users/profile",
  UPDATE_PROFILE: "/users/profile",
  GET_USER: (userId) => `/users/${userId}`,
  UPDATE_USER: (userId) => `/users/${userId}`,
  DELETE_USER: (userId) => `/users/${userId}`,
  GET_ALL_USERS: "/users",
};

// Address Endpoints
export const ADDRESS_ENDPOINTS = {
  GET_ADDRESSES: "/users/addresses",
  ADD_ADDRESS: "/users/addresses",
  UPDATE_ADDRESS: (addressId) => `/users/addresses/${addressId}`,
  DELETE_ADDRESS: (addressId) => `/users/addresses/${addressId}`,
};

// Product Endpoints (Products Management Service)
export const PRODUCT_ENDPOINTS = {
  GET_ALL_PRODUCTS: "/products",
  GET_PRODUCT: (productId) => `/products/${productId}`,
  GET_PRODUCTS_BY_CATEGORY: (categoryId) =>
    `/products?category=${categoryId}`,
  SEARCH_PRODUCTS: "/products",
  CREATE_PRODUCT: "/products",
  UPDATE_PRODUCT: (productId) => `/products/${productId}`,
  DELETE_PRODUCT: (productId) => `/products/${productId}`,
  UPDATE_STATUS: (productId) => `/products/${productId}/status`,
};

// Category Endpoints (Products Management Service)
export const CATEGORY_ENDPOINTS = {
  GET_ALL_CATEGORIES: "/categories",
  GET_CATEGORY: (categoryId) => `/categories/${categoryId}`,
  CREATE_CATEGORY: "/categories",
  UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
  DELETE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
};

// Order Endpoints
export const ORDER_ENDPOINTS = {
  CREATE_ORDER: "/orders",
  GET_ORDERS: "/orders",
  GET_ORDER: (orderId) => `/orders/${orderId}`,
  UPDATE_ORDER: (orderId) => `/orders/${orderId}`,
  CANCEL_ORDER: (orderId) => `/orders/${orderId}`,
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

// Payment Endpoints
export const PAYMENT_ENDPOINTS = {
  CREATE_PAYMENT: (orderId) => `/orders/${orderId}/payment`,
  GET_PAYMENT_STATUS: (orderId) => `/orders/${orderId}/payment`,
};

// Admin Service Endpoints
export const ADMIN_CATEGORY_ENDPOINTS = {
  GET_ALL: "/categories",
  GET_BY_ID: (id) => `/categories/${id}`,
  SEARCH: "/categories/search",
  CREATE: "/categories",
  UPDATE: (id) => `/categories/${id}`,
  UPDATE_STATUS: (id) => `/categories/${id}/status`,
  DELETE: (id) => `/categories/${id}`,
};

export const ADMIN_PRODUCT_ENDPOINTS = {
  GET_ALL: "/products",
  GET_BY_ID: (id) => `/products/${id}`,
  SEARCH: "/products/search",
  CREATE: "/products",
  UPDATE: (id) => `/products/${id}`,
  UPDATE_STATUS: (id) => `/products/${id}/status`,
  UPDATE_STOCK: (id) => `/products/${id}/stock`,
  DELETE: (id) => `/products/${id}`,
};

export const ADMIN_REPORT_ENDPOINTS = {
  PRODUCTS_EXCEL: "/reports/products/excel",
  CATEGORIES_EXCEL: "/reports/categories/excel",
  STOCK_EXCEL: "/reports/stock/excel",
};

// Configuration Management Endpoints
export const ADMIN_CONFIG_ENDPOINTS = {
  GET_ALL: "/config",
  GET_SERVICE_CONFIG: (serviceName) => `/config/service/${serviceName}`,
  UPDATE_SERVICE_CONFIG: (serviceName) => `/config/service/${serviceName}`,
  GET_NOTIFICATION_CONFIG: "/config/notification",
  UPDATE_NOTIFICATION_CONFIG: "/config/notification",
  TEST_NOTIFICATION: "/config/test-notification",
};

// Notification Service Endpoints
export const NOTIFICATION_ENDPOINTS = {
  SEND: "/send",
  ORDER_CREATED: "/order-created",
  ORDER_DELIVERED: "/order-delivered",
  ORDER_CANCELLED: "/order-cancelled",
  OFFER_UPDATE: "/offer-update",
};
