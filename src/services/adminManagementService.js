import {
  ADMIN_PRODUCT_ENDPOINTS,
  ADMIN_CATEGORY_ENDPOINTS,
  ADMIN_REPORT_ENDPOINTS,
  ADMIN_ORDER_ENDPOINTS,
  ADMIN_USER_ENDPOINTS,
  ORDER_ENDPOINTS,
} from "../api/endpoints";
import { adminApi, orderApi } from "../api/axiosConfig";
import { getToken, removeToken } from "../utils/tokenUtils";

class AdminManagementService {
  // Clear token on logout
  clearToken() {
    removeToken();
  }

  // ================= PRODUCT MANAGEMENT METHODS =================

  async getProducts(page = 0, size = 20, sort = "id", direction = "ASC") {
    try {
      const response = await adminApi.get(ADMIN_PRODUCT_ENDPOINTS.GET_ALL, {
        params: { page, size, sort, direction },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductById(productId) {
    try {
      const response = await adminApi.get(
        ADMIN_PRODUCT_ENDPOINTS.GET_BY_ID(productId),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProduct(productData) {
    try {
      const response = await adminApi.post(
        ADMIN_PRODUCT_ENDPOINTS.CREATE,
        productData,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(productId, productData) {
    try {
      const response = await adminApi.put(
        ADMIN_PRODUCT_ENDPOINTS.UPDATE(productId),
        productData,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(productId) {
    try {
      const response = await adminApi.delete(
        ADMIN_PRODUCT_ENDPOINTS.DELETE(productId),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProductStatus(productId, status) {
    try {
      const response = await adminApi.patch(
        `${ADMIN_PRODUCT_ENDPOINTS.UPDATE_STATUS(productId)}?status=${status}`,
        {},
      );
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
      const response = await adminApi.get(
        ADMIN_CATEGORY_ENDPOINTS.GET_BY_ID(categoryId),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCategory(categoryData) {
    try {
      const response = await adminApi.post(
        ADMIN_CATEGORY_ENDPOINTS.CREATE,
        categoryData,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCategory(categoryId, categoryData) {
    try {
      const response = await adminApi.put(
        ADMIN_CATEGORY_ENDPOINTS.UPDATE(categoryId),
        categoryData,
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCategory(categoryId) {
    try {
      const response = await adminApi.delete(
        ADMIN_CATEGORY_ENDPOINTS.DELETE(categoryId),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ================= REPORT METHODS =================

  async downloadProductReport() {
    try {
      const response = await adminApi.get(
        ADMIN_REPORT_ENDPOINTS.PRODUCTS_EXCEL,
        {
          responseType: "blob",
        },
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
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
      const response = await adminApi.get(
        ADMIN_REPORT_ENDPOINTS.CATEGORIES_EXCEL,
        {
          responseType: "blob",
        },
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
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
        responseType: "blob",
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
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

  // ================= ORDER MANAGEMENT METHODS =================

  async getAllOrders() {
    try {
      const response = await orderApi.get(ORDER_ENDPOINTS.GET_ORDERS);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await orderApi.get(
        ORDER_ENDPOINTS.GET_ORDER(orderId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrderByOrderNumber(orderNumber) {
    try {
      const response = await orderApi.get(
        ADMIN_ORDER_ENDPOINTS.GET_BY_NUMBER(orderNumber)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrdersByUserId(userId) {
    try {
      const response = await orderApi.get(
        ORDER_ENDPOINTS.GET_USER_ORDERS(userId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getOrdersByCustomerId(customerId) {
    try {
      const response = await orderApi.get(
        ADMIN_ORDER_ENDPOINTS.GET_BY_CUSTOMER(customerId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateOrder(orderId, orderData) {
    try {
      const response = await orderApi.put(
        ORDER_ENDPOINTS.UPDATE_ORDER(orderId),
        orderData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelOrder(orderId) {
    try {
      const response = await orderApi.delete(
        ORDER_ENDPOINTS.CANCEL_ORDER(orderId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteOrder(orderId) {
    try {
      const response = await orderApi.delete(
        ADMIN_ORDER_ENDPOINTS.DELETE(orderId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ================= USER MANAGEMENT METHODS =================

  async getAllUsers() {
    try {
      const response = await adminApi.get(ADMIN_USER_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserById(userId) {
    try {
      const response = await adminApi.get(
        ADMIN_USER_ENDPOINTS.GET_BY_ID(userId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserByEmail(email) {
    try {
      const response = await adminApi.get(
        ADMIN_USER_ENDPOINTS.GET_BY_EMAIL(email)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserByMobile(mobile) {
    try {
      const response = await adminApi.get(
        ADMIN_USER_ENDPOINTS.GET_BY_MOBILE(mobile)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUsersByStatus(status) {
    try {
      const response = await adminApi.get(
        ADMIN_USER_ENDPOINTS.GET_BY_STATUS(status)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUsersByRole(role) {
    try {
      const response = await adminApi.get(
        ADMIN_USER_ENDPOINTS.GET_BY_ROLE(role)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchUsers(keyword) {
    try {
      const response = await adminApi.get(
        ADMIN_USER_ENDPOINTS.SEARCH,
        { params: { keyword } }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await adminApi.put(
        ADMIN_USER_ENDPOINTS.UPDATE(userId),
        userData
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUserStatus(userId, status) {
    try {
      const response = await adminApi.patch(
        `${ADMIN_USER_ENDPOINTS.UPDATE_STATUS(userId)}?status=${status}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUserRole(userId, role) {
    try {
      const response = await adminApi.patch(
        `${ADMIN_USER_ENDPOINTS.UPDATE_ROLE(userId)}?role=${role}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteUser(userId) {
    try {
      const response = await adminApi.delete(
        ADMIN_USER_ENDPOINTS.DELETE(userId)
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserRoles(userId) {
    try {
      const response = await adminApi.get(
        ADMIN_USER_ENDPOINTS.GET_ROLES(userId)
      );
      return response.data;
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
          window.location.href = "/login";
          return new Error("Session expired. Please login again.");
        case 403:
          return new Error(
            "Access denied. You don't have permission to perform this action.",
          );
        case 404:
          return new Error("Resource not found.");
        case 409:
          return new Error(data.message || "This resource already exists.");
        case 500:
          return new Error("Server error. Please try again later.");
        default:
          return new Error(
            data.message || "An error occurred. Please try again.",
          );
      }
    } else if (error.request) {
      return new Error("Network error. Please check your connection.");
    } else {
      return new Error("An error occurred. Please try again.");
    }
  }
}

export default new AdminManagementService();
