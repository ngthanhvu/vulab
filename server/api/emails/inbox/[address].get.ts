import { getEmailsByRecipient } from '../../../utils/emailStore'

export default defineEventHandler((event) => {
  const address = getRouterParam(event, 'address')
  if (!address) {
    throw createError({ statusCode: 400, statusMessage: 'Address is required' })
  }
  const emails = getEmailsByRecipient(address)
  return { address, emails, count: emails.length }
})