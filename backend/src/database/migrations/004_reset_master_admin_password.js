const bcrypt = require('bcrypt')

module.exports = {
  name: '004_reset_master_admin_password',

  async up({ connection }) {
    const [rows] = await connection.query(
      'SELECT id FROM users WHERE username = ?',
      ['admin'],
    )

    if (rows && rows.length > 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await connection.query(
        'UPDATE users SET password = ?, role = ? WHERE username = ?',
        [hashedPassword, 'master_admin', 'admin'],
      )
      console.log('Master admin password reset to: admin123')
    }
  },

  async down({ connection }) {
    // no-op
  },
}
