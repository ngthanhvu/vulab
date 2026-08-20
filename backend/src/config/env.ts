function getEnv(name: string, fallback?: string): string {
  const value = process.env[name]
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  port: Number(getEnv('PORT', '3001')),
  imapHost: getEnv('IMAP_HOST', 'mail.thanhvu.net'),
  imapPort: Number(getEnv('IMAP_PORT', '993')),
  imapUser: getEnv('IMAP_USER', ''),
  imapPass: getEnv('IMAP_PASS', ''),
  mailDomains: getEnv('MAIL_DOMAINS', 'mail.thanhvu.net'),
}
