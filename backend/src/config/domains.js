const DOMAINS = (process.env.MAIL_DOMAINS || 'mail.thanhvu.net')
  .split(',')
  .map(d => d.trim())
  .filter(Boolean)

export default DOMAINS