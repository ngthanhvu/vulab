import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import { setEmails } from '../models/emailStore.js'

let imapClient = null

export async function connectIMAP() {
  const user = process.env.IMAP_USER
  const pass = process.env.IMAP_PASS
  const host = process.env.IMAP_HOST || 'mail.thanhvu.net'

  if (!user || !pass) {
    console.warn('IMAP credentials not configured. Set IMAP_USER and IMAP_PASS env vars.')
    return
  }

  const config = {
    host,
    port: parseInt(process.env.IMAP_PORT || '993'),
    secure: true,
    auth: { user, pass },
    logger: false,
    tls: { rejectUnauthorized: false }
  }

  imapClient = new ImapFlow(config)

  imapClient.on('exists', async () => {
    console.log('New email arrived')
    await fetchEmails()
  })

  imapClient.on('error', (err) => {
    console.error('IMAP error:', err.message)
  })

  try {
    await imapClient.connect()
    await fetchEmails()
    console.log(`IMAP connected to ${host}`)
  } catch (err) {
    console.error('IMAP connection failed:', err.message)
    imapClient = null
  }
}

export async function fetchEmails() {
  try {
    if (!imapClient) return
    const mailbox = await imapClient.mailboxOpen('INBOX')
    if (mailbox.exists === 0) return

    const limit = Math.min(mailbox.exists, 20)
    const startSeq = mailbox.exists - limit + 1
    const messages = await imapClient.fetch(
      { seq: `${startSeq}:*` },
      { source: true, uid: true, flags: true }
    )

    const newEmails = []
    for await (const msg of messages) {
      try {
        const parsed = await simpleParser(msg.source)
        newEmails.push({
          uid: msg.uid,
          subject: parsed.subject || '(no subject)',
          from: parsed.from?.text || 'Unknown',
          to: parsed.to?.text || '',
          date: parsed.date || new Date(),
          text: parsed.text || '',
          html: parsed.html || '',
          seen: msg.flags.has('\\Seen')
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
          seen: msg.flags.has('\\Seen')
        })
      }
    }
    setEmails(newEmails.reverse())
  } catch (err) {
    console.error('Error fetching emails:', err.message)
  }
}