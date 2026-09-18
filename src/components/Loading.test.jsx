import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Loading from './Loading'

describe('Loading Component', () => {
  it('should render with medium size by default', () => {
    render(<Loading />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('w-12', 'h-12')
  })

  it('should render with small size', () => {
    render(<Loading size="small" />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toHaveClass('w-8', 'h-8')
  })

  it('should render with large size', () => {
    render(<Loading size="large" />)
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toHaveClass('w-16', 'h-16')
  })

  it('should display loading text', () => {
    render(<Loading />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should have correct structure and classes', () => {
    const { container } = render(<Loading />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'p-8')
  })
})
