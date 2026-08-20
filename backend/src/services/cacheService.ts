import { redis } from '../config/database.js'

export async function connectCache(): Promise<void> {
  await redis.connect()
  console.log('Redis connected')
}

export async function checkCache(): Promise<boolean> {
  try {
    await redis.ping()
    return true
  } catch {
    return false
  }
}
