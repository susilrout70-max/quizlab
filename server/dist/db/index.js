"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.pool = exports.isDbConfigured = void 0;
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { Pool } = pg_1.default;
const connectionString = process.env.DATABASE_URL;
exports.isDbConfigured = Boolean(connectionString &&
    !connectionString.includes('YOUR_PASSWORD') &&
    !connectionString.includes('ep-xyz'));
if (!exports.isDbConfigured) {
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
        console.error('❌ DATABASE_URL is missing or contains placeholder values in production!');
    }
    else {
        console.warn('⚠️  Neon DB connection string is pending or contains placeholders in server/.env.');
        console.warn('👉 Operating in fast localhost preview mode.');
    }
}
// Serverless-safe SSL detection: require SSL for Neon or when sslmode=require
const requiresSsl = Boolean(connectionString &&
    (connectionString.includes('neon.tech') ||
        connectionString.includes('sslmode=require') ||
        process.env.NODE_ENV === 'production'));
exports.pool = new Pool({
    connectionString: connectionString || 'postgresql://postgres:postgres@localhost:5432/quizlab',
    ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
    max: process.env.VERCEL ? 3 : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});
// CRITICAL: Handle idle client errors so unexpected connection drops do not crash the Node process
exports.pool.on('error', (err) => {
    console.error('⚠️ Unexpected idle client error in PostgreSQL pool:', err?.message || err);
});
const query = async (text, params) => {
    if (!exports.isDbConfigured) {
        throw new Error('NEON_DB_NOT_CONFIGURED');
    }
    return exports.pool.query(text, params);
};
exports.query = query;
