import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorMessage from './ErrorMessage'

describe('ErrorMessage Component', () => {
  it('should not render when message is not provided', () => {
    const { container } = render(<ErrorMessage />)
    expect(container.firstChild).toBeNull()
  })

  it('should render error message when provided', () => {
    render(<ErrorMessage message="Test error message" />)
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('should render dismiss button when onDismiss is provided', () => {
    const onDismiss = vi.fn()
    render(<ErrorMessage message="Test error" onDismiss={onDismiss} />)
    const dismissButton = screen.getByText('×')
    expect(dismissButton).toBeInTheDocument()
  })

  it('should call onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn()
    render(<ErrorMessage message="Test error" onDismiss={onDismiss} />)
    const dismissButton = screen.getByText('×')
    dismissButton.click()
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('should not render dismiss button when onDismiss is not provided', () => {
    render(<ErrorMessage message="Test error" />)
    const dismissButton = screen.queryByText('×')
    expect(dismissButton).not.toBeInTheDocument()
  })

  it('should render error icon', () => {
    render(<ErrorMessage message="Test error" />)
    const icon = document.querySelector('.error-icon')
    expect(icon).toBeInTheDocument()
  })
})
