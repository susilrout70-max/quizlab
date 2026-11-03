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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  try {
    const dbRes = await query('SELECT NOW() as current_time');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      db_time: dbRes.rows[0].current_time,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 QuizLab Server running on port ${PORT}`);
  console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/health`);
});

export default app;
