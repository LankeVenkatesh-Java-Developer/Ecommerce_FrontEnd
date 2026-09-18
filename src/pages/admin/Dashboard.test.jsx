import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from './Dashboard'

// Mock dependencies
vi.mock('../../services/productService', () => ({
  productService: {
    getAllProductsAdmin: vi.fn(),
    getAllCategoriesAdmin: vi.fn(),
  },
}))

vi.mock('../../services/adminManagementService', () => ({
  default: {
    getAllOrders: vi.fn(),
  },
}))

const { productService } = await import('../../services/productService')
const adminManagementService = await import('../../services/adminManagementService')

describe('Admin Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render dashboard component', () => {
    productService.getAllProductsAdmin.mockResolvedValue({ content: [] })
    productService.getAllCategoriesAdmin.mockResolvedValue([])
    adminManagementService.default.getAllOrders.mockResolvedValue([])

    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
    
    // Component should render without crashing
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should call API services on mount', () => {
    productService.getAllProductsAdmin.mockResolvedValue({ content: [] })
    productService.getAllCategoriesAdmin.mockResolvedValue([])
    adminManagementService.default.getAllOrders.mockResolvedValue([])

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )

    expect(productService.getAllProductsAdmin).toHaveBeenCalled()
    expect(productService.getAllCategoriesAdmin).toHaveBeenCalled()
    expect(adminManagementService.default.getAllOrders).toHaveBeenCalled()
  })
})
