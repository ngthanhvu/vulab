import { getDb } from '../utils/db'

export default defineEventHandler(() => {
  let dbOk = false
  try {
    const db = getDb()
    db.prepare('SELECT 1').get()
    dbOk = true
  } catch {
    dbOk = false
  }

  const body = {
    status: dbOk ? 'ok' : 'degraded',
    db: dbOk,
    timestamp: new Date().toISOString(),
  }

  if (!dbOk) {
    throw createError({ statusCode: 503, statusMessage: JSON.stringify(body) })
  }

  return body
})