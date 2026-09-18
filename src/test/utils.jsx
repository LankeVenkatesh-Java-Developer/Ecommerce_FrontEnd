import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../store/slices/authSlice'
import cartReducer from '../store/slices/cartSlice'
import productReducer from '../store/slices/productSlice'

// Create a custom render function that includes providers
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        cart: cartReducer,
        products: productReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    )
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Mock user data
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'USER',
}

export const mockAdminUser = {
  id: '2',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'ADMIN',
}

// Mock product data
export const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  stock: 10,
  category: 'Electronics',
  imageUrl: 'https://example.com/image.jpg',
}

export const mockProducts = [
  mockProduct,
  {
    id: '2',
    name: 'Test Product 2',
    description: 'Test Description 2',
    price: 149.99,
    stock: 5,
    category: 'Clothing',
    imageUrl: 'https://example.com/image2.jpg',
  },
]

// Mock cart data
export const mockCartItem = {
  productId: '1',
  quantity: 2,
  product: mockProduct,
}

export const mockCart = {
  items: [mockCartItem],
  total: 199.98,
}

// Mock order data
export const mockOrder = {
  id: '1',
  userId: '1',
  items: [mockCartItem],
  total: 199.98,
  status: 'PENDING',
  shippingAddress: {
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    country: 'USA',
  },
  createdAt: '2024-01-01T00:00:00Z',
}

// Mock axios responses
export const mockAxiosResponse = (data, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
})

export const mockAxiosError = (message, status = 400) => ({
  response: {
    data: { message },
    status,
    statusText: 'Error',
    headers: {},
    config: {},
  },
  message,
})
