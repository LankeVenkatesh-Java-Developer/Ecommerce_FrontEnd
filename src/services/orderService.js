import { ORDER_ENDPOINTS } from '../api/endpoints';
import { orderApi } from '../api/axiosConfig';
import { ORDER_STATUS, PAYMENT_STATUS } from '../utils/constants';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await orderApi.post(ORDER_ENDPOINTS.CREATE_ORDER, orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await orderApi.get(ORDER_ENDPOINTS.GET_ORDERS);
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await orderApi.get(ORDER_ENDPOINTS.GET_ORDER(orderId));
    return response.data;
  },

  updateOrder: async (orderId, orderData) => {
    const response = await orderApi.put(ORDER_ENDPOINTS.UPDATE_ORDER(orderId), orderData);
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await orderApi.patch(ORDER_ENDPOINTS.UPDATE_ORDER(orderId), { status });
    return response.data;
  },

  cancelOrder: async (orderId) => {
    const response = await orderApi.delete(ORDER_ENDPOINTS.CANCEL_ORDER(orderId));
    return response.data;
  },
};
