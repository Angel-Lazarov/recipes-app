import fs from 'fs';
import path from 'path';
import { query, poolAvailable, closePool } from './db.js';

async function migrate() {
  if (!poolAvailable) {
    console.error('DATABASE_URL not configured. Set DATABASE_URL in .env and try again.');
    process.exit(1);
  }

  const sqlPath = path.join(process.cwd(), 'sql', 'init.sql');

  if (!fs.existsSync(sqlPath)) {
    console.error(`SQL file not found at ${sqlPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    await query(sql);
    console.log('Recipes table ensured.');
    await closePool();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
