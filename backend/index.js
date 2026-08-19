import app from './src/app.js'
import { connectIMAP } from './src/services/imapService.js'

const PORT = process.env.PORT || 3001

connectIMAP().catch(err => console.error('IMAP init failed:', err.message))

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})