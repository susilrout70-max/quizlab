import fs from 'fs';
import path from 'path';
import { pool } from './index.js';

async function runMigrations() {
  console.log('🔄 Running database migrations on Neon DB...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create migrations tracker table
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('No migrations directory found.');
      await client.query('COMMIT');
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const { rows } = await client.query('SELECT name FROM _migrations WHERE name = $1', [file]);
      if (rows.length === 0) {
        console.log(`⏳ Applying migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        await client.query(sql);
        await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
        console.log(`✅ Applied migration: ${file}`);
      } else {
        console.log(`⏩ Skipping already applied migration: ${file}`);
      }
    }

    await client.query('COMMIT');
    console.log('🎉 All migrations completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
