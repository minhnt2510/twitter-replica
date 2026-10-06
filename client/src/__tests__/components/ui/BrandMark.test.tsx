import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrandMark } from '../../../components/ui/BrandMark'

describe('BrandMark component', () => {
  it('renders X brand logo text', () => {
    render(<BrandMark />)
    expect(screen.getByText('X')).toBeInTheDocument()
  })

  it('accepts and appends custom className', () => {
    const { container } = render(<BrandMark className="custom-shadow" />)
    const span = container.querySelector('span')
    expect(span).toHaveClass('custom-shadow')
    expect(span).toHaveClass('bg-twitter-blue')
  })
})
