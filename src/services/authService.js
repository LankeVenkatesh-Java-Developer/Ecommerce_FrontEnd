import { AUTH_ENDPOINTS } from '../api/endpoints';
import { userApi } from '../api/axiosConfig';
import { setToken, setUser, setRole, clearAuthData, isTokenExpiringSoon } from '../utils/tokenUtils';

export const authService = {
  login: async (loginData) => {
    const response = await userApi.post(AUTH_ENDPOINTS.LOGIN, loginData);
    const { userId, email, token, type, role } = response.data;

    // Store token and user data with 24 hour expiry
    setToken(token, 86400000);
    setUser({ id: userId, email, role });
    
    // Store role if provided
    if (role) {
      setRole(role);
    }

    return response.data;
  },

  register: async (registerData) => {
    const response = await userApi.post(AUTH_ENDPOINTS.REGISTER, registerData);
    return response.data;
  },

  logout: () => {
    clearAuthData();
  },

  forgotPassword: async (email) => {
    const response = await userApi.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (resetData) => {
    const response = await userApi.post(AUTH_ENDPOINTS.RESET_PASSWORD, resetData);
    return response.data;
  },

  refreshToken: async () => {
    try {
      const response = await userApi.post(AUTH_ENDPOINTS.REFRESH);
      const { token } = response.data;
      
      // Update token with new expiry
      setToken(token, 86400000);
      
      return response.data;
    } catch (error) {
      // If refresh fails, clear auth data
      clearAuthData();
      throw error;
    }
  },

  shouldRefreshToken: () => {
    return isTokenExpiringSoon();
  },
};
