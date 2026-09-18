import { CART_ENDPOINTS } from '../api/endpoints';
import { cartApi } from '../api/axiosConfig';

export const cartService = {
  getCart: async (userId) => {
    const response = await cartApi.get(CART_ENDPOINTS.GET_CART(userId));
    return response.data;
  },

  addToCart: async (userId, product, quantity = 1) => {
    try {
      const cartItem = {
        productId: product.id,
        quantity: quantity,
      };
      const response = await cartApi.post(CART_ENDPOINTS.ADD_TO_CART(userId), cartItem);
      return response.data;
    } catch (error) {
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes('Product is not available')) {
        throw new Error('This product is currently unavailable. Please try again later.');
      }
      if (errorMessage.includes('Insufficient stock')) {
        throw new Error('Not enough stock available. Please reduce the quantity.');
      }
      if (errorMessage.includes('Unable to add item to cart')) {
        throw new Error('Unable to add item to cart. Please try again later.');
      }
      throw error;
    }
  },

  updateCartItem: async (userId, productId, quantity) => {
    try {
      const response = await cartApi.put(
        `${CART_ENDPOINTS.UPDATE_CART_ITEM(userId, productId)}?quantity=${quantity}`,
        {}
      );
      return response.data;
    } catch (error) {
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes('Insufficient stock')) {
        throw new Error('Not enough stock available. Please reduce the quantity.');
      }
      if (errorMessage.includes('Product is not available')) {
        throw new Error('This product is currently unavailable. Please try again later.');
      }
      throw error;
    }
  },

  removeCartItem: async (userId, productId) => {
    const response = await cartApi.delete(CART_ENDPOINTS.REMOVE_CART_ITEM(userId, productId));
    return response.data;
  },

  clearCart: async (userId) => {
    const response = await cartApi.delete(CART_ENDPOINTS.CLEAR_CART(userId));
    return response.data;
  },

  getAllCarts: async () => {
    const response = await cartApi.get(CART_ENDPOINTS.GET_ALL_CARTS);
    return response.data;
  },
};
