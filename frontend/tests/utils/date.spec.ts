import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { formatDate, formatTime } from '~/utils/date'

describe('formatDate', () => {
  it('should format a date string to Vietnamese locale', () => {
    const result = formatDate('2024-01-15T08:30:00.000Z')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('should format a Date object', () => {
    const result = formatDate(new Date('2024-06-20T10:00:00.000Z'))
    expect(result).toContain('20')
    expect(result).toContain('2024')
  })
})

describe('formatTime', () => {
  const now = new Date('2024-01-01T12:00:00.000Z')

  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  it('should return "vừa xong" for recent date', () => {
    expect(formatTime(new Date(now.getTime() - 30_000))).toBe('vừa xong')
  })

  it('should return minutes for dates within an hour', () => {
    expect(formatTime(new Date(now.getTime() - 5 * 60_000))).toBe('5m')
    expect(formatTime(new Date(now.getTime() - 59 * 60_000))).toBe('59m')
  })

  it('should return hours for dates within a day', () => {
    expect(formatTime(new Date(now.getTime() - 60 * 60_000))).toBe('1h')
    expect(formatTime(new Date(now.getTime() - 23 * 60 * 60_000))).toBe('23h')
  })

  it('should return date string for older dates', () => {
    const date = new Date('2023-06-15T10:00:00.000Z')
    const result = formatTime(date)
    expect(result).not.toContain('m')
    expect(result).not.toContain('h')
    expect(result).toContain('2023')
  })
})
