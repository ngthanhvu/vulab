import { db } from '../config/database'
import { MigrationRunner } from './MigrationRunner'

async function main() {
  const runner = new MigrationRunner(db)

  const command = process.argv[2]

  try {
    if (command === 'rollback') {
      const steps = Number(process.argv[3]) || 1
      await runner.rollback(steps)
    } else if (command === 'migrate' || !command) {
      await runner.migrate()
    } else {
      console.error('Unknown command:', command)
      process.exit(1)
    }
  } catch (err) {
    console.error('Migration failed:', err)
    process.exit(1)
  } finally {
    await db.end()
  }
}

void main()
