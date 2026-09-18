import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cartService } from './cartService'
import { cartApi } from '../api/axiosConfig'

// Mock dependencies
vi.mock('../api/axiosConfig', () => ({
  cartApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('cartService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCart', () => {
    it('should get cart successfully', async () => {
      const userId = '1'
      const mockResponse = {
        data: {
          items: [{ productId: '1', quantity: 2 }],
          total: 199.98,
        },
      }
      cartApi.get.mockResolvedValue(mockResponse)

      const result = await cartService.getCart(userId)

      expect(cartApi.get).toHaveBeenCalledWith(`/cart/${userId}`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('addToCart', () => {
    it('should add item to cart successfully', async () => {
      const userId = '1'
      const product = { id: '1', name: 'Test Product' }
      const quantity = 2
      const mockResponse = {
        data: {
          items: [{ productId: '1', quantity: 2 }],
          total: 199.98,
        },
      }
      cartApi.post.mockResolvedValue(mockResponse)

      const result = await cartService.addToCart(userId, product, quantity)

      expect(cartApi.post).toHaveBeenCalledWith(`/cart/${userId}/items`, {
        productId: '1',
        quantity: 2,
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle product unavailable error', async () => {
      const userId = '1'
      const product = { id: '1', name: 'Test Product' }
      const mockError = {
        response: { data: { message: 'Product is not available' } },
      }
      cartApi.post.mockRejectedValue(mockError)

      await expect(cartService.addToCart(userId, product)).rejects.toThrow(
        'This product is currently unavailable. Please try again later.'
      )
    })

    it('should handle insufficient stock error', async () => {
      const userId = '1'
      const product = { id: '1', name: 'Test Product' }
      const mockError = {
        response: { data: { message: 'Insufficient stock' } },
      }
      cartApi.post.mockRejectedValue(mockError)

      await expect(cartService.addToCart(userId, product)).rejects.toThrow(
        'Not enough stock available. Please reduce the quantity.'
      )
    })

    it('should handle unable to add item error', async () => {
      const userId = '1'
      const product = { id: '1', name: 'Test Product' }
      const mockError = {
        response: { data: { message: 'Unable to add item to cart' } },
      }
      cartApi.post.mockRejectedValue(mockError)

      await expect(cartService.addToCart(userId, product)).rejects.toThrow(
        'Unable to add item to cart. Please try again later.'
      )
    })

    it('should throw original error for unknown errors', async () => {
      const userId = '1'
      const product = { id: '1', name: 'Test Product' }
      const mockError = new Error('Network error')
      cartApi.post.mockRejectedValue(mockError)

      await expect(cartService.addToCart(userId, product)).rejects.toThrow('Network error')
    })
  })

  describe('updateCartItem', () => {
    it('should update cart item successfully', async () => {
      const userId = '1'
      const productId = '1'
      const quantity = 3
      const mockResponse = {
        data: {
          items: [{ productId: '1', quantity: 3 }],
          total: 299.97,
        },
      }
      cartApi.put.mockResolvedValue(mockResponse)

      const result = await cartService.updateCartItem(userId, productId, quantity)

      expect(cartApi.put).toHaveBeenCalledWith(
        `/cart/${userId}/items/${productId}?quantity=3`,
        {}
      )
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle insufficient stock error on update', async () => {
      const userId = '1'
      const productId = '1'
      const quantity = 10
      const mockError = {
        response: { data: { message: 'Insufficient stock' } },
      }
      cartApi.put.mockRejectedValue(mockError)

      await expect(cartService.updateCartItem(userId, productId, quantity)).rejects.toThrow(
        'Not enough stock available. Please reduce the quantity.'
      )
    })

    it('should handle product unavailable error on update', async () => {
      const userId = '1'
      const productId = '1'
      const quantity = 3
      const mockError = {
        response: { data: { message: 'Product is not available' } },
      }
      cartApi.put.mockRejectedValue(mockError)

      await expect(cartService.updateCartItem(userId, productId, quantity)).rejects.toThrow(
        'This product is currently unavailable. Please try again later.'
      )
    })
  })

  describe('removeCartItem', () => {
    it('should remove cart item successfully', async () => {
      const userId = '1'
      const productId = '1'
      const mockResponse = {
        data: {
          items: [],
          total: 0,
        },
      }
      cartApi.delete.mockResolvedValue(mockResponse)

      const result = await cartService.removeCartItem(userId, productId)

      expect(cartApi.delete).toHaveBeenCalledWith(`/cart/${userId}/items/${productId}`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('clearCart', () => {
    it('should clear cart successfully', async () => {
      const userId = '1'
      const mockResponse = {
        data: {
          items: [],
          total: 0,
        },
      }
      cartApi.delete.mockResolvedValue(mockResponse)

      const result = await cartService.clearCart(userId)

      expect(cartApi.delete).toHaveBeenCalledWith(`/cart/${userId}/clear`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getAllCarts', () => {
    it('should get all carts successfully', async () => {
      const mockResponse = {
        data: [
          { userId: '1', items: [], total: 0 },
          { userId: '2', items: [], total: 0 },
        ],
      }
      cartApi.get.mockResolvedValue(mockResponse)

      const result = await cartService.getAllCarts()

      expect(cartApi.get).toHaveBeenCalledWith('/cart/admin/all')
      expect(result).toEqual(mockResponse.data)
    })
  })
})
