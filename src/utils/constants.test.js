import { describe, it, expect } from 'vitest'
import {
  APP_NAME,
  PAGINATION,
  PRODUCT_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  ADDRESS_TYPES,
  TOAST_CONFIG,
} from './constants'

describe('constants', () => {
  describe('APP_NAME', () => {
    it('should have correct app name', () => {
      expect(APP_NAME).toBe('E-Commerce Store')
    })
  })

  describe('PAGINATION', () => {
    it('should have correct default page size', () => {
      expect(PAGINATION.DEFAULT_PAGE_SIZE).toBe(12)
    })

    it('should have correct default page', () => {
      expect(PAGINATION.DEFAULT_PAGE).toBe(1)
    })
  })

  describe('PRODUCT_STATUS', () => {
    it('should have ACTIVE status', () => {
      expect(PRODUCT_STATUS.ACTIVE).toBe('ACTIVE')
    })

    it('should have INACTIVE status', () => {
      expect(PRODUCT_STATUS.INACTIVE).toBe('INACTIVE')
    })
  })

  describe('ORDER_STATUS', () => {
    it('should have PENDING status', () => {
      expect(ORDER_STATUS.PENDING).toBe('PENDING')
    })

    it('should have CONFIRMED status', () => {
      expect(ORDER_STATUS.CONFIRMED).toBe('CONFIRMED')
    })

    it('should have SHIPPED status', () => {
      expect(ORDER_STATUS.SHIPPED).toBe('SHIPPED')
    })

    it('should have DELIVERED status', () => {
      expect(ORDER_STATUS.DELIVERED).toBe('DELIVERED')
    })

    it('should have CANCELLED status', () => {
      expect(ORDER_STATUS.CANCELLED).toBe('CANCELLED')
    })
  })

  describe('PAYMENT_STATUS', () => {
    it('should have PENDING status', () => {
      expect(PAYMENT_STATUS.PENDING).toBe('PENDING')
    })

    it('should have COMPLETED status', () => {
      expect(PAYMENT_STATUS.COMPLETED).toBe('COMPLETED')
    })

    it('should have FAILED status', () => {
      expect(PAYMENT_STATUS.FAILED).toBe('FAILED')
    })

    it('should have REFUNDED status', () => {
      expect(PAYMENT_STATUS.REFUNDED).toBe('REFUNDED')
    })
  })

  describe('ADDRESS_TYPES', () => {
    it('should have HOME type', () => {
      expect(ADDRESS_TYPES.HOME).toBe('HOME')
    })

    it('should have WORK type', () => {
      expect(ADDRESS_TYPES.WORK).toBe('WORK')
    })

    it('should have OTHER type', () => {
      expect(ADDRESS_TYPES.OTHER).toBe('OTHER')
    })
  })

  describe('TOAST_CONFIG', () => {
    it('should have correct position', () => {
      expect(TOAST_CONFIG.position).toBe('top-right')
    })

    it('should have correct autoClose', () => {
      expect(TOAST_CONFIG.autoClose).toBe(3000)
    })

    it('should have hideProgressBar as false', () => {
      expect(TOAST_CONFIG.hideProgressBar).toBe(false)
    })

    it('should have closeOnClick as true', () => {
      expect(TOAST_CONFIG.closeOnClick).toBe(true)
    })

    it('should have pauseOnHover as true', () => {
      expect(TOAST_CONFIG.pauseOnHover).toBe(true)
    })

    it('should have draggable as true', () => {
      expect(TOAST_CONFIG.draggable).toBe(true)
    })
  })
})
