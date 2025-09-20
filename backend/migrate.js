// backend/migrate.js
import { query, poolAvailable, closePool } from './db.js';

async function migrate() {
  if (!poolAvailable) {
    console.error('DATABASE_URL not configured. Set DATABASE_URL in .env and try again.');
    process.exit(1);
  }

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS recipes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      image_url TEXT,
      ingredients TEXT[],
      steps TEXT[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createTableSQL);
    console.log('Recipes table ensured.');
    await closePool();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    await closePool();
    process.exit(1);
  }
}

migrate();
