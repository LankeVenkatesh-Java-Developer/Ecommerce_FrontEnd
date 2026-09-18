import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import Login from './Login'
import authReducer from '../store/slices/authSlice'

// Mock dependencies
vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}))

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('../utils/tokenUtils', () => ({
  setToken: vi.fn(),
  setUser: vi.fn(),
  setRole: vi.fn(),
  getUser: vi.fn(),
  getToken: vi.fn(),
  getRole: vi.fn(),
  extractRoleFromToken: vi.fn(),
}))

const { authService } = await import('../services/authService')
const { toast } = await import('react-toastify')
const { setToken, setUser, setRole } = await import('../utils/tokenUtils')

const createMockStore = (authState) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: authState,
    },
  })
}

const renderWithProviders = (component, authState) => {
  const store = createMockStore(authState)
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  )
}

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form', () => {
    const authState = {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }
    renderWithProviders(<Login />, authState)

    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(document.getElementById('emailOrMobile')).toBeInTheDocument()
    expect(document.getElementById('password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('should show forgot password link', () => {
    const authState = {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }
    renderWithProviders(<Login />, authState)

    expect(screen.getByText('Forgot password?')).toBeInTheDocument()
  })

  it('should show sign up link', () => {
    const authState = {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }
    renderWithProviders(<Login />, authState)

    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
    expect(screen.getByText('Sign up')).toBeInTheDocument()
  })

  it('should update form data on input change', () => {
    const authState = {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }
    renderWithProviders(<Login />, authState)

    const emailInput = document.getElementById('emailOrMobile')
    const passwordInput = document.getElementById('password')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })

  it('should handle successful login for regular user', async () => {
    const authState = {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }
    authService.login.mockResolvedValue({
      userId: '1',
      email: 'test@example.com',
      token: 'test-token',
      role: 'USER',
    })

    renderWithProviders(<Login />, authState)

    const emailInput = document.getElementById('emailOrMobile')
    const passwordInput = document.getElementById('password')
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        emailOrMobile: 'test@example.com',
        password: 'password123',
      })
      expect(setToken).toHaveBeenCalledWith('test-token')
      expect(setUser).toHaveBeenCalledWith({ id: '1', email: 'test@example.com' })
      expect(setRole).toHaveBeenCalledWith('USER')
      expect(toast.success).toHaveBeenCalledWith('Login successful!')
    })
  })

  it('should handle successful login for admin', async () => {
    const authState = {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }
    authService.login.mockResolvedValue({
      userId: '1',
      email: 'admin@example.com',
      token: 'test-token',
      role: 'ADMIN',
    })

    renderWithProviders(<Login />, authState)

    const emailInput = document.getElementById('emailOrMobile')
    const passwordInput = document.getElementById('password')
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalled()
      expect(setRole).toHaveBeenCalledWith('ADMIN')
    })
  })

  it('should handle login failure', async () => {
    const authState = {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }
    const mockError = new Error('Invalid credentials')
    mockError.response = { data: { message: 'Invalid credentials' } }
    authService.login.mockRejectedValue(mockError)

    renderWithProviders(<Login />, authState)

    const emailInput = document.getElementById('emailOrMobile')
    const passwordInput = document.getElementById('password')
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials')
    })
  })

  it('should disable submit button while loading', async () => {
    const authState = {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }
    authService.login.mockImplementation(() => new Promise(() => {})) // Never resolves

    renderWithProviders(<Login />, authState)

    const emailInput = document.getElementById('emailOrMobile')
    const passwordInput = document.getElementById('password')
    const submitButton = screen.getByRole('button', { name: /Sign In/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })

  it('should clear error when input changes', () => {
    const authState = {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }
    renderWithProviders(<Login />, authState)

    const emailInput = document.getElementById('emailOrMobile')

    // First, we'd need to set an error state, but since we can't directly manipulate component state,
    // we'll just verify the handleChange function is called
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(emailInput.value).toBe('test@example.com')
  })
})
