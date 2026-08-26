module.exports = {
  name: '005_create_settings_table',

  async up({ connection }) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(255) UNIQUE NOT NULL,
        setting_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_setting_key (setting_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    const defaultSettings = [
      ['appName', 'Admin Dashboard'],
      ['language', 'vi'],
      ['timezone', 'Asia/Ho_Chi_Minh'],
    ]

    for (const [key, value] of defaultSettings) {
      const [rows] = await connection.query(
        'SELECT id FROM settings WHERE setting_key = ?',
        [key],
      )
      if (!rows || rows.length === 0) {
        await connection.query(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
          [key, value],
        )
      }
    }
  },

  async down({ connection }) {
    await connection.query('DROP TABLE IF EXISTS settings')
  },
}
