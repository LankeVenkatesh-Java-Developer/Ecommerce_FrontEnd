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
  addAddress: async (userId, addressData) => {
    const response = await userApi.post(ADDRESS_ENDPOINTS.ADD_ADDRESS(userId), addressData);
    return response.data;
  },

  getAddresses: async (userId) => {
    const response = await userApi.get(ADDRESS_ENDPOINTS.GET_ADDRESSES(userId));
    return response.data;
  },

  getDefaultAddress: async (userId) => {
    const response = await userApi.get(ADDRESS_ENDPOINTS.GET_DEFAULT(userId));
    return response.data;
  },

  updateAddress: async (addressId, userId, addressData) => {
    const response = await userApi.put(ADDRESS_ENDPOINTS.UPDATE_ADDRESS(addressId, userId), addressData);
    return response.data;
  },

  setDefaultAddress: async (addressId, userId) => {
    const response = await userApi.patch(ADDRESS_ENDPOINTS.SET_DEFAULT(addressId, userId));
    return response.data;
  },

  deleteAddress: async (addressId, userId) => {
    const response = await userApi.delete(ADDRESS_ENDPOINTS.DELETE_ADDRESS(addressId, userId));
    return response.data;
  },
};
