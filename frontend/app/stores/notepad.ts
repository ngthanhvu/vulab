import { defineStore } from 'pinia'
import { useNotepadApi, type Note } from '~/composables/notepad/useNotepadApi'

export const useNotepadStore = defineStore('notepad', {
  state: () => ({
    note: null as Note | null,
    loading: false,
    error: null as string | null,
    title: '',
    content: '',
  }),

  getters: {
    shareUrl: (state) => {
      if (!state.note) return ''
      return `${window.location.origin}/notepad/${state.note.slug}`
    },
  },

  actions: {
    reset() {
      this.note = null
      this.title = ''
      this.content = ''
      this.error = null
    },

    async createNote() {
      this.loading = true
      this.error = null
      const api = useNotepadApi()
      try {
        this.note = await api.createNote({
          title: this.title,
          content: this.content,
        })
        return this.note
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Lỗi không xác định'
        throw e
      } finally {
        this.loading = false
      }
    },

    async loadNote(slug: string) {
      this.loading = true
      this.error = null
      const api = useNotepadApi()
      try {
        this.note = await api.fetchNote(slug)
        this.title = this.note.title
        this.content = this.note.content
        return this.note
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Lỗi không xác định'
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateNote(slug: string) {
      this.loading = true
      this.error = null
      const api = useNotepadApi()
      try {
        this.note = await api.updateNote(slug, {
          title: this.title,
          content: this.content,
        })
        return this.note
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Lỗi không xác định'
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
