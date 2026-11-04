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
const JWT_SECRET = process.env.JWT_SECRET || 'quizlab_super_secret_jwt_key_2026';
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Authentication token required' });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        let user;
        try {
            // Fetch user profile from DB
            const { rows } = await (0, index_js_1.query)('SELECT id, email, full_name, role FROM users WHERE id = $1', [payload.id]);
            if (rows.length > 0) {
                user = rows[0];
            }
        }
        catch {
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
