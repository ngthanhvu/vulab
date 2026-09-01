export interface DomainListResponse {
  domains: string[]
}

export interface GenerateEmailResponse {
  address: string
}

export interface InboxResponse {
  address: string
  emails: Email[]
  count: number
}

export interface Email {
  uid: number
  subject: string
  from: string
  to: string
  date: string
  text: string
  html: string
  seen: boolean
}

export function useMailApi() {
  async function fetchDomains(): Promise<string[]> {
    const res = await fetch('/api/emails/domains')
    if (!res.ok) {
      throw new Error(`Failed to fetch domains: ${res.status}`)
    }
    return res.json()
  }

  async function generateEmail(domain: string): Promise<string> {
    const res = await fetch(`/api/emails/generate?domain=${encodeURIComponent(domain)}`)
    if (!res.ok) {
      throw new Error(`Failed to generate email: ${res.status}`)
    }
    const data: GenerateEmailResponse = await res.json()
    return data.address
  }

  async function fetchInbox(address: string): Promise<InboxResponse> {
    const res = await fetch(`/api/emails/inbox/${encodeURIComponent(address)}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch inbox: ${res.status}`)
    }
    return res.json()
  }

  return {
    fetchDomains,
    generateEmail,
    fetchInbox,
  }
}
