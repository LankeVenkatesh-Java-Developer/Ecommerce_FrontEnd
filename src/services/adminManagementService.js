import axios from 'axios';
import { getToken, setToken, removeToken } from '../utils/tokenUtils';
import { ADMIN_PRODUCT_ENDPOINTS, ADMIN_CATEGORY_ENDPOINTS } from '../api/endpoints';

const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_SERVICE_URL || 'http://localhost:8082';
const USER_API_BASE_URL = import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081';

class AdminManagementService {
  constructor() {
    this.token = getToken();
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Always get fresh token from localStorage
    const currentToken = getToken();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
    
    return headers;
  }

  // Login via User Management Service
  async login(emailOrMobile, password) {
    try {
      const response = await axios.post(`${USER_API_BASE_URL}/api/v1/auth/login`, {
        emailOrMobile,
        password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const { token, userId, email, role } = response.data;
      
      if (token) {
        this.token = token;
        setToken(token);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Clear token on logout
  clearToken() {
    this.token = null;
    removeToken();
  }

  // ================= PRODUCT MANAGEMENT METHODS =================

  async getProducts(page = 0, size = 20, sort = 'id', direction = 'ASC') {
    try {
      console.log('Admin: Fetching products from:', `${ADMIN_API_BASE_URL}${ADMIN_PRODUCT_ENDPOINTS.GET_ALL}`);
      const response = await axios.get(`${ADMIN_API_BASE_URL}${ADMIN_PRODUCT_ENDPOINTS.GET_ALL}`, {
        headers: this.getHeaders(),
        params: { page, size, sort, direction }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductById(productId) {
    try {
      console.log('Admin: Fetching product by ID:', productId);
      const response = await axios.get(`${ADMIN_API_BASE_URL}${ADMIN_PRODUCT_ENDPOINTS.GET_BY_ID(productId)}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProduct(productData) {
    try {
      console.log('Admin: Creating product');
      const response = await axios.post(`${ADMIN_API_BASE_URL}${ADMIN_PRODUCT_ENDPOINTS.CREATE}`, productData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(productId, productData) {
    try {
      console.log('Admin: Updating product:', productId);
      const response = await axios.put(`${ADMIN_API_BASE_URL}${ADMIN_PRODUCT_ENDPOINTS.UPDATE(productId)}`, productData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(productId) {
    try {
      console.log('Admin: Deleting product:', productId);
      const response = await axios.delete(`${ADMIN_API_BASE_URL}${ADMIN_PRODUCT_ENDPOINTS.DELETE(productId)}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProductStatus(productId, status) {
    try {
      console.log('Admin: Updating product status:', productId, status);
      const response = await axios.patch(`${ADMIN_API_BASE_URL}${ADMIN_PRODUCT_ENDPOINTS.UPDATE_STATUS(productId)}?status=${status}`, {}, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ================= CATEGORY MANAGEMENT METHODS =================

  async getCategories() {
    try {
      console.log('Admin: Fetching categories from:', `${ADMIN_API_BASE_URL}${ADMIN_CATEGORY_ENDPOINTS.GET_ALL}`);
      const response = await axios.get(`${ADMIN_API_BASE_URL}${ADMIN_CATEGORY_ENDPOINTS.GET_ALL}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCategoryById(categoryId) {
    try {
      console.log('Admin: Fetching category by ID:', categoryId);
      const response = await axios.get(`${ADMIN_API_BASE_URL}${ADMIN_CATEGORY_ENDPOINTS.GET_BY_ID(categoryId)}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCategory(categoryData) {
    try {
      console.log('Admin: Creating category');
      const response = await axios.post(`${ADMIN_API_BASE_URL}${ADMIN_CATEGORY_ENDPOINTS.CREATE}`, categoryData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCategory(categoryId, categoryData) {
    try {
      console.log('Admin: Updating category:', categoryId);
      const response = await axios.put(`${ADMIN_API_BASE_URL}${ADMIN_CATEGORY_ENDPOINTS.UPDATE(categoryId)}`, categoryData, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCategory(categoryId) {
    try {
      console.log('Admin: Deleting category:', categoryId);
      const response = await axios.delete(`${ADMIN_API_BASE_URL}${ADMIN_CATEGORY_ENDPOINTS.DELETE(categoryId)}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ================= REPORT METHODS =================

  async downloadProductReport() {
    try {
      console.log('Downloading product report from:', `${ADMIN_API_BASE_URL}/api/admin/reports/products/excel`);
      const response = await axios.get(`${ADMIN_API_BASE_URL}/api/admin/reports/products/excel`, {
        headers: this.getHeaders(),
        responseType: 'blob'
      });
      
      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products_report_${new Date().getTime()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadCategoryReport() {
    try {
      console.log('Downloading category report from:', `${ADMIN_API_BASE_URL}/api/admin/reports/categories/excel`);
      const response = await axios.get(`${ADMIN_API_BASE_URL}/api/admin/reports/categories/excel`, {
        headers: this.getHeaders(),
        responseType: 'blob'
      });
      
      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `categories_report_${new Date().getTime()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async downloadStockReport() {
    try {
      console.log('Downloading stock report from:', `${ADMIN_API_BASE_URL}/api/admin/reports/stock/excel`);
      const response = await axios.get(`${ADMIN_API_BASE_URL}/api/admin/reports/stock/excel`, {
        headers: this.getHeaders(),
        responseType: 'blob'
      });
      
      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stock_report_${new Date().getTime()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expired or invalid
          this.clearToken();
          window.location.href = '/login';
          return new Error('Session expired. Please login again.');
        case 403:
          return new Error('Access denied. You don\'t have permission to perform this action.');
        case 404:
          return new Error('Resource not found.');
        case 409:
          return new Error(data.message || 'This resource already exists.');
        case 500:
          return new Error('Server error. Please try again later.');
        default:
          return new Error(data.message || 'An error occurred. Please try again.');
      }
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error('An error occurred. Please try again.');
    }
  }
}

export default new AdminManagementService();
