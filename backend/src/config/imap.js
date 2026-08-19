const IMAP_CONFIG = {
  host: process.env.IMAP_HOST || 'mail.thanhvu.net',
  port: parseInt(process.env.IMAP_PORT || '993'),
  secure: true,
  auth: {
    user: process.env.IMAP_USER || '',
    pass: process.env.IMAP_PASS || ''
  },
  logger: false,
  tls: {
    rejectUnauthorized: false
  }
}

export default IMAP_CONFIG