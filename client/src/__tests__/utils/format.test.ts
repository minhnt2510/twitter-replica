import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatCount, formatRelativeTime } from '../../utils/format'

describe('format utilities', () => {
  describe('formatCount', () => {
    it('returns exact string for numbers below 1000', () => {
      expect(formatCount(0)).toBe('0')
      expect(formatCount(42)).toBe('42')
      expect(formatCount(999)).toBe('999')
    })

    it('formats thousands with K suffix', () => {
      expect(formatCount(1000)).toBe('1.0K')
      expect(formatCount(1500)).toBe('1.5K')
      expect(formatCount(99900)).toBe('99.9K')
    })

    it('formats millions with M suffix', () => {
      expect(formatCount(1_000_000)).toBe('1.0M')
      expect(formatCount(2_450_000)).toBe('2.5M')
    })

    it('defaults to 0 when called without argument', () => {
      expect(formatCount()).toBe('0')
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-10-06T12:00:00.000Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns "now" when input is missing', () => {
      expect(formatRelativeTime()).toBe('now')
      expect(formatRelativeTime('')).toBe('now')
    })

    it('formats seconds correctly', () => {
      const tenSecondsAgo = new Date('2026-10-06T11:59:50.000Z').toISOString()
      expect(formatRelativeTime(tenSecondsAgo)).toBe('10s')
    })

    it('formats minutes correctly', () => {
      const fiveMinutesAgo = new Date('2026-10-06T11:55:00.000Z').toISOString()
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m')
    })

    it('formats hours correctly', () => {
      const threeHoursAgo = new Date('2026-10-06T09:00:00.000Z').toISOString()
      expect(formatRelativeTime(threeHoursAgo)).toBe('3h')
    })

    it('formats days correctly within 7 days', () => {
      const twoDaysAgo = new Date('2026-10-04T12:00:00.000Z').toISOString()
      expect(formatRelativeTime(twoDaysAgo)).toBe('2d')
    })

    it('formats as localized date when older than 7 days', () => {
      const tenDaysAgo = new Date('2026-09-26T12:00:00.000Z').toISOString()
      const formatted = formatRelativeTime(tenDaysAgo)
      expect(formatted).toMatch(/Sep 26/)
    })
  })
})
