// Service URLs - All requests go through API Gateway on port 8087
export const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY || 'http://localhost:8087';
export const USER_SERVICE_URL = `${API_GATEWAY_URL}/api/v1`;
export const PRODUCTS_SERVICE_URL = `${API_GATEWAY_URL}/api`;
export const CART_SERVICE_URL = `${API_GATEWAY_URL}/cart`;
export const ADMIN_SERVICE_URL = `${API_GATEWAY_URL}/admin`;
export const ORDER_SERVICE_URL = `${API_GATEWAY_URL}/api/v1`;
export const NOTIFICATION_SERVICE_URL = `${API_GATEWAY_URL}/api/notifications`;

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_OTP: "/auth/verify-otp",
  RESET_PASSWORD: "/auth/reset-password",
};

// User Endpoints
export const USER_ENDPOINTS = {
  GET_PROFILE: "/users/me",
  UPDATE_PROFILE: "/users/me",
  GET_USER: (userId) => `/users/${userId}`,
  UPDATE_USER: (userId) => `/users/${userId}`,
  DELETE_USER: (userId) => `/users/${userId}`,
  GET_ALL_USERS: "/users",
};

// Admin User Endpoints
export const ADMIN_USER_ENDPOINTS = {
  GET_ALL: "/users",
  GET_BY_ID: (id) => `/users/${id}`,
  GET_BY_EMAIL: (email) => `/users/email/${email}`,
  GET_BY_MOBILE: (mobile) => `/users/mobile/${mobile}`,
  GET_BY_STATUS: (status) => `/users/status/${status}`,
  GET_BY_ROLE: (role) => `/users/role/${role}`,
  SEARCH: "/users/search",
  UPDATE: (id) => `/users/${id}`,
  UPDATE_STATUS: (id) => `/users/${id}/status`,
  UPDATE_ROLE: (id) => `/users/${id}/role`,
  DELETE: (id) => `/users/${id}`,
  GET_ROLES: (id) => `/users/${id}/roles`,
};

// Address Endpoints
export const ADDRESS_ENDPOINTS = {
  GET_ADDRESSES: (userId) => `/users/addresses/${userId}`,
  ADD_ADDRESS: (userId) => `/users/addresses/${userId}`,
  GET_DEFAULT: (userId) => `/users/addresses/${userId}/default`,
  UPDATE_ADDRESS: (addressId, userId) => `/users/addresses/${userId}/${addressId}`,
  SET_DEFAULT: (addressId, userId) => `/users/addresses/${addressId}/${userId}/default`,
  DELETE_ADDRESS: (addressId, userId) => `/users/addresses/${userId}/${addressId}`,
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

// Order Endpoints
export const ORDER_ENDPOINTS = {
  CREATE_ORDER: "/orders",
  GET_ORDERS: "/orders",
  GET_USER_ORDERS: (userId) => `/orders/user/${userId}`,
  GET_ORDER: (orderId) => `/orders/${orderId}`,
  UPDATE_ORDER: (orderId) => `/orders/${orderId}`,
  CANCEL_ORDER: (orderId) => `/orders/${orderId}/cancel`,
};

// Admin Order Endpoints
export const ADMIN_ORDER_ENDPOINTS = {
  GET_ALL: "/orders",
  GET_BY_ID: (id) => `/orders/${id}`,
  GET_BY_NUMBER: (orderNumber) => `/orders/number/${orderNumber}`,
  GET_BY_USER: (userId) => `/orders/user/${userId}`,
  GET_BY_CUSTOMER: (customerId) => `/orders/customer/${customerId}`,
  UPDATE: (id) => `/orders/${id}`,
  CANCEL: (id) => `/orders/${id}/cancel`,
  DELETE: (id) => `/orders/${id}`,
};

// Cart Endpoints
export const CART_ENDPOINTS = {
  GET_CART: (userId) => `/cart/${userId}`,
  ADD_TO_CART: (userId) => `/cart/${userId}/items`,
  UPDATE_CART_ITEM: (userId, productId) =>
    `/cart/${userId}/items/${productId}`,
  REMOVE_CART_ITEM: (userId, productId) =>
    `/cart/${userId}/items/${productId}`,
  CLEAR_CART: (userId) => `/cart/${userId}/clear`,
  GET_ALL_CARTS: '/cart/admin/all',
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
