// backend/migrate.js
import { query, poolAvailable, closePool } from './db.js';

async function migrate() {
  if (!poolAvailable) {
    console.error('DATABASE_URL not configured. Set DATABASE_URL in .env and try again.');
    process.exit(1);
  }

  // SQL за създаване на таблицата, ако не съществува
  const sql = `
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
  `;

  try {
    await query(sql);
    console.log('Migration applied successfully (recipes table created if it did not exist).');
    await closePool();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    await closePool();
    process.exit(1);
  }
}

migrate();
