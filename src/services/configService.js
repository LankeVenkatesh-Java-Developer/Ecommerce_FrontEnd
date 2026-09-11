import axios from 'axios';
import { ADMIN_SERVICE_URL, ADMIN_CONFIG_ENDPOINTS } from '../api/endpoints';
import { getToken } from '../utils/tokenUtils';

const configApiClient = axios.create({
  baseURL: ADMIN_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
configApiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const configService = {
  getAllConfigurations: async () => {
    const response = await configApiClient.get(ADMIN_CONFIG_ENDPOINTS.GET_ALL);
    return response.data;
  },

  getServiceConfig: async (serviceName) => {
    const response = await configApiClient.get(ADMIN_CONFIG_ENDPOINTS.GET_SERVICE_CONFIG(serviceName));
    return response.data;
  },

  updateServiceConfig: async (serviceName, configData) => {
    const response = await configApiClient.put(ADMIN_CONFIG_ENDPOINTS.UPDATE_SERVICE_CONFIG(serviceName), configData);
    return response.data;
  },

  getNotificationConfig: async () => {
    const response = await configApiClient.get(ADMIN_CONFIG_ENDPOINTS.GET_NOTIFICATION_CONFIG);
    return response.data;
  },

  updateNotificationConfig: async (configData) => {
    const response = await configApiClient.put(ADMIN_CONFIG_ENDPOINTS.UPDATE_NOTIFICATION_CONFIG, configData);
    return response.data;
  },

  testNotification: async (testData) => {
    const response = await configApiClient.post(ADMIN_CONFIG_ENDPOINTS.TEST_NOTIFICATION, testData);
    return response.data;
  },
};
