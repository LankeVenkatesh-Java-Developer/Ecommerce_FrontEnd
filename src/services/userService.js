import axiosConfig from '../api/axiosConfig';
import { USER_ENDPOINTS, ADDRESS_ENDPOINTS } from '../api/endpoints';

export const userService = {
  getUserById: async (userId) => {
    const response = await axiosConfig.get(USER_ENDPOINTS.GET_USER(userId));
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await axiosConfig.put(USER_ENDPOINTS.UPDATE_USER(userId), userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axiosConfig.delete(USER_ENDPOINTS.DELETE_USER(userId));
    return response.data;
  },

  // Address operations
  addAddress: async (userId, addressData) => {
    const response = await axiosConfig.post(ADDRESS_ENDPOINTS.ADD_ADDRESS(userId), addressData);
    return response.data;
  },

  getAddresses: async (userId) => {
    const response = await axiosConfig.get(ADDRESS_ENDPOINTS.GET_ADDRESSES(userId));
    return response.data;
  },

  getAddress: async (userId, addressId) => {
    const response = await axiosConfig.get(ADDRESS_ENDPOINTS.GET_ADDRESS(userId, addressId));
    return response.data;
  },

  updateAddress: async (userId, addressId, addressData) => {
    const response = await axiosConfig.put(ADDRESS_ENDPOINTS.UPDATE_ADDRESS(userId, addressId), addressData);
    return response.data;
  },

  deleteAddress: async (userId, addressId) => {
    const response = await axiosConfig.delete(ADDRESS_ENDPOINTS.DELETE_ADDRESS(userId, addressId));
    return response.data;
  },
};
