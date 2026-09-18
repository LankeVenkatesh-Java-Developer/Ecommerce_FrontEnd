import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Products from './Products'

// Mock dependencies
vi.mock('../../services/productService', () => ({
  productService: {
    getAllProductsAdmin: vi.fn(),
    getAllCategoriesAdmin: vi.fn(),
    getAllProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    updateProductStatus: vi.fn(),
    getProductById: vi.fn(),
  },
}))

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const { productService } = await import('../../services/productService')
const { toast } = await import('react-toastify')

describe('Admin Products Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.confirm = vi.fn(() => true)
    window.prompt = vi.fn(() => '10')
  })

  it('should render loading state initially', () => {
    productService.getAllProductsAdmin.mockImplementation(() => new Promise(() => {}))
    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render products page after loading', async () => {
    productService.getAllProductsAdmin.mockResolvedValue({
      content: [
        { id: '1', name: 'Product 1', sku: 'SKU1', price: 99.99, quantity: 10, status: 'ACTIVE' },
      ],
      totalPages: 1,
    })
    productService.getAllCategoriesAdmin.mockResolvedValue([
      { id: '1', name: 'Electronics' },
    ])

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('Add Product')).toBeInTheDocument()
    })
  })

  it('should render products table', async () => {
    productService.getAllProductsAdmin.mockResolvedValue({
      content: [
        { id: '1', name: 'Product 1', sku: 'SKU1', price: 99.99, quantity: 10, status: 'ACTIVE' },
      ],
      totalPages: 1,
    })
    productService.getAllCategoriesAdmin.mockResolvedValue([
      { id: '1', name: 'Electronics' },
    ])

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument()
      expect(screen.getByText('SKU1')).toBeInTheDocument()
      expect(screen.getByText('$99.99')).toBeInTheDocument()
    })
  })

  it('should render filter controls', async () => {
    productService.getAllProductsAdmin.mockResolvedValue({ content: [], totalPages: 1 })
    productService.getAllCategoriesAdmin.mockResolvedValue([
      { id: '1', name: 'Electronics' },
    ])

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument()
      expect(screen.getByText('All Categories')).toBeInTheDocument()
      expect(screen.getByText('All Status')).toBeInTheDocument()
    })
  })

  it('should open add product modal', async () => {
    productService.getAllProductsAdmin.mockResolvedValue({ content: [], totalPages: 1 })
    productService.getAllCategoriesAdmin.mockResolvedValue([
      { id: '1', name: 'Electronics' },
    ])

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )

    await waitFor(() => {
      const addButton = screen.getByText('Add Product')
      fireEvent.click(addButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Add New Product')).toBeInTheDocument()
    })
  })

  it('should open edit product modal', async () => {
    const product = { id: '1', name: 'Product 1', sku: 'SKU1', price: 99.99, quantity: 10, status: 'ACTIVE' }
    productService.getAllProductsAdmin.mockResolvedValue({
      content: [product],
      totalPages: 1,
    })
    productService.getAllCategoriesAdmin.mockResolvedValue([
      { id: '1', name: 'Electronics' },
    ])

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )

    await waitFor(() => {
      const editButton = screen.getByTitle('Edit')
      fireEvent.click(editButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Edit Product')).toBeInTheDocument()
    })
  })

  it('should delete product on confirmation', async () => {
    productService.getAllProductsAdmin.mockResolvedValue({
      content: [{ id: '1', name: 'Product 1', sku: 'SKU1', price: 99.99, quantity: 10, status: 'ACTIVE' }],
      totalPages: 1,
    })
    productService.getAllCategoriesAdmin.mockResolvedValue([])
    productService.deleteProduct.mockResolvedValue({ message: 'Product deleted' })

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )

    await waitFor(() => {
      const deleteButton = screen.getByTitle('Delete')
      fireEvent.click(deleteButton)
    })

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith('1')
      expect(toast.success).toHaveBeenCalledWith('Product deleted successfully')
    })
  })

  it('should not delete product when cancelled', async () => {
    window.confirm.mockReturnValue(false)
    productService.getAllProductsAdmin.mockResolvedValue({
      content: [{ id: '1', name: 'Product 1', sku: 'SKU1', price: 99.99, quantity: 10, status: 'ACTIVE' }],
      totalPages: 1,
    })
    productService.getAllCategoriesAdmin.mockResolvedValue([])
    productService.deleteProduct.mockResolvedValue({ message: 'Product deleted' })

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )

    await waitFor(() => {
      const deleteButton = screen.getByTitle('Delete')
      fireEvent.click(deleteButton)
    })

    await waitFor(() => {
      expect(productService.deleteProduct).not.toHaveBeenCalled()
    })
  })

  it('should toggle product status', async () => {
    const product = { id: '1', name: 'Product 1', sku: 'SKU1', price: 99.99, quantity: 10, status: 'ACTIVE' }
    productService.getAllProductsAdmin.mockResolvedValue({
      content: [product],
      totalPages: 1,
    })
    productService.getAllCategoriesAdmin.mockResolvedValue([])
    productService.updateProductStatus.mockResolvedValue({ message: 'Status updated' })

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )

    await waitFor(() => {
      const statusButton = screen.getByTitle('Toggle Status')
      fireEvent.click(statusButton)
    })

    await waitFor(() => {
      expect(productService.updateProductStatus).toHaveBeenCalledWith('1', 'INACTIVE')
      expect(toast.success).toHaveBeenCalledWith('Product inactive successfully')
    })
  })

  it('should handle search functionality', async () => {
    productService.getAllProductsAdmin.mockResolvedValue({ content: [], totalPages: 1 })
    productService.getAllCategoriesAdmin.mockResolvedValue([])
    productService.getAllProducts.mockResolvedValue({
      content: [{ id: '1', name: 'Test Product' }],
      totalPages: 1,
    })

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search products...')
      fireEvent.change(searchInput, { target: { value: 'Test' } })
      const searchButton = screen.getByText('Search')
      fireEvent.click(searchButton)
    })

    await waitFor(() => {
      expect(productService.getAllProducts).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Test' })
      )
    })
  })

  it('should reset filters', async () => {
    productService.getAllProductsAdmin.mockResolvedValue({ content: [], totalPages: 1 })
    productService.getAllCategoriesAdmin.mockResolvedValue([])

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )

    await waitFor(() => {
      const resetButton = screen.getByText('Reset')
      fireEvent.click(resetButton)
    })

    await waitFor(() => {
      expect(productService.getAllProductsAdmin).toHaveBeenCalled()
    })
  })

  it('should show empty state when no products', async () => {
    productService.getAllProductsAdmin.mockResolvedValue({ content: [], totalPages: 1 })
    productService.getAllCategoriesAdmin.mockResolvedValue([])

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('No products found matching your criteria.')).toBeInTheDocument()
    })
  })
})
