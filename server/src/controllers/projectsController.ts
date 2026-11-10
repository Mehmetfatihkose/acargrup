import type { Request, Response, NextFunction } from 'express';
import db from '../db/connection.js';
import { AppError } from '../middleware/errorHandler.js';

interface ProjectRow {
  id: number;
  title: string;
  slug: string;
  category: string;
  sector: string;
  location: string;
  year: number;
  client: string;
  description: string;
  cover_image: string;
  budget_range: string;
  duration: string;
  created_at: string;
}

interface ProjectImageRow {
  id: number;
  project_id: number;
  image_url: string;
  caption: string;
  sort_order: number;
}

export function getProjects(req: Request, res: Response, next: NextFunction): void {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    let sql = 'SELECT * FROM projects WHERE 1=1';
    const params: Record<string, string> = {};

    if (category && category !== 'Tümü') {
      sql += ' AND category = @category';
      params.category = category;
    }

    if (search) {
      sql +=
        ' AND (title LIKE @search OR location LIKE @search OR client LIKE @search OR description LIKE @search)';
      params.search = `%${search}%`;
    }

    sql += ' ORDER BY year DESC, id ASC';

    const projects = db.prepare(sql).all(params) as ProjectRow[];
    const allImages = db
      .prepare('SELECT * FROM project_images ORDER BY sort_order ASC')
      .all() as ProjectImageRow[];

    const imagesByProject = new Map<number, ProjectImageRow[]>();
    for (const img of allImages) {
      const list = imagesByProject.get(img.project_id) || [];
      list.push(img);
      imagesByProject.set(img.project_id, list);
    }

    const enriched = projects.map((project) => ({
      ...project,
      images: imagesByProject.get(project.id) || [],
    }));

    res.json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
}

export function getProjectBySlug(req: Request, res: Response, next: NextFunction): void {
  try {
    const { slug } = req.params;
    const project = db
      .prepare('SELECT * FROM projects WHERE slug = ?')
      .get(slug) as ProjectRow | undefined;

    if (!project) {
      throw new AppError('Aradığınız proje kaydı bulunamadı.', 404);
    }

    const images = db
      .prepare('SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order ASC')
      .all(project.id) as ProjectImageRow[];

    const related = db
      .prepare(
        'SELECT * FROM projects WHERE category = ? AND id != ? ORDER BY year DESC LIMIT 3'
      )
      .all(project.category, project.id) as ProjectRow[];

    res.json({
      success: true,
      data: {
        ...project,
        images,
        related,
      },
    });
  } catch (err) {
    next(err);
  }
}

