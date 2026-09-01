import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import { imapConfig } from './config'
import { setEmails } from './emailStore'
import type { Email } from './types'

interface FetchedMessage {
  uid: number
  source: Buffer
  flags?: Set<string>
}

let imapClient: ImapFlow | null = null

export async function connectIMAP(): Promise<void> {
  if (!imapConfig.auth.user || !imapConfig.auth.pass) {
    console.warn('IMAP credentials not configured. Set IMAP_USER and IMAP_PASS env vars.')
    return
  }

  imapClient = new ImapFlow(imapConfig)

  imapClient.on('exists', () => {
    console.log('New email arrived')
    fetchEmails()
  })

  imapClient.on('error', (err: Error) => {
    console.error('IMAP error:', err.message)
  })

  try {
    await imapClient.connect()
    await fetchEmails()
    console.log(`IMAP connected to ${imapConfig.host}`)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('IMAP connection failed:', error.message)
    imapClient = null
  }
}

export async function fetchEmails(): Promise<void> {
  if (!imapClient) return

  try {
    const mailbox = await imapClient.mailboxOpen('INBOX')
    if (mailbox.exists === 0) return

    const limit = Math.min(mailbox.exists, 20)
    const startSeq = mailbox.exists - limit + 1
    const messages = imapClient.fetch(
      { seq: `${startSeq}:*` },
      { source: true, uid: true, flags: true },
    )

    const newEmails: Email[] = []
    for await (const msg of messages as AsyncIterable<FetchedMessage>) {
      try {
        const parsed = await simpleParser(msg.source)
        const fromText = getAddressText(parsed.from)
        const toText = getAddressText(parsed.to)

        newEmails.push({
          uid: msg.uid,
          subject: parsed.subject ?? '(no subject)',
          from: fromText ?? 'Unknown',
          to: toText ?? '',
          date: parsed.date ?? new Date(),
          text: String(parsed.text ?? ''),
          html: String(parsed.html ?? ''),
          seen: msg.flags?.has('\\Seen') ?? false,
        })
      } catch {
        newEmails.push({
          uid: msg.uid,
          subject: '(parse error)',
          from: 'Unknown',
          to: '',
          date: new Date(),
          text: '',
          html: '',
          seen: msg.flags?.has('\\Seen') ?? false,
        })
      }
    }
    await setEmails(newEmails.reverse())
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('Error fetching emails:', error.message)
  }
}

function getAddressText(value: unknown): string | undefined {
  if (!value) return undefined
  if (Array.isArray(value)) {
    const first = value[0] as { text?: string } | undefined
    return first?.text
  }
  return (value as { text?: string }).text
}

export function getImapClient(): ImapFlow | null {
  return imapClient
}