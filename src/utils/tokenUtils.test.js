import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  getRole,
  setRole,
  removeRole,
  extractRoleFromToken,
  isAuthenticated,
  isAdmin,
  clearAuthData,
  getTokenExpiry,
  isTokenExpiringSoon,
  isTokenExpired,
} from './tokenUtils'

describe('tokenUtils', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Token operations', () => {
    it('should set and get token', () => {
      setToken('test-token')
      expect(getToken()).toBe('test-token')
    })

    it('should set token with custom expiry', () => {
      setToken('test-token', 3600000)
      expect(getToken()).toBe('test-token')
      expect(localStorage.getItem('tokenExpiry')).toBeTruthy()
    })

    it('should remove token', () => {
      setToken('test-token')
      removeToken()
      expect(getToken()).toBeNull()
      expect(localStorage.getItem('tokenExpiry')).toBeNull()
    })

    it('should return null when token does not exist', () => {
      expect(getToken()).toBeNull()
    })
  })

  describe('User operations', () => {
    it('should set and get user', () => {
      const user = { id: '1', email: 'test@example.com', role: 'USER' }
      setUser(user)
      expect(getUser()).toEqual(user)
    })

    it('should remove user', () => {
      const user = { id: '1', email: 'test@example.com' }
      setUser(user)
      removeUser()
      expect(getUser()).toBeNull()
    })

    it('should return null when user does not exist', () => {
      expect(getUser()).toBeNull()
    })
  })

  describe('Role operations', () => {
    it('should set and get role', () => {
      setRole('ADMIN')
      expect(getRole()).toBe('ADMIN')
    })

    it('should remove role', () => {
      setRole('ADMIN')
      removeRole()
      expect(getRole()).toBeNull()
    })

    it('should return null when role does not exist', () => {
      expect(getRole()).toBeNull()
    })
  })

  describe('extractRoleFromToken', () => {
    it('should extract role from valid JWT token', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4ifQ.signature'
      const role = extractRoleFromToken(token)
      expect(role).toBe('ADMIN')
    })

    it('should return null for invalid token', () => {
      const role = extractRoleFromToken('invalid-token')
      expect(role).toBeNull()
    })

    it('should return null when token has no role', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIn0.signature'
      const role = extractRoleFromToken(token)
      expect(role).toBeNull()
    })

    it('should handle malformed token', () => {
      const role = extractRoleFromToken('not.a.jwt')
      expect(role).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      setToken('test-token')
      expect(isAuthenticated()).toBe(true)
    })

    it('should return false when token does not exist', () => {
      expect(isAuthenticated()).toBe(false)
    })
  })

  describe('isAdmin', () => {
    it('should return true for ADMIN role', () => {
      setRole('ADMIN')
      expect(isAdmin()).toBe(true)
    })

    it('should return true for SUPER_ADMIN role', () => {
      setRole('SUPER_ADMIN')
      expect(isAdmin()).toBe(true)
    })

    it('should return false for USER role', () => {
      setRole('USER')
      expect(isAdmin()).toBe(false)
    })

    it('should return false when role does not exist', () => {
      expect(isAdmin()).toBe(false)
    })
  })

  describe('clearAuthData', () => {
    it('should clear all auth data', () => {
      setToken('test-token')
      setUser({ id: '1' })
      setRole('ADMIN')
      
      clearAuthData()
      
      expect(getToken()).toBeNull()
      expect(getUser()).toBeNull()
      expect(getRole()).toBeNull()
    })
  })

  describe('getTokenExpiry', () => {
    it('should return token expiry time', () => {
      setToken('test-token', 3600000)
      const expiry = getTokenExpiry()
      expect(expiry).toBeGreaterThan(Date.now())
    })

    it('should return null when expiry does not exist', () => {
      expect(getTokenExpiry()).toBeNull()
    })
  })

  describe('isTokenExpiringSoon', () => {
    it('should return true when token is expiring soon', () => {
      const expiryTime = Date.now() + 4 * 60 * 1000 // 4 minutes from now (within 5 min threshold)
      localStorage.setItem('tokenExpiry', expiryTime.toString())
      expect(isTokenExpiringSoon()).toBe(true)
    })

    it('should return false when token is not expiring soon', () => {
      const expiryTime = Date.now() + 10 * 60 * 1000 // 10 minutes from now
      localStorage.setItem('tokenExpiry', expiryTime.toString())
      expect(isTokenExpiringSoon()).toBe(false)
    })

    it('should return false when expiry does not exist', () => {
      expect(isTokenExpiringSoon()).toBe(false)
    })
  })

  describe('isTokenExpired', () => {
    it('should return true when token is expired', () => {
      const expiryTime = Date.now() - 1000 // 1 second ago
      localStorage.setItem('tokenExpiry', expiryTime.toString())
      expect(isTokenExpired()).toBe(true)
    })

    it('should return false when token is not expired', () => {
      const expiryTime = Date.now() + 3600000 // 1 hour from now
      localStorage.setItem('tokenExpiry', expiryTime.toString())
      expect(isTokenExpired()).toBe(false)
    })

    it('should return false when expiry does not exist', () => {
      expect(isTokenExpired()).toBe(false)
    })
  })
})
