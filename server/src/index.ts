import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import aiRoutes from './routes/ai.routes.js';
import { query } from './db/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// Normalize Netlify function path prefix if present
app.use((req, _res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '') || '/';
  }
  next();
});

// Routes - mounted on both /api/* and root paths to handle any Vercel/Netlify rewrite configuration
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/quiz', quizRoutes);
app.use('/quiz', quizRoutes);

app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

// Health check endpoint (both /api/health and /health)
const healthHandler = async (_req: express.Request, res: express.Response) => {
  try {
    const dbRes = await query('SELECT NOW() as current_time');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      db_time: dbRes.rows[0]?.current_time || new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database connection failed',
      },
    });
  }
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// 404 handler for unrecognized /api routes
app.use('/api', (_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Requested API endpoint was not found',
    },
  });
});

// Global Express error handler: ensure JSON response and never leak stacks or secrets
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('💥 Unhandled Express Error:', err?.message || err);
  res.status(err.status || 500).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected server error occurred',
    },
  });
});

// Only start TCP listener when running directly in local dev (never in Vercel/Netlify serverless or test environments)
const isDirectExecution = typeof require === 'undefined' || require.main === module;
const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.VERCEL_ENV ||
  process.env.NETLIFY ||
  process.env.AWS_LAMBDA_FUNCTION_NAME
);

if (isDirectExecution && !isServerless && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 QuizLab Server running on port ${PORT}`);
    console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/health`);
  });
}

export default app;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
  module.exports.default = app;
}
