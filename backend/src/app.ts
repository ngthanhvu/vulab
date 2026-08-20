import express from 'express'
import cors from 'cors'
import emailRoutes from './routes/emailRoutes.js'
import { checkDatabase } from './services/dbService.js'
import { checkCache } from './services/cacheService.js'

const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  const db = await checkDatabase()
  const cache = await checkCache()
  const status = db && cache ? 200 : 503
  res.status(status).json({
    status: db && cache ? 'ok' : 'degraded',
    db,
    cache,
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/emails', emailRoutes)

export default app
