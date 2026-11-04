"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const quiz_controller_js_1 = require("../controllers/quiz.controller.js");
const router = (0, express_1.Router)();
// All quiz routes require authentication
router.use(auth_middleware_js_1.authenticateToken);
router.get('/meta', quiz_controller_js_1.getQuizMeta);
router.post('/start', quiz_controller_js_1.startQuiz);
router.post('/reattempt/:attemptId', quiz_controller_js_1.reattemptQuiz);
router.post('/answer/:attemptId', quiz_controller_js_1.saveAnswer);
router.post('/submit/:attemptId', quiz_controller_js_1.submitQuiz);
router.get('/history', quiz_controller_js_1.getQuizHistory);
router.get('/analytics', quiz_controller_js_1.getQuizAnalytics);
router.get('/review/:attemptId', quiz_controller_js_1.getAttemptReview);
exports.default = router;
