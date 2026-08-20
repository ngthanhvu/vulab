import type { Request, Response } from 'express'
import { getEmails, getEmailsByRecipient, getEmailByUid } from '../models/emailStore.js'
import { fetchEmails } from '../services/imapService.js'
import { domains } from '../config/domains.js'
import { redis } from '../config/database.js'

const inboxes = new Map<string, { created: Date; domain: string }>()

function generateRandomString(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function generateEmail(req: Request, res: Response): Promise<void> {
  const domain = typeof req.query.domain === 'string' ? req.query.domain : domains[0]
  if (!domains.includes(domain)) {
    res.status(400).json({ error: 'Domain not available' })
    return
  }

  const local = generateRandomString()
  const address = `${local}@${domain}`.toLowerCase()
  inboxes.set(address, { created: new Date(), domain })

  // Lưu address vào Redis với TTL 24h để có thể truy cập lại
  await redis.setEx(`inbox:${address}`, 60 * 60 * 24, JSON.stringify({ createdAt: new Date().toISOString(), domain }))

  res.json({ address, domain, createdAt: new Date() })
}

export async function getAllEmails(_req: Request, res: Response): Promise<void> {
  res.json(await getEmails())
}

export async function getInbox(req: Request, res: Response): Promise<void> {
  const { address } = req.params
  const emails = await getEmailsByRecipient(address.toLowerCase())
  res.json({ address, emails, count: emails.length })
}

export async function getEmail(req: Request, res: Response): Promise<void> {
  const uid = Number(req.params.uid)
  const email = await getEmailByUid(uid)
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
