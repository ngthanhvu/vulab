import { fetchEmails } from '../../utils/imapService'

export default defineEventHandler(async () => {
  await fetchEmails()
  return { success: true }
})