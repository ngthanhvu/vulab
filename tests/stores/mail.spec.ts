import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMailStore } from '~/stores/mail'
import * as useMailApiModule from '~/composables/mail/useMailApi'

const mockEmail = {
  uid: 1,
  subject: 'Test',
  from: 'a@example.com',
  to: 'b@example.com',
  date: '2024-01-01T00:00:00.000Z',
  text: 'text',
  html: '<p>html</p>',
  seen: false,
}

describe('useMailStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should select an email', () => {
    const store = useMailStore()
    store.selectEmail(5)
    expect(store.selected).toBe(5)
  })

  it('should compute selectedEmail getter', () => {
    const store = useMailStore()
    store.emails = [mockEmail]
    store.selectEmail(1)

    expect(store.selectedEmail).toEqual(mockEmail)
  })

  it('should return null when no email is selected', () => {
    const store = useMailStore()
    store.emails = [mockEmail]

    expect(store.selectedEmail).toBeNull()
  })

  it('should fetch domains and generate first email', async () => {
    const store = useMailStore()
    const fetchDomains = vi.fn().mockResolvedValue(['example.com', 'test.com'])
    const generateEmail = vi
      .fn()
      .mockResolvedValue('generated@example.com')
    const fetchInbox = vi.fn().mockResolvedValue({
      address: 'generated@example.com',
      emails: [mockEmail],
      count: 1,
    })

    vi.spyOn(useMailApiModule, 'useMailApi').mockReturnValue({
      fetchDomains,
      generateEmail,
      fetchInbox,
    } as any)

    await store.fetchDomains()

    expect(store.domains).toEqual(['example.com', 'test.com'])
    expect(store.emailAddress).toBe('generated@example.com')
    expect(store.emails).toEqual([mockEmail])
    expect(store.generated).toBe(true)
  })

  it('should fetch inbox when email already exists during fetchDomains', async () => {
    const store = useMailStore()
    store.emailAddress = 'existing@example.com'
    const fetchDomains = vi.fn().mockResolvedValue(['example.com'])
    const fetchInbox = vi.fn().mockResolvedValue({
      address: 'existing@example.com',
      emails: [mockEmail],
      count: 1,
    })

    vi.spyOn(useMailApiModule, 'useMailApi').mockReturnValue({
      fetchDomains,
      generateEmail: vi.fn(),
      fetchInbox,
    } as any)

    await store.fetchDomains()

    expect(fetchInbox).toHaveBeenCalledWith('existing@example.com')
    expect(store.emails).toEqual([mockEmail])
  })

  it('should generate a new email', async () => {
    const store = useMailStore()
    store.domains = ['example.com', 'test.com']
    const generateEmail = vi.fn().mockResolvedValue('new@example.com')
    const fetchInbox = vi.fn().mockResolvedValue({
      address: 'new@example.com',
      emails: [],
      count: 0,
    })

    vi.spyOn(useMailApiModule, 'useMailApi').mockReturnValue({
      fetchDomains: vi.fn(),
      generateEmail,
      fetchInbox,
    } as any)

    await store.generateEmail()

    expect(store.emailAddress).toBe('new@example.com')
    expect(store.selected).toBeNull()
    expect(store.copied).toBe(false)
    expect(generateEmail).toHaveBeenCalled()
  })

  it('should fetch inbox for given address', async () => {
    const store = useMailStore()
    const fetchInbox = vi.fn().mockResolvedValue({
      address: 'given@example.com',
      emails: [mockEmail],
      count: 1,
    })

    vi.spyOn(useMailApiModule, 'useMailApi').mockReturnValue({
      fetchDomains: vi.fn(),
      generateEmail: vi.fn(),
      fetchInbox,
    } as any)

    await store.fetchInbox('given@example.com')

    expect(store.emails).toEqual([mockEmail])
    expect(fetchInbox).toHaveBeenCalledWith('given@example.com')
  })

  it('should not fetch inbox if no address available', async () => {
    const store = useMailStore()
    const fetchInbox = vi.fn()

    vi.spyOn(useMailApiModule, 'useMailApi').mockReturnValue({
      fetchDomains: vi.fn(),
      generateEmail: vi.fn(),
      fetchInbox,
    } as any)

    await store.fetchInbox()

    expect(fetchInbox).not.toHaveBeenCalled()
  })

  it('should copy email and set copied state', async () => {
    const store = useMailStore()
    store.emailAddress = 'copy@example.com'
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })

    await store.copyEmail()

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('copy@example.com')
    expect(store.copied).toBe(true)
  })

  it('should set email address', () => {
    const store = useMailStore()
    store.setEmailAddress('set@example.com')

    expect(store.emailAddress).toBe('set@example.com')
  })
})
