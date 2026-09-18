import { ADMIN_CONFIG_ENDPOINTS } from '../api/endpoints';
import { adminApi } from '../api/axiosConfig';

export const configService = {
  getAllConfigurations: async () => {
    const response = await adminApi.get(ADMIN_CONFIG_ENDPOINTS.GET_ALL);
    return response.data;
  },

  getServiceConfig: async (serviceName) => {
    const response = await adminApi.get(ADMIN_CONFIG_ENDPOINTS.GET_SERVICE_CONFIG(serviceName));
    return response.data;
  },

  updateServiceConfig: async (serviceName, configData) => {
    const response = await adminApi.put(ADMIN_CONFIG_ENDPOINTS.UPDATE_SERVICE_CONFIG(serviceName), configData);
    return response.data;
  },

  getNotificationConfig: async () => {
    const response = await adminApi.get(ADMIN_CONFIG_ENDPOINTS.GET_NOTIFICATION_CONFIG);
    return response.data;
  },

  updateNotificationConfig: async (configData) => {
    const response = await adminApi.put(ADMIN_CONFIG_ENDPOINTS.UPDATE_NOTIFICATION_CONFIG, configData);
    return response.data;
  },

  testNotification: async (testData) => {
    const response = await adminApi.post(ADMIN_CONFIG_ENDPOINTS.TEST_NOTIFICATION, testData);
    return response.data;
  },
};
