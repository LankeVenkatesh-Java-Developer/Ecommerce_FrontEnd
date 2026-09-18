import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userService } from './userService'
import { userApi } from '../api/axiosConfig'

// Mock dependencies
vi.mock('../api/axiosConfig', () => ({
  userApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserById', () => {
    it('should get user by id', async () => {
      const userId = '1'
      const mockResponse = {
        data: { id: '1', email: 'test@example.com', firstName: 'John' },
      }
      userApi.get.mockResolvedValue(mockResponse)

      const result = await userService.getUserById(userId)

      expect(userApi.get).toHaveBeenCalledWith(`/users/${userId}`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = '1'
      const userData = { firstName: 'Jane', lastName: 'Doe' }
      const mockResponse = {
        data: { id: '1', ...userData },
      }
      userApi.put.mockResolvedValue(mockResponse)

      const result = await userService.updateUser(userId, userData)

      expect(userApi.put).toHaveBeenCalledWith(`/users/${userId}`, userData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = '1'
      const mockResponse = {
        data: { message: 'User deleted' },
      }
      userApi.delete.mockResolvedValue(mockResponse)

      const result = await userService.deleteUser(userId)

      expect(userApi.delete).toHaveBeenCalledWith(`/users/${userId}`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const mockResponse = {
        data: { id: '1', email: 'test@example.com', firstName: 'John' },
      }
      userApi.get.mockResolvedValue(mockResponse)

      const result = await userService.getProfile()

      expect(userApi.get).toHaveBeenCalledWith('/users/me')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const userData = { firstName: 'Jane', lastName: 'Doe' }
      const mockResponse = {
        data: { id: '1', ...userData },
      }
      userApi.put.mockResolvedValue(mockResponse)

      const result = await userService.updateProfile(userData)

      expect(userApi.put).toHaveBeenCalledWith('/users/me', userData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getAllUsers', () => {
    it('should get all users', async () => {
      const mockResponse = {
        data: [
          { id: '1', email: 'user1@example.com' },
          { id: '2', email: 'user2@example.com' },
        ],
      }
      userApi.get.mockResolvedValue(mockResponse)

      const result = await userService.getAllUsers()

      expect(userApi.get).toHaveBeenCalledWith('/users')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('addAddress', () => {
    it('should add address successfully', async () => {
      const userId = '1'
      const addressData = {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'USA',
      }
      const mockResponse = {
        data: { id: '1', ...addressData },
      }
      userApi.post.mockResolvedValue(mockResponse)

      const result = await userService.addAddress(userId, addressData)

      expect(userApi.post).toHaveBeenCalledWith(`/users/addresses/${userId}`, addressData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getAddresses', () => {
    it('should get user addresses', async () => {
      const userId = '1'
      const mockResponse = {
        data: [
          { id: '1', street: '123 Test St', city: 'Test City' },
          { id: '2', street: '456 Test St', city: 'Test City' },
        ],
      }
      userApi.get.mockResolvedValue(mockResponse)

      const result = await userService.getAddresses(userId)

      expect(userApi.get).toHaveBeenCalledWith(`/users/addresses/${userId}`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getDefaultAddress', () => {
    it('should get default address', async () => {
      const userId = '1'
      const mockResponse = {
        data: { id: '1', street: '123 Test St', city: 'Test City', isDefault: true },
      }
      userApi.get.mockResolvedValue(mockResponse)

      const result = await userService.getDefaultAddress(userId)

      expect(userApi.get).toHaveBeenCalledWith(`/users/addresses/${userId}/default`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('updateAddress', () => {
    it('should update address successfully', async () => {
      const addressId = '1'
      const userId = '1'
      const addressData = { street: '789 Test St', city: 'New City' }
      const mockResponse = {
        data: { id: '1', ...addressData },
      }
      userApi.put.mockResolvedValue(mockResponse)

      const result = await userService.updateAddress(addressId, userId, addressData)

      expect(userApi.put).toHaveBeenCalledWith(
        `/users/addresses/${addressId}/${userId}`,
        addressData
      )
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('setDefaultAddress', () => {
    it('should set default address successfully', async () => {
      const addressId = '1'
      const userId = '1'
      const mockResponse = {
        data: { id: '1', isDefault: true },
      }
      userApi.patch.mockResolvedValue(mockResponse)

      const result = await userService.setDefaultAddress(addressId, userId)

      expect(userApi.patch).toHaveBeenCalledWith(`/users/addresses/${addressId}/${userId}/default`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('deleteAddress', () => {
    it('should delete address successfully', async () => {
      const addressId = '1'
      const userId = '1'
      const mockResponse = {
        data: { message: 'Address deleted' },
      }
      userApi.delete.mockResolvedValue(mockResponse)

      const result = await userService.deleteAddress(addressId, userId)

      expect(userApi.delete).toHaveBeenCalledWith(`/users/addresses/${addressId}/${userId}`)
      expect(result).toEqual(mockResponse.data)
    })
  })
})
