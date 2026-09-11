import { ADMIN_PRODUCT_ENDPOINTS, ADMIN_CATEGORY_ENDPOINTS, ADMIN_REPORT_ENDPOINTS } from '../api/endpoints';
import { adminApi } from '../api/axiosConfig';
import { getToken, removeToken } from '../utils/tokenUtils';

class AdminManagementService {
  // Clear token on logout
  clearToken() {
    removeToken();
  }

  // ================= PRODUCT MANAGEMENT METHODS =================

  async getProducts(page = 0, size = 20, sort = 'id', direction = 'ASC') {
    try {
      const response = await adminApi.get(ADMIN_PRODUCT_ENDPOINTS.GET_ALL, {
        params: { page, size, sort, direction }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductById(productId) {
    try {
      const response = await adminApi.get(ADMIN_PRODUCT_ENDPOINTS.GET_BY_ID(productId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProduct(productData) {
    try {
      const response = await adminApi.post(ADMIN_PRODUCT_ENDPOINTS.CREATE, productData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(productId, productData) {
    try {
      const response = await adminApi.put(ADMIN_PRODUCT_ENDPOINTS.UPDATE(productId), productData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(productId) {
    try {
      const response = await adminApi.delete(ADMIN_PRODUCT_ENDPOINTS.DELETE(productId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProductStatus(productId, status) {
    try {
      const response = await adminApi.patch(`${ADMIN_PRODUCT_ENDPOINTS.UPDATE_STATUS(productId)}?status=${status}`, {});
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ================= CATEGORY MANAGEMENT METHODS =================

  async getCategories() {
    try {
      const response = await adminApi.get(ADMIN_CATEGORY_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCategoryById(categoryId) {
    try {
      const response = await adminApi.get(ADMIN_CATEGORY_ENDPOINTS.GET_BY_ID(categoryId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCategory(categoryData) {
    try {
      const response = await adminApi.post(ADMIN_CATEGORY_ENDPOINTS.CREATE, categoryData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCategory(categoryId, categoryData) {
    try {
      const response = await adminApi.put(ADMIN_CATEGORY_ENDPOINTS.UPDATE(categoryId), categoryData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCategory(categoryId) {
    try {
      const response = await adminApi.delete(ADMIN_CATEGORY_ENDPOINTS.DELETE(categoryId));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ================= REPORT METHODS =================

  async downloadProductReport() {
    try {
      const response = await adminApi.get(ADMIN_REPORT_ENDPOINTS.PRODUCTS_EXCEL, {
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
      const response = await adminApi.get(ADMIN_REPORT_ENDPOINTS.CATEGORIES_EXCEL, {
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
      const response = await adminApi.get(ADMIN_REPORT_ENDPOINTS.STOCK_EXCEL, {
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
