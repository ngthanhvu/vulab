import mysql from 'mysql2/promise'
import { createClient } from 'redis'
import { env } from './env.js'

export const db = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPass,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export const redis = createClient({
  socket: {
    host: env.redisHost,
    port: env.redisPort,
  },
})

redis.on('error', (err) => {
  console.error('Redis error:', err.message)
})
