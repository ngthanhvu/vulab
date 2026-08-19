import { getEmails, getEmailsByRecipient, getEmailByUid } from '../models/emailStore.js'
import { fetchEmails } from '../services/imapService.js'
import DOMAINS from '../config/domains.js'

const inboxes = new Map()

function generateRandomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateEmail(req, res) {
  const domain = req.query.domain || DOMAINS[0]
  if (!DOMAINS.includes(domain)) {
    return res.status(400).json({ error: 'Domain not available' })
  }
  const local = generateRandomString()
  const address = `${local}@${domain}`
  inboxes.set(address, { created: new Date(), domain })
  res.json({ address, domain, createdAt: new Date() })
}

export function getAllEmails(_req, res) {
  res.json(getEmails())
}

export function getInbox(req, res) {
  const { address } = req.params
  const emails = getEmailsByRecipient(address)
  res.json({ address, emails, count: emails.length })
}

export function getEmail(_req, res) {
  const uid = parseInt(_req.params.uid)
  const email = getEmailByUid(uid)
  if (!email) return res.status(404).json({ error: 'Email not found' })
  res.json(email)
}

export async function refreshEmails(_req, res) {
  await fetchEmails()
  res.json({ success: true })
}

export function getDomains(_req, res) {
  res.json(DOMAINS)
}