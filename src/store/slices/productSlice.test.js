import { describe, it, expect } from 'vitest'
import productReducer, {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdStart,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
} from './productSlice'

describe('productSlice', () => {
  const initialState = {
    products: [],
    categories: [],
    currentProduct: null,
    currentCategory: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 12,
      total: 0,
      totalPages: 0,
    },
    filters: {
      categoryId: null,
      search: '',
      minPrice: null,
      maxPrice: null,
      sortBy: null,
    },
  }

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(productReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })
  })

  describe('fetchProducts actions', () => {
    it('should handle fetchProductsStart', () => {
      const state = productReducer(initialState, fetchProductsStart())
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle fetchProductsSuccess', () => {
      const payload = {
        products: [{ id: '1', name: 'Product 1' }],
        page: 1,
        pageSize: 12,
        total: 1,
        totalPages: 1,
      }
      const state = productReducer(initialState, fetchProductsSuccess(payload))
      expect(state.loading).toBe(false)
      expect(state.products).toEqual(payload.products)
      expect(state.pagination).toEqual({
        page: payload.page,
        pageSize: payload.pageSize,
        total: payload.total,
        totalPages: payload.totalPages,
      })
      expect(state.error).toBe(null)
    })

    it('should handle fetchProductsFailure', () => {
      const error = 'Failed to fetch products'
      const state = productReducer(initialState, fetchProductsFailure(error))
      expect(state.loading).toBe(false)
      expect(state.error).toBe(error)
    })
  })

  describe('fetchProductById actions', () => {
    it('should handle fetchProductByIdStart', () => {
      const state = productReducer(initialState, fetchProductByIdStart())
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle fetchProductByIdSuccess', () => {
      const product = { id: '1', name: 'Product 1' }
      const state = productReducer(initialState, fetchProductByIdSuccess(product))
      expect(state.loading).toBe(false)
      expect(state.currentProduct).toEqual(product)
      expect(state.error).toBe(null)
    })

    it('should handle fetchProductByIdFailure', () => {
      const error = 'Failed to fetch product'
      const state = productReducer(initialState, fetchProductByIdFailure(error))
      expect(state.loading).toBe(false)
      expect(state.error).toBe(error)
    })
  })

  describe('fetchCategories actions', () => {
    it('should handle fetchCategoriesStart', () => {
      const state = productReducer(initialState, fetchCategoriesStart())
      expect(state.loading).toBe(true)
      expect(state.error).toBe(null)
    })

    it('should handle fetchCategoriesSuccess', () => {
      const categories = [{ id: '1', name: 'Electronics' }]
      const state = productReducer(initialState, fetchCategoriesSuccess(categories))
      expect(state.loading).toBe(false)
      expect(state.categories).toEqual(categories)
      expect(state.error).toBe(null)
    })

    it('should handle fetchCategoriesFailure', () => {
      const error = 'Failed to fetch categories'
      const state = productReducer(initialState, fetchCategoriesFailure(error))
      expect(state.loading).toBe(false)
      expect(state.error).toBe(error)
    })
  })

  describe('setFilters', () => {
    it('should handle setFilters', () => {
      const filters = { categoryId: '1', search: 'test' }
      const state = productReducer(initialState, setFilters(filters))
      expect(state.filters).toEqual({ ...initialState.filters, ...filters })
    })

    it('should update existing filters', () => {
      const stateWithFilters = {
        ...initialState,
        filters: { categoryId: '1', search: 'test' },
      }
      const newFilters = { search: 'new search' }
      const state = productReducer(stateWithFilters, setFilters(newFilters))
      expect(state.filters).toEqual({
        categoryId: '1',
        search: 'new search',
      })
    })
  })

  describe('clearFilters', () => {
    it('should handle clearFilters', () => {
      const stateWithFilters = {
        ...initialState,
        filters: { categoryId: '1', search: 'test', minPrice: 10, maxPrice: 100, sortBy: 'price' },
      }
      const state = productReducer(stateWithFilters, clearFilters())
      expect(state.filters).toEqual({
        categoryId: null,
        search: '',
        minPrice: null,
        maxPrice: null,
        sortBy: null,
      })
    })
  })

  describe('setPagination', () => {
    it('should handle setPagination', () => {
      const pagination = { page: 2, pageSize: 24 }
      const state = productReducer(initialState, setPagination(pagination))
      expect(state.pagination).toEqual({ ...initialState.pagination, ...pagination })
    })
  })

  describe('clearError', () => {
    it('should handle clearError', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error',
      }
      const state = productReducer(stateWithError, clearError())
      expect(state.error).toBe(null)
    })
  })
})
