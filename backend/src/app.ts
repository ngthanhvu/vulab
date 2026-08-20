import express from 'express'
import cors from 'cors'
import emailRoutes from './routes/emailRoutes.js'

const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/emails', emailRoutes)

export default app
