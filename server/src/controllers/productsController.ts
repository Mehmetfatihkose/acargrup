import type { Request, Response, NextFunction } from 'express';
import db from '../db/connection.js';
import { AppError } from '../middleware/errorHandler.js';

interface ProductRow {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  specs_json: string;
  packaging: string;
  image: string;
}

function parseProduct(row: ProductRow) {
  let specs = {};
  try {
    specs = JSON.parse(row.specs_json);
  } catch {
    specs = {};
  }
  return {
    ...row,
    specs,
  };
}

export function getProducts(_req: Request, res: Response, next: NextFunction): void {
  try {
    const rows = db.prepare('SELECT * FROM products ORDER BY id ASC').all() as ProductRow[];
    res.json({
      success: true,
      data: rows.map(parseProduct),
    });
  } catch (err) {
    next(err);
  }
}

export function getProductBySlug(req: Request, res: Response, next: NextFunction): void {
  try {
    const { slug } = req.params;
    const row = db
      .prepare('SELECT * FROM products WHERE slug = ?')
      .get(slug) as ProductRow | undefined;

    if (!row) {
      throw new AppError('Aradığınız hammadde ürünü bulunamadı.', 404);
    }

    res.json({
      success: true,
      data: parseProduct(row),
    });
  } catch (err) {
    next(err);
  }
}

