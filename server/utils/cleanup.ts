import { config } from './config'
import { deleteOldEmails } from './emailStore'

let cleanupInterval: ReturnType<typeof setInterval> | null = null

export function startCleanup(): void {
  if (cleanupInterval) return

  console.log(`Cleanup scheduled every hour (retention: ${config.emailRetentionHours}h)`)

  cleanupInterval = setInterval(async () => {
    try {
      const deleted = deleteOldEmails(config.emailRetentionHours)
      if (deleted > 0) console.log(`Cleaned up ${deleted} old emails`)
    } catch (err) {
      console.error('Cleanup failed:', err instanceof Error ? err.message : String(err))
    }
  }, 60 * 60 * 1000)
}

export function stopCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval)
    cleanupInterval = null
  }
}