"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_js_1 = require("../db/index.js");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const runtime_js_1 = require("../config/runtime.js");
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Authentication token required' });
        return;
    }
    const jwtSecret = (0, runtime_js_1.getJwtSecret)();
    if (!jwtSecret) {
        res.status(503).json({
            error: {
                code: 'JWT_SECRET_MISSING',
                message: 'Authentication is temporarily unavailable because the server is not configured.',
            },
        });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, jwtSecret);
        let user;
        try {
            // Fetch user profile from DB
            const { rows } = await (0, index_js_1.query)('SELECT id, email, full_name, role FROM users WHERE id = $1', [payload.id]);
            if (rows.length > 0) {
                user = rows[0];
            }
        }
        catch {
            if ((0, runtime_js_1.isProductionRuntime)()) {
                res.status(503).json({
                    error: {
                        code: 'DATABASE_UNAVAILABLE',
                        message: 'Account storage is unavailable. Please try again later.',
                    },
                });
                return;
            }
            // Check in-memory store if DB is pending
            for (const u of auth_controller_js_1.mockUsers.values()) {
                if (u.id === payload.id) {
                    user = {
                        id: u.id,
                        email: u.email,
                        full_name: u.full_name,
                        role: u.role,
                    };
                    break;
                }
            }
        }
        if (!user) {
            res.status(401).json({ error: 'User not found or session invalid' });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
}
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        if (req.user.role !== role) {
            res.status(403).json({ error: `Access forbidden: requires ${role} role` });
            return;
        }
        next();
    };
}
