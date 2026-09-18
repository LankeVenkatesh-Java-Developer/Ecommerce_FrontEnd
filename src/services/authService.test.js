import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from './authService'
import { userApi } from '../api/axiosConfig'
import { setToken, setUser, setRole, clearAuthData, isTokenExpiringSoon } from '../utils/tokenUtils'

// Mock dependencies
vi.mock('../api/axiosConfig', () => ({
  userApi: {
    post: vi.fn(),
  },
}))

vi.mock('../utils/tokenUtils', () => ({
  setToken: vi.fn(),
  setUser: vi.fn(),
  setRole: vi.fn(),
  clearAuthData: vi.fn(),
  isTokenExpiringSoon: vi.fn(() => false),
}))

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should successfully login and store auth data', async () => {
      const loginData = { email: 'test@example.com', password: 'password' }
      const mockResponse = {
        data: {
          userId: '1',
          email: 'test@example.com',
          token: 'test-token',
          type: 'Bearer',
          role: 'USER',
        },
      }
      userApi.post.mockResolvedValue(mockResponse)

      const result = await authService.login(loginData)

      expect(userApi.post).toHaveBeenCalledWith('/auth/login', loginData)
      expect(setToken).toHaveBeenCalledWith('test-token', 86400000)
      expect(setUser).toHaveBeenCalledWith({ id: '1', email: 'test@example.com', role: 'USER' })
      expect(setRole).toHaveBeenCalledWith('USER')
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle login without role', async () => {
      const loginData = { email: 'test@example.com', password: 'password' }
      const mockResponse = {
        data: {
          userId: '1',
          email: 'test@example.com',
          token: 'test-token',
          type: 'Bearer',
        },
      }
      userApi.post.mockResolvedValue(mockResponse)

      await authService.login(loginData)

      expect(setRole).not.toHaveBeenCalled()
    })

    it('should throw error on login failure', async () => {
      const loginData = { email: 'test@example.com', password: 'wrong-password' }
      const mockError = new Error('Invalid credentials')
      userApi.post.mockRejectedValue(mockError)

      await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials')
    })
  })

  describe('register', () => {
    it('should successfully register', async () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      }
      const mockResponse = { data: { message: 'Registration successful' } }
      userApi.post.mockResolvedValue(mockResponse)

      const result = await authService.register(registerData)

      expect(userApi.post).toHaveBeenCalledWith('/auth/register', registerData)
      expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on registration failure', async () => {
      const registerData = { email: 'test@example.com', password: 'password' }
      const mockError = new Error('Email already exists')
      userApi.post.mockRejectedValue(mockError)

      await expect(authService.register(registerData)).rejects.toThrow('Email already exists')
    })
  })

  describe('logout', () => {
    it('should clear auth data', () => {
      authService.logout()
      expect(clearAuthData).toHaveBeenCalled()
    })
  })

  describe('forgotPassword', () => {
    it('should send forgot password request', async () => {
      const email = 'test@example.com'
      const mockResponse = { data: { message: 'OTP sent' } }
      userApi.post.mockResolvedValue(mockResponse)

      const result = await authService.forgotPassword(email)

      expect(userApi.post).toHaveBeenCalledWith('/auth/forgot-password', { email })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('verifyOtp', () => {
    it('should verify OTP successfully', async () => {
      const email = 'test@example.com'
      const otp = '123456'
      const mockResponse = { data: { message: 'OTP verified' } }
      userApi.post.mockResolvedValue(mockResponse)

      const result = await authService.verifyOtp(email, otp)

      expect(userApi.post).toHaveBeenCalledWith('/auth/verify-otp', { email, otp })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const resetData = {
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'newPassword',
      }
      const mockResponse = { data: { message: 'Password reset successful' } }
      userApi.post.mockResolvedValue(mockResponse)

      const result = await authService.resetPassword(resetData)

      expect(userApi.post).toHaveBeenCalledWith('/auth/reset-password', resetData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = { data: { token: 'new-token' } }
      userApi.post.mockResolvedValue(mockResponse)

      const result = await authService.refreshToken()

      expect(userApi.post).toHaveBeenCalledWith('/auth/refresh')
      expect(setToken).toHaveBeenCalledWith('new-token', 86400000)
      expect(result).toEqual(mockResponse.data)
    })

    it('should clear auth data on refresh failure', async () => {
      const mockError = new Error('Refresh failed')
      userApi.post.mockRejectedValue(mockError)

      await expect(authService.refreshToken()).rejects.toThrow('Refresh failed')
      expect(clearAuthData).toHaveBeenCalled()
    })
  })

  describe('shouldRefreshToken', () => {
    it('should return token expiry status', () => {
      isTokenExpiringSoon.mockReturnValue(true)
      expect(authService.shouldRefreshToken()).toBe(true)

      isTokenExpiringSoon.mockReturnValue(false)
      expect(authService.shouldRefreshToken()).toBe(false)
    })
  })
})
