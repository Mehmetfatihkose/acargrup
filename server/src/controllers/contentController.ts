import type { Request, Response, NextFunction } from 'express';
import db from '../db/connection.js';
import { AppError } from '../middleware/errorHandler.js';

export function getMilestones(_req: Request, res: Response, next: NextFunction): void {
  try {
    const rows = db.prepare('SELECT * FROM milestones ORDER BY year ASC').all();
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

export function getNews(_req: Request, res: Response, next: NextFunction): void {
  try {
    const rows = db.prepare('SELECT * FROM news ORDER BY published_at DESC, id DESC').all();
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

export function getNewsBySlug(req: Request, res: Response, next: NextFunction): void {
  try {
    const { slug } = req.params;
    const item = db.prepare('SELECT * FROM news WHERE slug = ?').get(slug);
    if (!item) {
      throw new AppError('Aradığınız haber veya duyuru bulunamadı.', 404);
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export function getStats(_req: Request, res: Response, next: NextFunction): void {
  try {
    const rows = db.prepare('SELECT * FROM stats ORDER BY sort_order ASC').all();
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

export function getCertificates(_req: Request, res: Response, next: NextFunction): void {
  try {
    const rows = db.prepare('SELECT * FROM certificates ORDER BY id ASC').all();
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

