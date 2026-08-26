const crypto = require('crypto')
const bcrypt = require('bcrypt')

module.exports = {
  name: '003_create_users_table',

  async up({ connection }) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    const [rows] = await connection.query(
      'SELECT id FROM users WHERE username = ?',
      ['admin'],
    )

    if (!rows || rows.length === 0) {
      const masterPassword = 'admin123'
      const hashedPassword = await bcrypt.hash(masterPassword, 10)
      await connection.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'master_admin'],
      )
      console.log(`Master admin created: admin / ${masterPassword}`)
    }
  },

  async down({ connection }) {
    await connection.query('DROP TABLE IF EXISTS users')
  },
}
