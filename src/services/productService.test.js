import { describe, it, expect, vi, beforeEach } from 'vitest'
import { productService } from './productService'
import { productsApi } from '../api/axiosConfig'

// Mock dependencies
vi.mock('../api/axiosConfig', () => ({
  productsApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllProducts', () => {
    it('should get all products without params', async () => {
      const mockResponse = {
        data: {
          products: [{ id: '1', name: 'Product 1' }],
          page: 1,
          pageSize: 12,
          total: 1,
          totalPages: 1,
        },
      }
      productsApi.get.mockResolvedValue(mockResponse)

      const result = await productService.getAllProducts()

      expect(productsApi.get).toHaveBeenCalledWith('/api/products', { params: {} })
      expect(result).toEqual(mockResponse.data)
    })

    it('should get all products with params', async () => {
      const params = { page: 2, categoryId: '1' }
      const mockResponse = {
        data: {
          products: [{ id: '1', name: 'Product 1' }],
          page: 2,
          pageSize: 12,
          total: 1,
          totalPages: 1,
        },
      }
      productsApi.get.mockResolvedValue(mockResponse)

      const result = await productService.getAllProducts(params)

      expect(productsApi.get).toHaveBeenCalledWith('/api/products', { params })
      expect(result).toEqual(mockResponse.data)
    })

    it('should filter out undefined and empty string params', async () => {
      const params = { page: 2, categoryId: '', search: undefined }
      const mockResponse = {
        data: {
          products: [],
          page: 2,
          pageSize: 12,
          total: 0,
          totalPages: 0,
        },
      }
      productsApi.get.mockResolvedValue(mockResponse)

      await productService.getAllProducts(params)

      expect(productsApi.get).toHaveBeenCalledWith('/api/products', { params: { page: 2 } })
    })
  })

  describe('getAllProductsAdmin', () => {
    it('should get all products for admin', async () => {
      const mockResponse = {
        data: {
          products: [{ id: '1', name: 'Product 1' }],
        },
      }
      productsApi.get.mockResolvedValue(mockResponse)

      const result = await productService.getAllProductsAdmin()

      expect(productsApi.get).toHaveBeenCalledWith('/products/admin/all', { params: {} })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getProductById', () => {
    it('should get product by id', async () => {
      const productId = '1'
      const mockResponse = {
        data: { id: '1', name: 'Product 1' },
      }
      productsApi.get.mockResolvedValue(mockResponse)

      const result = await productService.getProductById(productId)

      expect(productsApi.get).toHaveBeenCalledWith(`/api/products/${productId}`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getProductsByCategory', () => {
    it('should get products by category', async () => {
      const categoryId = '1'
      const params = { page: 1 }
      const mockResponse = {
        data: {
          products: [{ id: '1', name: 'Product 1' }],
          page: 1,
          pageSize: 12,
          total: 1,
          totalPages: 1,
        },
      }
      productsApi.get.mockResolvedValue(mockResponse)

      const result = await productService.getProductsByCategory(categoryId, params)

      expect(productsApi.get).toHaveBeenCalledWith('/api/products', {
        params: { ...params, categoryId: '1' },
      })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('searchProducts', () => {
    it('should search products', async () => {
      const searchTerm = 'test'
      const params = { page: 1 }
      const mockResponse = {
        data: {
          products: [{ id: '1', name: 'Test Product' }],
          page: 1,
          pageSize: 12,
          total: 1,
          totalPages: 1,
        },
      }
      productsApi.get.mockResolvedValue(mockResponse)

      const result = await productService.searchProducts(searchTerm, params)

      expect(productsApi.get).toHaveBeenCalledWith('/api/products', {
        params: { ...params, search: searchTerm },
      })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('createProduct', () => {
    it('should create product successfully', async () => {
      const productData = { name: 'New Product', price: 99.99 }
      const mockResponse = {
        data: { id: '2', ...productData },
      }
      productsApi.post.mockResolvedValue(mockResponse)

      const result = await productService.createProduct(productData)

      expect(productsApi.post).toHaveBeenCalledWith('/api/products', productData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const productId = '1'
      const productData = { name: 'Updated Product', price: 149.99 }
      const mockResponse = {
        data: { id: '1', ...productData },
      }
      productsApi.put.mockResolvedValue(mockResponse)

      const result = await productService.updateProduct(productId, productData)

      expect(productsApi.put).toHaveBeenCalledWith(`/api/products/${productId}`, productData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      const productId = '1'
      const mockResponse = {
        data: { message: 'Product deleted' },
      }
      productsApi.delete.mockResolvedValue(mockResponse)

      const result = await productService.deleteProduct(productId)

      expect(productsApi.delete).toHaveBeenCalledWith(`/api/products/${productId}`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('updateProductStatus', () => {
    it('should update product status successfully', async () => {
      const productId = '1'
      const status = 'ACTIVE'
      const mockResponse = {
        data: { id: '1', status: 'ACTIVE' },
      }
      productsApi.patch.mockResolvedValue(mockResponse)

      const result = await productService.updateProductStatus(productId, status)

      expect(productsApi.patch).toHaveBeenCalledWith(
        `/api/products/${productId}/status?status=ACTIVE`,
        {}
      )
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getAllCategories', () => {
    it('should get all categories', async () => {
      const mockResponse = {
        data: [{ id: '1', name: 'Electronics' }],
      }
      productsApi.get.mockResolvedValue(mockResponse)

      const result = await productService.getAllCategories()

      expect(productsApi.get).toHaveBeenCalledWith('/api/categories')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getAllCategoriesAdmin', () => {
    it('should get all categories for admin', async () => {
      const mockResponse = {
        data: [{ id: '1', name: 'Electronics' }],
      }
      productsApi.get.mockResolvedValue(mockResponse)

      const result = await productService.getAllCategoriesAdmin()

      expect(productsApi.get).toHaveBeenCalledWith('/categories/admin/all')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('getCategoryById', () => {
    it('should get category by id', async () => {
      const categoryId = '1'
      const mockResponse = {
        data: { id: '1', name: 'Electronics' },
      }
      productsApi.get.mockResolvedValue(mockResponse)

      const result = await productService.getCategoryById(categoryId)

      expect(productsApi.get).toHaveBeenCalledWith(`/api/categories/${categoryId}`)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('createCategory', () => {
    it('should create category successfully', async () => {
      const categoryData = { name: 'New Category' }
      const mockResponse = {
        data: { id: '2', ...categoryData },
      }
      productsApi.post.mockResolvedValue(mockResponse)

      const result = await productService.createCategory(categoryData)

      expect(productsApi.post).toHaveBeenCalledWith('/api/categories', categoryData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('updateCategory', () => {
    it('should update category successfully', async () => {
      const categoryId = '1'
      const categoryData = { name: 'Updated Category' }
      const mockResponse = {
        data: { id: '1', ...categoryData },
      }
      productsApi.put.mockResolvedValue(mockResponse)

      const result = await productService.updateCategory(categoryId, categoryData)

      expect(productsApi.put).toHaveBeenCalledWith(`/api/categories/${categoryId}`, categoryData)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
      const categoryId = '1'
      const mockResponse = {
        data: { message: 'Category deleted' },
      }
      productsApi.delete.mockResolvedValue(mockResponse)

      const result = await productService.deleteCategory(categoryId)

      expect(productsApi.delete).toHaveBeenCalledWith(`/api/categories/${categoryId}`)
      expect(result).toEqual(mockResponse.data)
    })
  })
})
