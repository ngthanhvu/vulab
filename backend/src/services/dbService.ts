import { db } from '../config/database.js'

export async function initDatabase(): Promise<void> {
  const connection = await db.getConnection()
  try {
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
    console.log('MySQL initialized')
  } finally {
    connection.release()
  }
}

export async function checkDatabase(): Promise<boolean> {
  try {
    await db.query('SELECT 1')
    return true
  } catch {
    return false
  }
}
