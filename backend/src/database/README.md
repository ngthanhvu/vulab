# Database

This folder holds the database configuration, migrations, and migration runner for the backend.

## Migrations

All database schema changes are managed through migrations located in `src/database/migrations/`.

### Create a new migration

Create a new `.js` file in `src/database/migrations/`. Use the next available numeric prefix.

Example: `003_add_users_table.js`

```js
module.exports = {
  name: '003_add_users_table',

  async up({ connection }) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)
  },

  async down({ connection }) {
    await connection.query('DROP TABLE IF EXISTS users')
  },
}
```

### Run migrations

```bash
npm run migrate
```

This will apply any pending migrations in order.

### Rollback migrations

Rollback the last applied migration:

```bash
npm run migrate:rollback
```

Rollback a specific number of migrations:

```bash
npm run migrate:rollback 2
```

### Migration tracking

Applied migrations are tracked in the `migrations` table in MySQL. Do not edit this table manually.

## Database configuration

Database connection configuration lives in `src/config/database.ts`. Make sure the environment variables are set before running migrations or starting the application.
