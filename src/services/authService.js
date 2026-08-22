import axiosConfig from '../api/axiosConfig';
import { AUTH_ENDPOINTS } from '../api/endpoints';
import { setToken, setUser, clearAuthData } from '../utils/tokenUtils';

export const authService = {
  login: async (loginData) => {
    const response = await axiosConfig.post(AUTH_ENDPOINTS.LOGIN, loginData);
    const { userId, email, accessToken, tokenType, expiresIn } = response.data;

    // Store token and user data
    setToken(accessToken);
    setUser({ id: userId, email });

    return response.data;
  },

  register: async (registerData) => {
    const response = await axiosConfig.post(AUTH_ENDPOINTS.REGISTER, registerData);
    return response.data;
  },

  logout: () => {
    clearAuthData();
  },

  forgotPassword: async (email) => {
    const response = await axiosConfig.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return response.data;
  },

  resetPassword: async (resetData) => {
    const response = await axiosConfig.post(AUTH_ENDPOINTS.RESET_PASSWORD, resetData);
    return response.data;
  },
};
