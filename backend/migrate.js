// backend/migrate.js
import { query, poolAvailable } from './db.js';

async function runMigrations() {
  if (!poolAvailable) {
    console.error('Database not configured');
    process.exit(1);
  }

  try {
    console.log('Running migrations...');

    // Таблица recipes със SERIAL primary key
    await query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        image_url TEXT,
        category TEXT,
        ingredients TEXT[],
        steps TEXT[],
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Migrations completed!');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

runMigrations();
