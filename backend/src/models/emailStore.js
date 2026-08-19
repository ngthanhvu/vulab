let emails = []

export function getEmails() {
  return emails
}

export function getEmailsByRecipient(address) {
  return emails.filter(e => {
    const to = (e.to || '').toLowerCase()
    return to.includes(address.toLowerCase())
  })
}

export function getEmailByUid(uid) {
  return emails.find(e => e.uid === uid) || null
}

export function setEmails(newEmails) {
  emails = newEmails
}