const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
const ROLE_KEY = 'userRole';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token, expiresIn = 86400000) => {
  localStorage.setItem(TOKEN_KEY, token);
  const expiryTime = Date.now() + expiresIn;
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const getRole = () => {
  return localStorage.getItem(ROLE_KEY);
};

export const setRole = (role) => {
  localStorage.setItem(ROLE_KEY, role);
};

export const removeRole = () => {
  localStorage.removeItem(ROLE_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const isAdmin = () => {
  const role = getRole();
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
};

export const clearAuthData = () => {
  removeToken();
  removeUser();
  removeRole();
};

export const getTokenExpiry = () => {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
};

export const isTokenExpiringSoon = () => {
  const expiry = getTokenExpiry();
  if (!expiry) return false;
  return Date.now() >= expiry - TOKEN_REFRESH_THRESHOLD;
};

export const isTokenExpired = () => {
  const expiry = getTokenExpiry();
  if (!expiry) return false;
  return Date.now() >= expiry;
};
