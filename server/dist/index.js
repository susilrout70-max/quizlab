"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const quiz_routes_js_1 = __importDefault(require("./routes/quiz.routes.js"));
const ai_routes_js_1 = __importDefault(require("./routes/ai.routes.js"));
const index_js_1 = require("./db/index.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Safe request logger for production debugging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`📡 [${req.method}] ${req.originalUrl || req.url} -> ${res.statusCode} (${duration}ms)`);
    });
    next();
});
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes - mounted on both /api/* and root paths to handle any Vercel rewrite configuration
app.use('/api/auth', auth_routes_js_1.default);
app.use('/auth', auth_routes_js_1.default);
app.use('/api/quiz', quiz_routes_js_1.default);
app.use('/quiz', quiz_routes_js_1.default);
app.use('/api/ai', ai_routes_js_1.default);
app.use('/ai', ai_routes_js_1.default);
// Health check endpoint (both /api/health and /health)
const healthHandler = async (_req, res) => {
    try {
        const dbRes = await (0, index_js_1.query)('SELECT NOW() as current_time');
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: 'connected',
            db_time: dbRes.rows[0]?.current_time || new Date().toISOString(),
        });
    }
    catch (error) {
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
app.get('/', (_req, res) => {
    res.json({ status: 'ok', service: 'quizlab-api' });
});
// 404 handler for unrecognized /api routes
app.use('/api/*', (_req, res) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: 'Requested API endpoint was not found',
        },
    });
});
// Global Express error handler: ensure JSON response and never leak stacks or secrets
app.use((err, _req, res, _next) => {
    console.error('💥 Unhandled Express Error:', err?.message || err);
    res.status(err.status || 500).json({
        error: {
            code: err.code || 'INTERNAL_SERVER_ERROR',
            message: err.message || 'An unexpected server error occurred',
        },
    });
});
// Only start TCP listener when running locally (NEVER when imported in Vercel serverless environment)
if (!process.env.VERCEL && !process.env.VERCEL_ENV && process.env.NODE_ENV !== 'test') {
    const server = app.listen(PORT, () => {
        console.log(`🚀 QuizLab Server running on port ${PORT}`);
        console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/health`);
    });
    server.on('error', (err) => {
        console.error('❌ Server listen error:', err?.message || err);
    });
}
exports.default = app;
module.exports = app;
module.exports.default = app;
