import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

const { Pool } = pkg;

// Зареждаме .env от root
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

// Взимаме DATABASE_URL от process.env
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL not configured. Set it in .env.');
}

// Създаваме Pool за PostgreSQL
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const poolAvailable = !!pool;

export async function query(text, params) {
  return pool.query(text, params);
}

export async function closePool() {
  await pool.end();
}
