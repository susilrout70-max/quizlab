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
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    console.error('❌ DATABASE_URL is missing or contains placeholder values in production!');
  } else {
    console.warn('⚠️  Neon DB connection string is pending or contains placeholders in server/.env.');
    console.warn('👉 Operating in fast localhost preview mode.');
  }
}

// Serverless-safe SSL detection: require SSL for Neon or when sslmode=require
const requiresSsl = Boolean(
  connectionString &&
  (connectionString.includes('neon.tech') ||
   connectionString.includes('sslmode=require') ||
   process.env.NODE_ENV === 'production')
);

export const pool = new Pool({
  connectionString: connectionString || 'postgresql://postgres:postgres@localhost:5432/quizlab',
  ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
  max: process.env.VERCEL ? 3 : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// CRITICAL: Handle idle client errors so unexpected connection drops do not crash the Node process
pool.on('error', (err) => {
  console.error('⚠️ Unexpected idle client error in PostgreSQL pool:', err?.message || err);
});

export const query = async (text: string, params?: any[]) => {
  if (!isDbConfigured) {
    throw new Error('NEON_DB_NOT_CONFIGURED');
  }
  return pool.query(text, params);
};
