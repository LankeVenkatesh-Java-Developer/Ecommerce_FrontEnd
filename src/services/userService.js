import { USER_ENDPOINTS, ADDRESS_ENDPOINTS } from '../api/endpoints';
import { userApi } from '../api/axiosConfig';

export const userService = {
  getUserById: async (userId) => {
    const response = await userApi.get(USER_ENDPOINTS.GET_USER(userId));
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await userApi.put(USER_ENDPOINTS.UPDATE_USER(userId), userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await userApi.delete(USER_ENDPOINTS.DELETE_USER(userId));
    return response.data;
  },

  getProfile: async () => {
    const response = await userApi.get(USER_ENDPOINTS.GET_PROFILE);
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await userApi.put(USER_ENDPOINTS.UPDATE_PROFILE, userData);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await userApi.get(USER_ENDPOINTS.GET_ALL_USERS);
    return response.data;
  },

  // Address operations
  addAddress: async (addressData) => {
    const response = await userApi.post(ADDRESS_ENDPOINTS.ADD_ADDRESS, addressData);
    return response.data;
  },

  getAddresses: async () => {
    const response = await userApi.get(ADDRESS_ENDPOINTS.GET_ADDRESSES);
    return response.data;
  },

  updateAddress: async (addressId, addressData) => {
    const response = await userApi.put(ADDRESS_ENDPOINTS.UPDATE_ADDRESS(addressId), addressData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await userApi.delete(ADDRESS_ENDPOINTS.DELETE_ADDRESS(addressId));
    return response.data;
  },
};
