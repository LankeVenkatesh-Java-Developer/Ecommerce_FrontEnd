import { describe, it, expect } from 'vitest'
import cartReducer, {
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  updateCartItemStart,
  updateCartItemSuccess,
  updateCartItemFailure,
  removeCartItemStart,
  removeCartItemSuccess,
  removeCartItemFailure,
  clearCartStart,
  clearCartSuccess,
  clearCartFailure,
  setCart,
  clearError,
} from './cartSlice'

describe('cartSlice', () => {
  const initialState = {
    items: [],
    total: 0,
    itemCount: 0,
    loading: false,
    error: null,
  }

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })
  })

  describe('addToCart actions', () => {
    it('should handle addToCartStart', () => {
      const state = cartReducer(initialState, addToCartStart())
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle addToCartSuccess', () => {
      const payload = {
        items: [{ productId: '1', quantity: 2 }],
        total: 199.98,
      }
      const state = cartReducer(initialState, addToCartSuccess(payload))
      expect(state.loading).toBe(false)
      expect(state.items).toEqual(payload.items)
      expect(state.total).toBe(payload.total)
      expect(state.itemCount).toBe(2)
      expect(state.error).toBe(null)
    })

    it('should handle addToCartFailure', () => {
      const error = 'Failed to add to cart'
      const state = cartReducer(initialState, addToCartFailure(error))
      expect(state.loading).toBe(false)
      expect(state.error).toBe(error)
    })
  })

  describe('updateCartItem actions', () => {
    it('should handle updateCartItemStart', () => {
      const state = cartReducer(initialState, updateCartItemStart())
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle updateCartItemSuccess', () => {
      const payload = {
        items: [{ productId: '1', quantity: 3 }],
        total: 299.97,
      }
      const state = cartReducer(initialState, updateCartItemSuccess(payload))
      expect(state.loading).toBe(false)
      expect(state.items).toEqual(payload.items)
      expect(state.total).toBe(payload.total)
      expect(state.itemCount).toBe(3)
      expect(state.error).toBe(null)
    })

    it('should handle updateCartItemFailure', () => {
      const error = 'Failed to update cart item'
      const state = cartReducer(initialState, updateCartItemFailure(error))
      expect(state.loading).toBe(false)
      expect(state.error).toBe(error)
    })
  })

  describe('removeCartItem actions', () => {
    it('should handle removeCartItemStart', () => {
      const state = cartReducer(initialState, removeCartItemStart())
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle removeCartItemSuccess', () => {
      const payload = {
        items: [],
        total: 0,
      }
      const state = cartReducer(initialState, removeCartItemSuccess(payload))
      expect(state.loading).toBe(false)
      expect(state.items).toEqual(payload.items)
      expect(state.total).toBe(payload.total)
      expect(state.itemCount).toBe(0)
      expect(state.error).toBe(null)
    })

    it('should handle removeCartItemFailure', () => {
      const error = 'Failed to remove cart item'
      const state = cartReducer(initialState, removeCartItemFailure(error))
      expect(state.loading).toBe(false)
      expect(state.error).toBe(error)
    })
  })

  describe('clearCart actions', () => {
    it('should handle clearCartStart', () => {
      const state = cartReducer(initialState, clearCartStart())
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle clearCartSuccess', () => {
      const stateWithItems = {
        ...initialState,
        items: [{ productId: '1', quantity: 2 }],
        total: 199.98,
        itemCount: 2,
      }
      const state = cartReducer(stateWithItems, clearCartSuccess())
      expect(state.loading).toBe(false)
      expect(state.items).toEqual([])
      expect(state.total).toBe(0)
      expect(state.itemCount).toBe(0)
      expect(state.error).toBe(null)
    })

    it('should handle clearCartFailure', () => {
      const error = 'Failed to clear cart'
      const state = cartReducer(initialState, clearCartFailure(error))
      expect(state.loading).toBe(false)
      expect(state.error).toBe(error)
    })
  })

  describe('setCart', () => {
    it('should handle setCart', () => {
      const payload = {
        items: [{ productId: '1', quantity: 2 }, { productId: '2', quantity: 1 }],
        total: 349.97,
      }
      const state = cartReducer(initialState, setCart(payload))
      expect(state.items).toEqual(payload.items)
      expect(state.total).toBe(payload.total)
      expect(state.itemCount).toBe(3)
    })
  })

  describe('clearError', () => {
    it('should handle clearError', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error',
      }
      const state = cartReducer(stateWithError, clearError())
      expect(state.error).toBe(null)
    })
  })
})
