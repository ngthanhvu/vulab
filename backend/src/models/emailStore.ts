import type { Email } from '../types/email.js'

let emails: Email[] = []

export function getEmails(): Email[] {
  return emails
}

export function getEmailsByRecipient(address: string): Email[] {
  const lowerAddress = address.toLowerCase()
  return emails.filter((e) => e.to.toLowerCase().includes(lowerAddress))
}

export function getEmailByUid(uid: number): Email | null {
  return emails.find((e) => e.uid === uid) ?? null
}

export function setEmails(newEmails: Email[]): void {
  emails = newEmails
}
