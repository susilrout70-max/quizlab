"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUsers = void 0;
exports.signup = signup;
exports.login = login;
exports.getMe = getMe;
exports.logout = logout;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const index_js_1 = require("../db/index.js");
const JWT_SECRET = process.env.JWT_SECRET || 'quizlab_super_secret_jwt_key_2026';
if (!process.env.JWT_SECRET && (process.env.NODE_ENV === 'production' || process.env.VERCEL)) {
    console.warn('⚠️  JWT_SECRET environment variable is missing in production. Falling back to default secret.');
}
// In-memory store used if Neon DB connection is pending/placeholder
exports.mockUsers = new Map();
const signupSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email('Please enter a valid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    full_name: zod_1.z.string().trim().min(2, 'Full name must be at least 2 characters'),
    role: zod_1.z.enum(['student', 'teacher']).optional().default('student'),
    teacher_code: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email('Please enter a valid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
async function signup(req, res) {
    const parseResult = signupSchema.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: parseResult.error.errors[0]?.message || 'Invalid input data',
            },
        });
        return;
    }
    const { email, password, full_name, role, teacher_code } = parseResult.data;
    // Validate teacher institutional code
    if (role === 'teacher') {
        let expectedCode = 'QUIZLAB_TEACHER_2026';
        try {
            const configRes = await (0, index_js_1.query)("SELECT value FROM app_config WHERE key = 'TEACHER_INVITE_CODE'");
            if (configRes.rows.length > 0 && configRes.rows[0].value) {
                expectedCode = configRes.rows[0].value.trim();
            }
        }
        catch {
            // Use fallback expectedCode if query fails
        }
        if (!teacher_code || teacher_code.trim() !== expectedCode) {
            res.status(400).json({
                error: {
                    code: 'INVALID_INVITE_CODE',
                    message: 'Invalid teacher invite code. Please enter the valid institutional code: QUIZLAB_TEACHER_2026',
                },
            });
            return;
        }
    }
    try {
        // 1. Try DB check or fallback
        try {
            const existing = await (0, index_js_1.query)('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
            if (existing.rows.length > 0) {
                res.status(409).json({
                    error: {
                        code: 'ACCOUNT_EXISTS',
                        message: 'An account with this email already exists. Please log in.',
                    },
                });
                return;
            }
            const passwordHash = await bcryptjs_1.default.hash(password, 10);
            const insertRes = await (0, index_js_1.query)(`INSERT INTO users (email, password_hash, full_name, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, full_name, role, created_at`, [email.toLowerCase(), passwordHash, full_name, role]);
            const user = insertRes.rows[0];
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, full_name: user.full_name }, JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({
                message: 'Account created successfully',
                token,
                user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
            });
        }
        catch (dbErr) {
            console.warn('ℹ️ Neon DB query failed or pending. Using local store fallback:', dbErr?.message || dbErr);
            if (exports.mockUsers.has(email.toLowerCase())) {
                res.status(409).json({
                    error: {
                        code: 'ACCOUNT_EXISTS',
                        message: 'An account with this email already exists. Please log in.',
                    },
                });
                return;
            }
            const passwordHash = await bcryptjs_1.default.hash(password, 10);
            const user = {
                id: 'user-' + Date.now(),
                email: email.toLowerCase(),
                password_hash: passwordHash,
                full_name,
                role,
            };
            exports.mockUsers.set(email.toLowerCase(), user);
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, full_name: user.full_name }, JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({
                message: 'Account created successfully',
                token,
                user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
            });
        }
    }
    catch (error) {
        console.error('Signup error:', error?.message || error);
        res.status(500).json({
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error while creating account',
            },
        });
    }
}
async function login(req, res) {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: parseResult.error.errors[0]?.message || 'Invalid email or password format',
            },
        });
        return;
    }
    const { email, password } = parseResult.data;
    try {
        let user;
        try {
            const { rows } = await (0, index_js_1.query)('SELECT id, email, password_hash, full_name, role FROM users WHERE email = $1', [email.toLowerCase()]);
            user = rows[0];
        }
        catch (dbErr) {
            console.warn('ℹ️ Neon DB lookup failed, falling back to mockUsers:', dbErr?.message || dbErr);
            user = exports.mockUsers.get(email.toLowerCase());
        }
        if (!user || typeof user.password_hash !== 'string') {
            res.status(401).json({
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password',
                },
            });
            return;
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!passwordMatch) {
            res.status(401).json({
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid email or password',
                },
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, full_name: user.full_name }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error?.message || error);
        res.status(500).json({
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Internal server error while logging in',
            },
        });
    }
}
async function getMe(req, res) {
    if (!req.user) {
        res.status(401).json({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authentication required',
            },
        });
        return;
    }
    res.json({ user: req.user });
}
async function logout(_req, res) {
    res.json({ message: 'Logged out successfully' });
}
