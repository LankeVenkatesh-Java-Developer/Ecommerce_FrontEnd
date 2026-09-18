import { NOTIFICATION_ENDPOINTS } from '../api/endpoints';
import { notificationApi } from '../api/axiosConfig';

export const notificationService = {
  sendNotification: async (notificationData) => {
    const response = await notificationApi.post(NOTIFICATION_ENDPOINTS.SEND, notificationData);
    return response.data;
  },

  sendOrderCreatedNotification: async (notificationData) => {
    const response = await notificationApi.post(NOTIFICATION_ENDPOINTS.ORDER_CREATED, notificationData);
    return response.data;
  },

  sendOrderDeliveredNotification: async (notificationData) => {
    const response = await notificationApi.post(NOTIFICATION_ENDPOINTS.ORDER_DELIVERED, notificationData);
    return response.data;
  },

  sendOrderCancelledNotification: async (notificationData) => {
    const response = await notificationApi.post(NOTIFICATION_ENDPOINTS.ORDER_CANCELLED, notificationData);
    return response.data;
  },

  sendOfferUpdateNotification: async (notificationData) => {
    const response = await notificationApi.post(NOTIFICATION_ENDPOINTS.OFFER_UPDATE, notificationData);
    return response.data;
  },
};
