import { getEmails } from '../../utils/emailStore'

export default defineEventHandler(() => {
  return getEmails()
})