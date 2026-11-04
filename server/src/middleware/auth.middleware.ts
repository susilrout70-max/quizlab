import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db/index.js';
import { mockUsers } from '../controllers/auth.controller.js';
import { getJwtSecret, isProductionRuntime } from '../config/runtime.js';

export interface AuthUser {
  id: string;
  email: string;
  role: 'student' | 'teacher';
  full_name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Authentication token required' });
    return;
  }

  const jwtSecret = getJwtSecret();
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
    const payload = jwt.verify(token, jwtSecret) as { id: string; role: 'student' | 'teacher' };
    
    let user: AuthUser | undefined;

    try {
      // Fetch user profile from DB
      const { rows } = await query(
        'SELECT id, email, full_name, role FROM users WHERE id = $1',
        [payload.id]
      );
      if (rows.length > 0) {
        user = rows[0] as AuthUser;
      }
    } catch {
      if (isProductionRuntime()) {
        res.status(503).json({
          error: {
            code: 'DATABASE_UNAVAILABLE',
            message: 'Account storage is unavailable. Please try again later.',
          },
        });
        return;
      }

      // Check in-memory store if DB is pending
      for (const u of mockUsers.values()) {
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
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(role: 'student' | 'teacher') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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
