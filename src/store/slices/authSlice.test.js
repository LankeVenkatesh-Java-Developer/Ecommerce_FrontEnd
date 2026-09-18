import { describe, it, expect, beforeEach, vi } from 'vitest'
import authReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  updateUser,
  clearError,
} from './authSlice'

// Mock tokenUtils
vi.mock('../../utils/tokenUtils', () => ({
  getUser: vi.fn(() => null),
  setUser: vi.fn(),
  removeUser: vi.fn(),
  getToken: vi.fn(() => null),
  clearAuthData: vi.fn(),
  getRole: vi.fn(() => null),
  extractRoleFromToken: vi.fn(() => null),
}))

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    role: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })
  })

  describe('login actions', () => {
    it('should handle loginStart', () => {
      const state = authReducer(initialState, loginStart())
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle loginSuccess', () => {
      const payload = {
        user: { id: '1', email: 'test@example.com', role: 'USER' },
        token: 'test-token',
      }
      const state = authReducer(initialState, loginSuccess(payload))
      expect(state.loading).toBe(false)
      expect(state.user).toEqual(payload.user)
      expect(state.token).toBe(payload.token)
      expect(state.role).toBe('USER')
      expect(state.isAuthenticated).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle loginFailure', () => {
      const error = 'Invalid credentials'
      const state = authReducer(initialState, loginFailure(error))
      expect(state.loading).toBe(false)
      expect(state.error).toBe(error)
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('register actions', () => {
    it('should handle registerStart', () => {
      const state = authReducer(initialState, registerStart())
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle registerSuccess', () => {
      const state = authReducer(initialState, registerSuccess())
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
    })

    it('should handle registerFailure', () => {
      const error = 'Registration failed'
      const state = authReducer(initialState, registerFailure(error))
      expect(state.loading).toBe(false)
      expect(state.error).toBe(error)
    })
  })

  describe('logout', () => {
    it('should handle logout', () => {
      const loggedInState = {
        user: { id: '1', email: 'test@example.com' },
        token: 'test-token',
        role: 'USER',
        isAuthenticated: true,
        loading: false,
        error: null,
      }
      const state = authReducer(loggedInState, logout())
      expect(state.user).toBe(null)
      expect(state.token).toBe(null)
      expect(state.role).toBe(null)
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBe(null)
    })
  })

  describe('updateUser', () => {
    it('should handle updateUser', () => {
      const state = {
        ...initialState,
        user: { id: '1', email: 'test@example.com', firstName: ' John' },
      }
      const updates = { firstName: 'Jane', lastName: 'Doe' }
      const newState = authReducer(state, updateUser(updates))
      expect(newState.user).toEqual({
        id: '1',
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
      })
    })
  })

  describe('clearError', () => {
    it('should handle clearError', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error',
      }
      const state = authReducer(stateWithError, clearError())
      expect(state.error).toBe(null)
    })
  })
})
