import { describe, it, expect, beforeEach } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import { getErrorMessage, http } from '../../lib/http'
import { authStorage } from '../../lib/storage'

describe('http utility & getErrorMessage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getErrorMessage', () => {
    it('extracts nested validation error msg from api response', () => {
      const axiosError = new AxiosError(
        'Request failed',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        {
          data: {
            message: 'Validation failed',
            errors: {
              email: { msg: 'Email is invalid' }
            }
          },
          status: 422,
          statusText: 'Unprocessable Entity',
          headers: {},
          config: { headers: new AxiosHeaders() }
        } as any
      )

      expect(getErrorMessage(axiosError)).toBe('Email is invalid')
    })

    it('extracts string error from errors map', () => {
      const axiosError = new AxiosError(
        'Request failed',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        {
          data: {
            errors: {
              password: 'Password must be at least 8 characters'
            }
          },
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: { headers: new AxiosHeaders() }
        } as any
      )

      expect(getErrorMessage(axiosError)).toBe('Password must be at least 8 characters')
    })

    it('falls back to data.message if no field errors', () => {
      const axiosError = new AxiosError(
        'Request failed',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        {
          data: { message: 'User already exists' },
          status: 409,
          statusText: 'Conflict',
          headers: {},
          config: { headers: new AxiosHeaders() }
        } as any
      )

      expect(getErrorMessage(axiosError)).toBe('User already exists')
    })

    it('handles standard Error instances', () => {
      const err = new Error('Database connection failed')
      expect(getErrorMessage(err)).toBe('Database connection failed')
    })

    it('returns generic message for unknown errors', () => {
      expect(getErrorMessage(null)).toBe('Something went wrong. Please try again.')
      expect(getErrorMessage(undefined)).toBe('Something went wrong. Please try again.')
      expect(getErrorMessage({})).toBe('Something went wrong. Please try again.')
    })
  })

  describe('interceptors', () => {
    it('appends Authorization Bearer token when token is present in storage', async () => {
      authStorage.setTokens({
        access_token: 'test_access_jwt',
        refresh_token: 'test_refresh_jwt'
      })

      // Test the request interceptor handler directly
      const requestInterceptor = (http.interceptors.request as any).handlers[0]
      const config = await requestInterceptor.fulfilled({
        headers: new AxiosHeaders()
      })

      expect(config.headers.Authorization).toBe('Bearer test_access_jwt')
    })

    it('does not append Authorization header when access token is missing', async () => {
      const requestInterceptor = (http.interceptors.request as any).handlers[0]
      const config = await requestInterceptor.fulfilled({
        headers: new AxiosHeaders()
      })

      expect(config.headers.Authorization).toBeUndefined()
    })
  })
})
