import { describe, it, expect, beforeEach } from 'vitest'
import { authStorage } from '../../lib/storage'

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and retrieves access and refresh tokens', () => {
    expect(authStorage.getTokens()).toBeNull()

    authStorage.setTokens({
      access_token: 'acc-123',
      refresh_token: 'ref-456'
    })

    expect(authStorage.getAccessToken()).toBe('acc-123')
    expect(authStorage.getRefreshToken()).toBe('ref-456')
    expect(authStorage.getTokens()).toEqual({
      access_token: 'acc-123',
      refresh_token: 'ref-456'
    })
  })

  it('clears all tokens and pending verify token', () => {
    authStorage.setTokens({
      access_token: 'acc-123',
      refresh_token: 'ref-456'
    })
    authStorage.setPendingVerifyToken('verify-token-789')

    authStorage.clearTokens()

    expect(authStorage.getAccessToken()).toBeNull()
    expect(authStorage.getRefreshToken()).toBeNull()
    expect(authStorage.getTokens()).toBeNull()
    expect(authStorage.getPendingVerifyToken()).toBeNull()
  })

  it('manages pending email verification token', () => {
    expect(authStorage.getPendingVerifyToken()).toBeNull()

    authStorage.setPendingVerifyToken('verify-token-abc')
    expect(authStorage.getPendingVerifyToken()).toBe('verify-token-abc')

    authStorage.clearPendingVerifyToken()
    expect(authStorage.getPendingVerifyToken()).toBeNull()
  })
})
