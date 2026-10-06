import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingScreen } from '../../../components/ui/LoadingScreen'

describe('LoadingScreen component', () => {
  it('renders brand mark and loading message', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByText('Loading Twitter Social...')).toBeInTheDocument()
  })
})
