import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import {
  getQuizMeta,
  startQuiz,
  reattemptQuiz,
  submitQuiz,
  getQuizHistory,
  getQuizAnalytics,
  getAttemptReview,
} from '../controllers/quiz.controller.js';

const router = Router();

// All quiz routes require authentication
router.use(authenticateToken);

router.get('/meta', getQuizMeta);
router.post('/start', startQuiz);
router.post('/reattempt/:attemptId', reattemptQuiz);
router.post('/submit/:attemptId', submitQuiz);
router.get('/history', getQuizHistory);
router.get('/analytics', getQuizAnalytics);
router.get('/review/:attemptId', getAttemptReview);

export default router;
