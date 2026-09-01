import { getDb } from '../utils/db'
import { startCleanup } from '../utils/cleanup'
import { connectIMAP } from '../utils/imapService'

export default defineNitroPlugin(() => {
  // Initialize SQLite database
  getDb()

  // Start email cleanup scheduler
  startCleanup()

  // Connect to IMAP server (non-blocking)
  connectIMAP().catch((err: Error) => {
    console.error('IMAP init failed:', err.message)
  })
})