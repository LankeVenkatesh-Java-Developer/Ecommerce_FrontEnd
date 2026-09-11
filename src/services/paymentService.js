import { PAYMENT_ENDPOINTS } from '../api/endpoints';
import { orderApi } from '../api/axiosConfig';
import { PAYMENT_STATUS } from '../utils/constants';

export const paymentService = {
  createPayment: async (orderId, paymentData) => {
    const response = await orderApi.post(PAYMENT_ENDPOINTS.CREATE_PAYMENT(orderId), paymentData);
    return response.data;
  },

  getPaymentStatus: async (orderId) => {
    const response = await orderApi.get(PAYMENT_ENDPOINTS.GET_PAYMENT_STATUS(orderId));
    return response.data;
  },
};
