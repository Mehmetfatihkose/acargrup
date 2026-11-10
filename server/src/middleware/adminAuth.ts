import type { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../db/connection.js';

export interface AuthenticatedAdminRequest extends Request {
  adminUser?: {
    id: number;
    username: string;
    name: string;
    role: string;
  };
}

export function requireAdminAuth(
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Yetkisiz erişim: Oturum açmanız gerekmektedir.',
    });
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Geçersiz oturum belirteci.',
    });
    return;
  }

  try {
    const db = getDatabase();
    const session = db
      .prepare(`
        SELECT s.token, s.expires_at, u.id, u.username, u.name, u.role
        FROM admin_sessions s
        JOIN admin_users u ON u.id = s.user_id
        WHERE s.token = ? AND s.expires_at > datetime('now')
      `)
      .get(token) as {
        token: string;
        expires_at: string;
        id: number;
        username: string;
        name: string;
        role: string;
      } | undefined;

    if (!session) {
      res.status(401).json({
        success: false,
        message: 'Oturum süresi dolmuş veya geçersiz. Lütfen tekrar giriş yapın.',
      });
      return;
    }

    req.adminUser = {
      id: session.id,
      username: session.username,
      name: session.name,
      role: session.role,
    };

    next();
  } catch (error) {
    console.error('[Admin Auth Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Oturum doğrulanırken sunucu hatası oluştu.',
    });
  }
}

