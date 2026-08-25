import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useNotepadApi } from '~/composables/notepad/useNotepadApi'

const mockNote = {
  slug: 'abc123',
  title: 'Hello',
  content: 'World',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  url: '/notepad/abc123',
}

describe('useNotepadApi', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create a note', async () => {
    const api = useNotepadApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNote,
    })

    const result = await api.createNote({ title: 'Hello', content: 'World' })

    expect(fetch).toHaveBeenCalledWith('/api/notepad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hello', content: 'World' }),
    })
    expect(result).toEqual(mockNote)
  })

  it('should fetch a note by slug', async () => {
    const api = useNotepadApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNote,
    })

    const result = await api.fetchNote('abc123')

    expect(fetch).toHaveBeenCalledWith('/api/notepad/abc123')
    expect(result).toEqual(mockNote)
  })

  it('should encode slug when fetching', async () => {
    const api = useNotepadApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockNote,
    })

    await api.fetchNote('ab c 123')

    expect(fetch).toHaveBeenCalledWith('/api/notepad/ab%20c%20123')
  })

  it('should update a note', async () => {
    const api = useNotepadApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockNote, title: 'Updated' }),
    })

    const result = await api.updateNote('abc123', {
      title: 'Updated',
      content: 'New content',
    })

    expect(fetch).toHaveBeenCalledWith('/api/notepad/abc123', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated', content: 'New content' }),
    })
    expect(result.title).toBe('Updated')
  })

  it('should throw when createNote fails', async () => {
    const api = useNotepadApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    await expect(
      api.createNote({ title: 'Hello', content: 'World' }),
    ).rejects.toThrow('Failed to create note: 500')
  })

  it('should throw when fetchNote fails', async () => {
    const api = useNotepadApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    await expect(api.fetchNote('missing')).rejects.toThrow(
      'Failed to fetch note: 404',
    )
  })

  it('should throw when updateNote fails', async () => {
    const api = useNotepadApi()
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
    })

    await expect(
      api.updateNote('abc123', { title: 'Updated', content: 'New content' }),
    ).rejects.toThrow('Failed to update note: 400')
  })
})
