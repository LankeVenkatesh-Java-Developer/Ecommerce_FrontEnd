import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SkeletonLoader, { ProductCardSkeleton, CategoryCardSkeleton } from './SkeletonLoader'

describe('SkeletonLoader Component', () => {
  it('should render with default variant', () => {
    const { container } = render(<SkeletonLoader />)
    const skeleton = container.firstChild
    expect(skeleton).toHaveClass('animate-pulse', 'bg-gray-200', 'h-4', 'w-full')
  })

  it('should render with text variant', () => {
    const { container } = render(<SkeletonLoader variant="text" />)
    const skeleton = container.firstChild
    expect(skeleton).toHaveClass('w-3/4')
  })

  it('should render with title variant', () => {
    const { container } = render(<SkeletonLoader variant="title" />)
    const skeleton = container.firstChild
    expect(skeleton).toHaveClass('h-6', 'w-1/2')
  })

  it('should render with avatar variant', () => {
    const { container } = render(<SkeletonLoader variant="avatar" />)
    const skeleton = container.firstChild
    expect(skeleton).toHaveClass('h-10', 'w-10', 'rounded-full')
  })

  it('should render with button variant', () => {
    const { container } = render(<SkeletonLoader variant="button" />)
    const skeleton = container.firstChild
    expect(skeleton).toHaveClass('h-10', 'w-20')
  })

  it('should render with card variant', () => {
    const { container } = render(<SkeletonLoader variant="card" />)
    const skeleton = container.firstChild
    expect(skeleton).toHaveClass('h-48')
  })

  it('should render with image variant', () => {
    const { container } = render(<SkeletonLoader variant="image" />)
    const skeleton = container.firstChild
    expect(skeleton).toHaveClass('aspect-square')
  })

  it('should render with rectangle variant', () => {
    const { container } = render(<SkeletonLoader variant="rectangle" />)
    const skeleton = container.firstChild
    expect(skeleton).toHaveClass('h-16')
  })

  it('should apply custom className', () => {
    const { container } = render(<SkeletonLoader className="custom-class" />)
    const skeleton = container.firstChild
    expect(skeleton).toHaveClass('custom-class')
  })
})

describe('ProductCardSkeleton Component', () => {
  it('should render product card skeleton structure', () => {
    const { container } = render(<ProductCardSkeleton />)
    const card = container.firstChild
    expect(card).toHaveClass('card-3d', 'p-4')
  })

  it('should contain image skeleton', () => {
    const { container } = render(<ProductCardSkeleton />)
    const imageSkeleton = container.querySelector('.aspect-square')
    expect(imageSkeleton).toBeInTheDocument()
  })

  it('should contain title skeleton', () => {
    const { container } = render(<ProductCardSkeleton />)
    const titleSkeletons = container.querySelectorAll('.h-6')
    expect(titleSkeletons.length).toBeGreaterThan(0)
  })
})

describe('CategoryCardSkeleton Component', () => {
  it('should render category card skeleton structure', () => {
    const { container } = render(<CategoryCardSkeleton />)
    const card = container.firstChild
    expect(card).toHaveClass('card-3d', 'aspect-square', 'rounded-2xl', 'overflow-hidden')
  })

  it('should contain image skeleton', () => {
    const { container } = render(<CategoryCardSkeleton />)
    const imageSkeleton = container.querySelector('.aspect-square')
    expect(imageSkeleton).toBeInTheDocument()
  })
})
