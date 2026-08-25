module.exports = {
  name: '001_create_notes_table',

  async up({ connection }) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(20) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL DEFAULT '',
        content LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
  },

  async down({ connection }) {
    await connection.query('DROP TABLE IF EXISTS notes')
  },
}
