import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useMailApi } from '~/composables/mail/useMailApi'

describe('useMailApi', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should fetch domains', async () => {
    const api = useMailApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ['example.com', 'test.com'],
    })

    const result = await api.fetchDomains()

    expect(fetch).toHaveBeenCalledWith('/api/emails/domains')
    expect(result).toEqual(['example.com', 'test.com'])
  })

  it('should generate email for a domain', async () => {
    const api = useMailApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ address: 'abc@example.com' }),
    })

    const result = await api.generateEmail('example.com')

    expect(fetch).toHaveBeenCalledWith('/api/emails/generate?domain=example.com')
    expect(result).toBe('abc@example.com')
  })

  it('should encode domain in generateEmail', async () => {
    const api = useMailApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ address: 'abc@ex ample.com' }),
    })

    await api.generateEmail('ex ample.com')

    expect(fetch).toHaveBeenCalledWith(
      '/api/emails/generate?domain=ex%20ample.com',
    )
  })

  it('should fetch inbox for an address', async () => {
    const api = useMailApi()
    const mockResponse = {
      address: 'abc@example.com',
      emails: [],
      count: 0,
    }
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await api.fetchInbox('abc@example.com')

    expect(fetch).toHaveBeenCalledWith('/api/emails/inbox/abc%40example.com')
    expect(result).toEqual(mockResponse)
  })

  it('should throw when fetch domains fails', async () => {
    const api = useMailApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    await expect(api.fetchDomains()).rejects.toThrow(
      'Failed to fetch domains: 500',
    )
  })

  it('should throw when generateEmail fails', async () => {
    const api = useMailApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
    })

    await expect(api.generateEmail('example.com')).rejects.toThrow(
      'Failed to generate email: 400',
    )
  })

  it('should throw when fetchInbox fails', async () => {
    const api = useMailApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    await expect(api.fetchInbox('missing@example.com')).rejects.toThrow(
      'Failed to fetch inbox: 404',
    )
  })
})
