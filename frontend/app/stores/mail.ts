import { defineStore } from 'pinia'
import { useMailApi } from '~/composables/mail/useMailApi'
import { useMailClipboard } from '~/composables/mail/useMailClipboard'
import type { Email } from '~/composables/mail/useMailApi'

export { type Email } from '~/composables/mail/useMailApi'

export const useMailStore = defineStore('mail', {
  state: () => ({
    domains: [] as string[],
    selectedDomain: '',
    emailAddress: '',
    emails: [] as Email[],
    loading: false,
    selected: null as number | null,
    generated: false,
    copied: false,
    searchAddress: '',
  }),

  getters: {
    selectedEmail: (state) => {
      if (!state.emails.length || state.selected === null) return null
      return state.emails.find((e) => e.uid === state.selected) || null
    },
  },

  actions: {
    selectEmail(uid: number) {
      this.selected = uid
    },

    async fetchDomains() {
      const api = useMailApi()
      try {
        const list = await api.fetchDomains()
        this.domains = list
        if (list.length > 0) {
          this.selectedDomain = list[Math.floor(Math.random() * list.length)]
          if (!this.emailAddress) {
            await this.generateEmail()
          } else {
            await this.fetchInbox()
          }
        }
      } catch (e) {
        console.error(e)
      }
    },

    async generateEmail() {
      const api = useMailApi()
      this.loading = true
      try {
        const domain = this.domains[Math.floor(Math.random() * this.domains.length)]
        this.selectedDomain = domain
        this.emailAddress = await api.generateEmail(domain)
        this.generated = true
        this.selected = null
        this.copied = false
        await this.fetchInbox()
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async fetchInbox(address?: string) {
      const api = useMailApi()
      const addr = address || this.emailAddress
      if (!addr) return
      try {
        const data = await api.fetchInbox(addr)
        this.emails = data.emails || []
      } catch (e) {
        console.error(e)
      }
    },

    async copyEmail() {
      const { copy } = useMailClipboard()
      if (!this.emailAddress) return
      const ok = await copy(this.emailAddress)
      if (ok) {
        this.copied = true
        setTimeout(() => (this.copied = false), 2000)
      }
    },

    setEmailAddress(address: string) {
      this.emailAddress = address
    },
  },
})
