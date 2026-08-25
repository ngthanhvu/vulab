import fs from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import type { Connection, Pool, RowDataPacket } from 'mysql2/promise'

export interface MigrationContext {
  connection: Connection
}

export interface Migration {
  name: string
  up(ctx: MigrationContext): Promise<void>
  down(ctx: MigrationContext): Promise<void>
}

interface MigrationRow extends RowDataPacket {
  name: string
}

function resolveMigrationsDir(): string {
  const distPath = path.join(process.cwd(), 'dist', 'database', 'migrations')
  const srcPath = path.join(process.cwd(), 'src', 'database', 'migrations')
  if (existsSync(distPath)) {
    return distPath
  }
  return srcPath
}

export class MigrationRunner {
  private readonly migrationsDir: string

  constructor(private readonly db: Pool) {
    this.migrationsDir = resolveMigrationsDir()
  }

  async migrate(): Promise<void> {
    await this.ensureMigrationsTable()

    const files = await this.getMigrationFiles()
    const applied = await this.getAppliedMigrations()
    const pending = files.filter((f) => !applied.includes(f.name))

    if (pending.length === 0) {
      console.log('No pending migrations')
      return
    }

    for (const file of pending) {
      const modulePath = path.join(this.migrationsDir, file.path)
      const migrationModule = (await import(modulePath)) as { default: Migration }
      const migration = migrationModule.default

      const connection = await this.db.getConnection()
      try {
        await connection.beginTransaction()
        await migration.up({ connection })
        await connection.execute(
          'INSERT INTO migrations (name) VALUES (?)',
          [migration.name],
        )
        await connection.commit()
        console.log(`Applied migration: ${migration.name}`)
      } catch (err) {
        await connection.rollback()
        throw err
      } finally {
        connection.release()
      }
    }
  }

  async rollback(steps = 1): Promise<void> {
    const applied = await this.getAppliedMigrations(true)
    const toRollback = applied.slice(0, steps)

    for (const name of toRollback) {
      const modulePath = path.join(this.migrationsDir, `${name}.js`)
      const migrationModule = (await import(modulePath)) as { default: Migration }
      const migration = migrationModule.default

      const connection = await this.db.getConnection()
      try {
        await connection.beginTransaction()
        await migration.down({ connection })
        await connection.execute('DELETE FROM migrations WHERE name = ?', [name])
        await connection.commit()
        console.log(`Rolled back migration: ${name}`)
      } catch (err) {
        await connection.rollback()
        throw err
      } finally {
        connection.release()
      }
    }
  }

  private async ensureMigrationsTable(): Promise<void> {
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
  }

  private async getMigrationFiles(): Promise<{ name: string; path: string }[]> {
    const files = await fs.readdir(this.migrationsDir)
    return files
      .filter((f) => f.endsWith('.js'))
      .sort()
      .map((f) => ({ name: f.replace('.js', ''), path: f }))
  }

  private async getAppliedMigrations(orderByDesc = false): Promise<string[]> {
    const [rows] = await this.db.execute<MigrationRow[]>(
      `SELECT name FROM migrations ORDER BY id ${orderByDesc ? 'DESC' : 'ASC'}`,
    )
    return rows.map((r) => r.name)
  }
}
