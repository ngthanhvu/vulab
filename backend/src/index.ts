import app from './app.js'
import { connectIMAP } from './services/imapService.js'
import { env } from './config/env.js'

connectIMAP().catch((err) => console.error('IMAP init failed:', err.message))

app.listen(env.port, () => {
  console.log(`Backend running on port ${env.port}`)
})
