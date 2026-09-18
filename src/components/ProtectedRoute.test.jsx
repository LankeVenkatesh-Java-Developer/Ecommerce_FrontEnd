import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import ProtectedRoute from './ProtectedRoute'
import Loading from './Loading'
import authReducer from '../store/slices/authSlice'

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

describe('ProtectedRoute Component', () => {
  it('should render Loading when auth is loading', () => {
    const authState = {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: true,
      error: null,
    }
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      authState
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should redirect to login when not authenticated', () => {
    const authState = {
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    }
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      authState
    )
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should render children when authenticated without admin requirement', () => {
    const authState = {
      user: { id: '1', email: 'test@example.com', role: 'USER' },
      token: 'test-token',
      role: 'USER',
      isAuthenticated: true,
      loading: false,
      error: null,
    }
    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      authState
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should render children when authenticated with admin role and requireAdmin', () => {
    const authState = {
      user: { id: '1', email: 'admin@example.com', role: 'ADMIN' },
      token: 'test-token',
      role: 'ADMIN',
      isAuthenticated: true,
      loading: false,
      error: null,
    }
    renderWithProviders(
      <ProtectedRoute requireAdmin>
        <div>Admin Content</div>
      </ProtectedRoute>,
      authState
    )
    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })

  it('should render children when authenticated with super admin role and requireSuperAdmin', () => {
    const authState = {
      user: { id: '1', email: 'superadmin@example.com', role: 'SUPER_ADMIN' },
      token: 'test-token',
      role: 'SUPER_ADMIN',
      isAuthenticated: true,
      loading: false,
      error: null,
    }
    renderWithProviders(
      <ProtectedRoute requireSuperAdmin>
        <div>Super Admin Content</div>
      </ProtectedRoute>,
      authState
    )
    expect(screen.getByText('Super Admin Content')).toBeInTheDocument()
  })

  it('should redirect to unauthorized when user is not admin but requireAdmin is true', () => {
    const authState = {
      user: { id: '1', email: 'user@example.com', role: 'USER' },
      token: 'test-token',
      role: 'USER',
      isAuthenticated: true,
      loading: false,
      error: null,
    }
    renderWithProviders(
      <ProtectedRoute requireAdmin>
        <div>Admin Content</div>
      </ProtectedRoute>,
      authState
    )
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
  })

  it('should redirect to unauthorized when user is admin but requireSuperAdmin is true', () => {
    const authState = {
      user: { id: '1', email: 'admin@example.com', role: 'ADMIN' },
      token: 'test-token',
      role: 'ADMIN',
      isAuthenticated: true,
      loading: false,
      error: null,
    }
    renderWithProviders(
      <ProtectedRoute requireSuperAdmin>
        <div>Super Admin Content</div>
      </ProtectedRoute>,
      authState
    )
    expect(screen.queryByText('Super Admin Content')).not.toBeInTheDocument()
  })

  it('should render children when super admin and requireAdmin is true', () => {
    const authState = {
      user: { id: '1', email: 'superadmin@example.com', role: 'SUPER_ADMIN' },
      token: 'test-token',
      role: 'SUPER_ADMIN',
      isAuthenticated: true,
      loading: false,
      error: null,
    }
    renderWithProviders(
      <ProtectedRoute requireAdmin>
        <div>Admin Content</div>
      </ProtectedRoute>,
      authState
    )
    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })
})
