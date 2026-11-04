/**
 * Vercel Serverless Function Entry Point
 * 
 * All /api/* requests are routed here by vercel.json.
 * This file imports the compiled Express app and re-exports it
 * so Vercel wraps it as a serverless function.
 * 
 * Environment variables (DATABASE_URL, JWT_SECRET, etc.) are
 * configured in Vercel's project settings dashboard — NOT from .env.
 */

// The server is compiled to server/dist by the buildCommand in vercel.json.
// Vercel's bundler traces this require and includes the compiled server code.
const app = require('../server/dist/index.js');

module.exports = app;
