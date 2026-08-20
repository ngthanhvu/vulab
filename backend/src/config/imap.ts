import type { ImapFlowOptions } from 'imapflow'
import { env } from './env.js'

export const imapConfig: ImapFlowOptions = {
  host: env.imapHost,
  port: env.imapPort,
  secure: true,
  auth: {
    user: env.imapUser,
    pass: env.imapPass,
  },
  logger: false,
  tls: {
    rejectUnauthorized: false,
  },
}
