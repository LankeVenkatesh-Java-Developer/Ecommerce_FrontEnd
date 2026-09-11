import axios from 'axios';
import { NOTIFICATION_SERVICE_URL, NOTIFICATION_ENDPOINTS } from '../api/endpoints';

const notificationApiClient = axios.create({
  baseURL: NOTIFICATION_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notificationService = {
  sendNotification: async (notificationData) => {
    const response = await notificationApiClient.post(NOTIFICATION_ENDPOINTS.SEND, notificationData);
    return response.data;
  },

  sendOrderCreatedNotification: async (notificationData) => {
    const response = await notificationApiClient.post(NOTIFICATION_ENDPOINTS.ORDER_CREATED, notificationData);
    return response.data;
  },

  sendOrderDeliveredNotification: async (notificationData) => {
    const response = await notificationApiClient.post(NOTIFICATION_ENDPOINTS.ORDER_DELIVERED, notificationData);
    return response.data;
  },

  sendOrderCancelledNotification: async (notificationData) => {
    const response = await notificationApiClient.post(NOTIFICATION_ENDPOINTS.ORDER_CANCELLED, notificationData);
    return response.data;
  },

  sendOfferUpdateNotification: async (notificationData) => {
    const response = await notificationApiClient.post(NOTIFICATION_ENDPOINTS.OFFER_UPDATE, notificationData);
    return response.data;
  },
};
