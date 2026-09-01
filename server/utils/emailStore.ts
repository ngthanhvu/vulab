import { getDb } from './db'
import type { Email } from './types'

interface EmailRow {
  uid: number
  subject: string
  from: string
  to: string
  date: string
  text: string | null
  html: string | null
  seen: number
}

function rowToEmail(row: EmailRow): Email {
  return {
    uid: row.uid,
    subject: row.subject,
    from: row.from,
    to: row.to,
    date: new Date(row.date),
    text: row.text ?? '',
    html: row.html ?? '',
    seen: Boolean(row.seen),
  }
}

export function getEmails(limit = 20): Email[] {
  const db = getDb()
  const rows = db.prepare(
    `SELECT uid, subject, "from", "to", date, text, html, seen
     FROM emails
     ORDER BY date DESC
     LIMIT ?`
  ).all(limit) as EmailRow[]
  return rows.map(rowToEmail)
}

export function getEmailsByRecipient(address: string): Email[] {
  const db = getDb()
  const rows = db.prepare(
    `SELECT uid, subject, "from", "to", date, text, html, seen
     FROM emails
     WHERE "to" = ?
     ORDER BY date DESC`
  ).all(address.toLowerCase()) as EmailRow[]
  return rows.map(rowToEmail)
}

export function getEmailByUid(uid: number): Email | null {
  const db = getDb()
  const row = db.prepare(
    `SELECT uid, subject, "from", "to", date, text, html, seen
     FROM emails
     WHERE uid = ?`
  ).get(uid) as EmailRow | undefined
  if (!row) return null
  return rowToEmail(row)
}

export function saveEmails(emails: Email[]): void {
  if (emails.length === 0) return
  const db = getDb()
  const insert = db.prepare(
    `INSERT OR REPLACE INTO emails (uid, subject, "from", "to", date, text, html, seen)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
  const tx = db.transaction((emails: Email[]) => {
    for (const email of emails) {
      insert.run(
        email.uid,
        email.subject,
        email.from,
        email.to.toLowerCase(),
        email.date.toISOString(),
        email.text,
        email.html,
        email.seen ? 1 : 0,
      )
    }
  })
  tx(emails)
}

export function setEmails(newEmails: Email[]): void {
  saveEmails(newEmails)
}

export function deleteOldEmails(hours: number): number {
  const db = getDb()
  const result = db.prepare(
    `DELETE FROM emails WHERE created_at < datetime('now', ?)`
  ).run(`-${hours} hours`)
  return result.changes
}

// Inbox tracking (replaces Redis)
export function saveInbox(address: string, domain: string): void {
  const db = getDb()
  db.prepare(
    `INSERT OR REPLACE INTO inboxes (address, created_at, domain) VALUES (?, datetime('now'), ?)`
  ).run(address.toLowerCase(), domain)
}

export function getInboxCount(): number {
  const db = getDb()
  const row = db.prepare('SELECT COUNT(*) as count FROM inboxes').get() as { count: number }
  return row.count
}