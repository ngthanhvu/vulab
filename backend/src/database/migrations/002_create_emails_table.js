module.exports = {
  name: '002_create_emails_table',

  async up({ connection }) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS emails (
        uid INT PRIMARY KEY,
        subject VARCHAR(500) NOT NULL,
        \`from\` VARCHAR(255) NOT NULL,
        \`to\` VARCHAR(255) NOT NULL,
        date DATETIME NOT NULL,
        text LONGTEXT,
        html LONGTEXT,
        seen BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_to (\`to\`),
        INDEX idx_date (date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
  },

  async down({ connection }) {
    await connection.query('DROP TABLE IF EXISTS emails')
  },
}
