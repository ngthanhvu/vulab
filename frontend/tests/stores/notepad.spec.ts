import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotepadStore } from '~/stores/notepad'
import * as useNotepadApiModule from '~/composables/notepad/useNotepadApi'

const mockNote = {
  slug: 'abc123',
  title: 'Hello',
  content: 'World',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  url: '/notepad/abc123',
}

describe('useNotepadStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should reset state', () => {
    const store = useNotepadStore()
    store.note = mockNote as any
    store.title = 'Hello'
    store.content = 'World'
    store.error = 'Error'

    store.reset()

    expect(store.note).toBeNull()
    expect(store.title).toBe('')
    expect(store.content).toBe('')
    expect(store.error).toBeNull()
  })

  it('should compute shareUrl getter', () => {
    const store = useNotepadStore()
    store.note = mockNote as any
    ;(globalThis as any).window = { location: { origin: 'https://example.com' } }

    expect(store.shareUrl).toBe('https://example.com/notepad/abc123')
  })

  it('should return empty shareUrl when no note', () => {
    const store = useNotepadStore()

    expect(store.shareUrl).toBe('')
  })

  it('should create a note', async () => {
    const store = useNotepadStore()
    store.title = 'Hello'
    store.content = 'World'
    const createNote = vi.fn().mockResolvedValue(mockNote)

    vi.spyOn(useNotepadApiModule, 'useNotepadApi').mockReturnValue({
      createNote,
      fetchNote: vi.fn(),
      updateNote: vi.fn(),
    } as any)

    const result = await store.createNote()

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.note).toEqual(mockNote)
    expect(createNote).toHaveBeenCalledWith({ title: 'Hello', content: 'World' })
    expect(result).toEqual(mockNote)
  })

  it('should handle create error', async () => {
    const store = useNotepadStore()
    const createNote = vi.fn().mockRejectedValue(new Error('Failed'))

    vi.spyOn(useNotepadApiModule, 'useNotepadApi').mockReturnValue({
      createNote,
      fetchNote: vi.fn(),
      updateNote: vi.fn(),
    } as any)

    await expect(store.createNote()).rejects.toThrow('Failed')
    expect(store.loading).toBe(false)
    expect(store.error).toBe('Failed')
  })

  it('should load a note', async () => {
    const store = useNotepadStore()
    const fetchNote = vi.fn().mockResolvedValue(mockNote)

    vi.spyOn(useNotepadApiModule, 'useNotepadApi').mockReturnValue({
      createNote: vi.fn(),
      fetchNote,
      updateNote: vi.fn(),
    } as any)

    const result = await store.loadNote('abc123')

    expect(store.note).toEqual(mockNote)
    expect(store.title).toBe('Hello')
    expect(store.content).toBe('World')
    expect(fetchNote).toHaveBeenCalledWith('abc123')
    expect(result).toEqual(mockNote)
  })

  it('should update a note', async () => {
    const store = useNotepadStore()
    store.title = 'Updated'
    store.content = 'New content'
    const updateNote = vi.fn().mockResolvedValue({
      ...mockNote,
      title: 'Updated',
      content: 'New content',
    })

    vi.spyOn(useNotepadApiModule, 'useNotepadApi').mockReturnValue({
      createNote: vi.fn(),
      fetchNote: vi.fn(),
      updateNote,
    } as any)

    const result = await store.updateNote('abc123')

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.note?.title).toBe('Updated')
    expect(updateNote).toHaveBeenCalledWith('abc123', {
      title: 'Updated',
      content: 'New content',
    })
    expect(result).toEqual({
      ...mockNote,
      title: 'Updated',
      content: 'New content',
    })
  })

  it('should handle update error', async () => {
    const store = useNotepadStore()
    const updateNote = vi.fn().mockRejectedValue(new Error('Update failed'))

    vi.spyOn(useNotepadApiModule, 'useNotepadApi').mockReturnValue({
      createNote: vi.fn(),
      fetchNote: vi.fn(),
      updateNote,
    } as any)

    await expect(store.updateNote('abc123')).rejects.toThrow('Update failed')
    expect(store.loading).toBe(false)
    expect(store.error).toBe('Update failed')
  })
})
