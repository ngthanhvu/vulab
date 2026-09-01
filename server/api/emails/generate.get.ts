import { domains } from '../../utils/config'
import { saveInbox } from '../../utils/emailStore'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const domain = typeof query.domain === 'string' ? query.domain : domains[0]

  if (!domains.includes(domain)) {
    throw createError({ statusCode: 400, statusMessage: 'Domain not available' })
  }

  const local = generateRandomString()
  const address = `${local}@${domain}`.toLowerCase()

  saveInbox(address, domain)

  return { address, domain, createdAt: new Date() }
})

function generateRandomString(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}