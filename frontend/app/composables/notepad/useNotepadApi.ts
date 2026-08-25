export interface Note {
  slug: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  url: string
}

export interface CreateNotePayload {
  title: string
  content: string
}

export function useNotepadApi() {
  async function createNote(payload: CreateNotePayload): Promise<Note> {
    const res = await fetch('/api/notepad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      throw new Error(`Failed to create note: ${res.status}`)
    }
    return res.json()
  }

  async function fetchNote(slug: string): Promise<Note> {
    const res = await fetch(`/api/notepad/${encodeURIComponent(slug)}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch note: ${res.status}`)
    }
    return res.json()
  }

  async function updateNote(slug: string, payload: CreateNotePayload): Promise<Note> {
    const res = await fetch(`/api/notepad/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      throw new Error(`Failed to update note: ${res.status}`)
    }
    return res.json()
  }

  return {
    createNote,
    fetchNote,
    updateNote,
  }
}
