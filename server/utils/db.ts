import Database from 'better-sqlite3'
import { join, dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'

const DB_PATH = process.env.DB_PATH || join(process.cwd(), 'data', 'tempmail.db')

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!_db) {
    // Ensure data directory exists
    const dir = dirname(DB_PATH)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    _db = new Database(DB_PATH)
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')

    // Create tables
    _db.exec(`
      CREATE TABLE IF NOT EXISTS emails (
        uid INTEGER PRIMARY KEY,
        subject TEXT NOT NULL,
        "from" TEXT NOT NULL,
        "to" TEXT NOT NULL,
        date TEXT NOT NULL,
        text TEXT,
        html TEXT,
        seen INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `)

    _db.exec(`
      CREATE INDEX IF NOT EXISTS idx_emails_to ON emails("to")
    `)

    _db.exec(`
      CREATE INDEX IF NOT EXISTS idx_emails_date ON emails(date)
    `)

    _db.exec(`
      CREATE TABLE IF NOT EXISTS inboxes (
        address TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        domain TEXT NOT NULL
      )
    `)

    console.log(`SQLite database initialized at ${DB_PATH}`)
  }
  return _db
}

export function closeDb(): void {
  if (_db) {
    _db.close()
    _db = null
  }
}