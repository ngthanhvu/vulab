import { env } from './env.js'

export const domains: readonly string[] = env.mailDomains
  .split(',')
  .map((d) => d.trim())
  .filter(Boolean)
