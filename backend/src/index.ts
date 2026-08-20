import app from './app.js'
import { connectIMAP } from './services/imapService.js'
import { initDatabase } from './services/dbService.js'
import { connectCache } from './services/cacheService.js'
import { deleteOldEmails } from './models/emailStore.js'
import { env } from './config/env.js'

const EMAIL_RETENTION_HOURS = Number(process.env.EMAIL_RETENTION_HOURS ?? '24')

async function bootstrap(): Promise<void> {
  try {
    await initDatabase()
    await connectCache()
    connectIMAP().catch((err) => console.error('IMAP init failed:', err.message))

    // Dọn email cũ mỗi giờ
    setInterval(async () => {
      try {
        const deleted = await deleteOldEmails(EMAIL_RETENTION_HOURS)
        if (deleted > 0) console.log(`Cleaned up ${deleted} old emails`)
      } catch (err) {
        console.error('Cleanup failed:', err instanceof Error ? err.message : String(err))
      }
    }, 60 * 60 * 1000)

    app.listen(env.port, () => {
      console.log(`Backend running on port ${env.port}`)
    })
  } catch (err) {
    console.error('Bootstrap failed:', err instanceof Error ? err.message : String(err))
    process.exit(1)
  }
}

bootstrap()
