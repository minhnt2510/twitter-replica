import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from '../../../components/ui/Avatar'

describe('Avatar component', () => {
  it('renders image when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.jpg" name="Minh Nguyen" />)
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    expect(img).toHaveAttribute('alt', 'Minh Nguyen')
  })

  it('renders fallback initial when src is not provided', () => {
    render(<Avatar name="Tan Minh" />)
    expect(screen.getByText('T')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('handles empty name gracefully with default U initial', () => {
    render(<Avatar name="   " />)
    expect(screen.getByText('U')).toBeInTheDocument()
  })

  it('applies custom size and className correctly', () => {
    const { container } = render(<Avatar name="Minh" size="lg" className="border-cyan-500" />)
    const span = container.querySelector('span')
    expect(span).toHaveClass('size-16')
    expect(span).toHaveClass('border-cyan-500')
  })
})
