import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotFound from './NotFound'

describe('NotFound Page', () => {
  it('should render 404 error code', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    )
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('should render page not found title', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    )
    expect(screen.getByText('Page Not Found')).toBeInTheDocument()
  })

  it('should render error message', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    )
    expect(screen.getByText(/The page you are looking for doesn't exist or has been moved/)).toBeInTheDocument()
  })

  it('should render back to home button', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    )
    expect(screen.getByText('Back to Home')).toBeInTheDocument()
  })

  it('should have home link pointing to root', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    )
    const homeLink = screen.getByText('Back to Home').closest('a')
    expect(homeLink).toHaveAttribute('href', '/')
  })
})
