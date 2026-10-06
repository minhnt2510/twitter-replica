import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert } from '../../../components/ui/Alert'

describe('Alert component', () => {
  it('renders default info alert with children', () => {
    render(<Alert>System notification</Alert>)
    const element = screen.getByText('System notification')
    expect(element).toBeInTheDocument()
    expect(element).toHaveClass('text-sky-100')
  })

  it('renders success alert with appropriate styling', () => {
    render(<Alert type="success">Operation completed successfully</Alert>)
    const element = screen.getByText('Operation completed successfully')
    expect(element).toBeInTheDocument()
    expect(element).toHaveClass('text-emerald-100')
  })

  it('renders error alert with appropriate styling', () => {
    render(<Alert type="error">Something went wrong</Alert>)
    const element = screen.getByText('Something went wrong')
    expect(element).toBeInTheDocument()
    expect(element).toHaveClass('text-rose-100')
  })
})
