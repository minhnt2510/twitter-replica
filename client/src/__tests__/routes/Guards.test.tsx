import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from '../../routes/Guards'

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}))

import { useAuth } from '../../contexts/AuthContext'
const mockedUseAuth = vi.mocked(useAuth)

describe('Route Guards', () => {
  describe('ProtectedRoute', () => {
    it('renders loading screen when auth is bootstrapping', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        isBootstrapping: true
      } as any)

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Protected Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      expect(screen.queryByText('Protected Dashboard')).not.toBeInTheDocument()
    })

    it('redirects unauthenticated users to login', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        isBootstrapping: false
      } as any)

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Protected Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByText('Login Page')).toBeInTheDocument()
      expect(screen.queryByText('Protected Dashboard')).not.toBeInTheDocument()
    })

    it('renders outlet when user is authenticated', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isBootstrapping: false
      } as any)

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Protected Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByText('Protected Dashboard')).toBeInTheDocument()
    })
  })

  describe('GuestRoute', () => {
    it('renders outlet for guest users', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: false,
        isBootstrapping: false
      } as any)

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<div>Login Form</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByText('Login Form')).toBeInTheDocument()
    })

    it('redirects authenticated users to root', () => {
      mockedUseAuth.mockReturnValue({
        isAuthenticated: true,
        isBootstrapping: false
      } as any)

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/" element={<div>Home Feed</div>} />
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<div>Login Form</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByText('Home Feed')).toBeInTheDocument()
      expect(screen.queryByText('Login Form')).not.toBeInTheDocument()
    })
  })
})
