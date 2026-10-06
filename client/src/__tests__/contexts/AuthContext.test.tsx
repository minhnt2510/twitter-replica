import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'
import { authStorage } from '../../lib/storage'
import { UserVerifyStatus } from '../../types'

vi.mock('../../apis/auth', () => ({
  authApi: {
    getMe: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    verifyEmail: vi.fn(),
    resendVerifyEmail: vi.fn()
  }
}))

import { authApi } from '../../apis/auth'
const mockedAuthApi = vi.mocked(authApi)

const mockUser = {
  _id: 'user_123',
  name: 'Nguyen Tan Minh',
  email: 'tanminh@example.com',
  date_of_birth: '2004-10-25T00:00:00.000Z',
  bio: 'Software Engineer',
  location: 'Ho Chi Minh City',
  website: 'https://tanminh.pages.dev',
  username: 'minhnt2510',
  avatar: '',
  cover_photo: '',
  verify: UserVerifyStatus.Verified,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  twitter_circle: []
}

function TestConsumer() {
  const { user, isAuthenticated, isVerified, login, logout } = useAuth()
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'logged-in' : 'anonymous'}</div>
      <div data-testid="verify-status">{isVerified ? 'verified' : 'unverified'}</div>
      <div data-testid="user-name">{user?.name || 'none'}</div>
      <button
        onClick={() =>
          login({ email: 'tanminh@example.com', password: 'Password123!' })
        }
      >
        Sign In
      </button>
      <button onClick={() => logout()}>Sign Out</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initializes as unauthenticated when no tokens are present', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Wait microtask
    await act(async () => {})

    expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous')
    expect(screen.getByTestId('user-name')).toHaveTextContent('none')
  })

  it('restores user profile from getMe when tokens exist in storage', async () => {
    authStorage.setTokens({
      access_token: 'valid_access_token',
      refresh_token: 'valid_refresh_token'
    })
    mockedAuthApi.getMe.mockResolvedValueOnce(mockUser as any)

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await act(async () => {})

    expect(mockedAuthApi.getMe).toHaveBeenCalled()
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in')
    expect(screen.getByTestId('verify-status')).toHaveTextContent('verified')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Nguyen Tan Minh')
  })

  it('logs in user, saves tokens and updates auth state', async () => {
    const user = userEvent.setup()
    mockedAuthApi.login.mockResolvedValueOnce({
      access_token: 'new_access',
      refresh_token: 'new_refresh'
    })
    mockedAuthApi.getMe.mockResolvedValueOnce(mockUser as any)

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await act(async () => {})

    await user.click(screen.getByText('Sign In'))

    expect(mockedAuthApi.login).toHaveBeenCalledWith({
      email: 'tanminh@example.com',
      password: 'Password123!'
    })
    expect(authStorage.getAccessToken()).toBe('new_access')
    expect(authStorage.getRefreshToken()).toBe('new_refresh')
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in')
  })

  it('logs out user and wipes tokens from storage', async () => {
    const user = userEvent.setup()
    authStorage.setTokens({
      access_token: 'active_token',
      refresh_token: 'active_refresh'
    })
    mockedAuthApi.getMe.mockResolvedValueOnce(mockUser as any)
    mockedAuthApi.logout.mockResolvedValueOnce({ message: 'OK' } as any)

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await act(async () => {})
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logged-in')

    await user.click(screen.getByText('Sign Out'))

    expect(mockedAuthApi.logout).toHaveBeenCalledWith('active_refresh')
    expect(authStorage.getTokens()).toBeNull()
    expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous')
  })

  it('throws error when useAuth is accessed outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used inside AuthProvider'
    )
    spy.mockRestore()
  })
})
