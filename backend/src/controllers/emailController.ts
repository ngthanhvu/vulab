import type { Request, Response } from 'express'
import { getEmails, getEmailsByRecipient, getEmailByUid } from '../models/emailStore.js'
import { fetchEmails } from '../services/imapService.js'
import { domains } from '../config/domains.js'

const inboxes = new Map<string, { created: Date; domain: string }>()

function generateRandomString(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateEmail(req: Request, res: Response): void {
  const domain = typeof req.query.domain === 'string' ? req.query.domain : domains[0]
  if (!domains.includes(domain)) {
    res.status(400).json({ error: 'Domain not available' })
    return
  }

  const local = generateRandomString()
  const address = `${local}@${domain}`
  inboxes.set(address, { created: new Date(), domain })
  res.json({ address, domain, createdAt: new Date() })
}

export function getAllEmails(_req: Request, res: Response): void {
  res.json(getEmails())
}

export function getInbox(req: Request, res: Response): void {
  const { address } = req.params
  const emails = getEmailsByRecipient(address)
  res.json({ address, emails, count: emails.length })
}

export function getEmail(req: Request, res: Response): void {
  const uid = Number(req.params.uid)
  const email = getEmailByUid(uid)
  if (!email) {
    res.status(404).json({ error: 'Email not found' })
    return
  }
  res.json(email)
}

export async function refreshEmails(_req: Request, res: Response): Promise<void> {
  await fetchEmails()
  res.json({ success: true })
}

export function getDomains(_req: Request, res: Response): void {
  res.json(domains)
}
