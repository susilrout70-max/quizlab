import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

export const isDbConfigured = Boolean(
  connectionString &&
  !connectionString.includes('YOUR_PASSWORD') &&
  !connectionString.includes('ep-xyz')
);

if (!isDbConfigured) {
  console.warn('⚠️  Neon DB connection string is pending or contains placeholders in server/.env.');
  console.warn('👉 Operating in fast localhost preview mode.');
}

export const pool = new Pool({
  connectionString: connectionString || 'postgresql://postgres:postgres@localhost:5432/quizlab',
  ssl: connectionString && connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 15000,
});

export const query = (text: string, params?: any[]) => {
  if (!isDbConfigured) {
    return Promise.reject(new Error('NEON_DB_NOT_CONFIGURED'));
  }
  return pool.query(text, params);
};
