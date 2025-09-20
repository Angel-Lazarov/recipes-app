// backend/migrate.js
import { query, poolAvailable } from './db.js';

async function runMigrations() {
  if (!poolAvailable) {
    console.error('Database not configured');
    process.exit(1);
  }

  try {
    console.log('Running migrations...');

    // Таблица recipes (пример)
    await query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        image_url TEXT,
        ingredients JSONB,
        steps JSONB,
        created_at TIMESTAMP DEFAULT NOW()
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
