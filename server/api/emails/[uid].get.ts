import { getEmailByUid } from '../../utils/emailStore'

export default defineEventHandler((event) => {
  const uid = Number(getRouterParam(event, 'uid'))
  if (isNaN(uid)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid UID' })
  }

  const email = getEmailByUid(uid)
  if (!email) {
    throw createError({ statusCode: 404, statusMessage: 'Email not found' })
  }
  return email
})