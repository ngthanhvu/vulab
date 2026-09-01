function getEnv(name: string, fallback?: string): string {
  const value = process.env[name]
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const config = {
  port: Number(getEnv('PORT', '3005')),
  imapHost: getEnv('IMAP_HOST', 'mail.thanhvu.net'),
  imapPort: Number(getEnv('IMAP_PORT', '993')),
  imapUser: getEnv('IMAP_USER', ''),
  imapPass: getEnv('IMAP_PASS', ''),
  mailDomains: getEnv('MAIL_DOMAINS', 'mail.thanhvu.net'),
  emailRetentionHours: Number(getEnv('EMAIL_RETENTION_HOURS', '24')),
}

export const domains: readonly string[] = config.mailDomains
  .split(',')
  .map((d) => d.trim())
  .filter(Boolean)

export const imapConfig = {
  host: config.imapHost,
  port: config.imapPort,
  secure: true,
  auth: {
    user: config.imapUser,
    pass: config.imapPass,
  },
  logger: false,
  tls: {
    rejectUnauthorized: false,
  },
}