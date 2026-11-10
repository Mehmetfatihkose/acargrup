import type { Request, Response } from 'express';
import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import sharp from 'sharp';
import { getDatabase } from '../db/connection.js';
import { verifyPassword, hashPassword, generateSessionToken } from '../utils/cryptoAuth.js';
import type { AuthenticatedAdminRequest } from '../middleware/adminAuth.js';

// Dosya yükleme (Multer) depolama ayarları
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mediaDir = path.resolve(__dirname, '../../../client/public/media');
const uploadDir = path.resolve(mediaDir, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const backupDir = path.resolve(uploadDir, '_backup');
const MAX_IMAGE_BYTES = Number(process.env.MAX_IMAGE_SIZE_MB || 5) * 1024 * 1024;
const MAX_IMAGE_WIDTH = Number(process.env.IMAGE_MAX_WIDTH || 1920);

// Dosya bellekte alınır; içeriği doğrulanıp optimize edildikten sonra diske yazılır.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 35 * 1024 * 1024 }, // video için üst sınır; görseller 5 MB ile ayrıca sınırlanır
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|webp|mp4|webm)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Desteklenmeyen dosya türü (yalnızca JPG, PNG, WebP, MP4, WebM kabul edilir).'));
    }
  },
});

/** Dosyanın gerçek içeriğine (magic bytes) bakarak türünü belirler. */
function detectFileKind(buf: Buffer): 'image' | 'video' | null {
  if (buf.length < 12) return null;
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const isPng = buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP';
  if (isJpeg || isPng || isWebp) return 'image';
  const isMp4 = buf.toString('ascii', 4, 8) === 'ftyp';
  const isWebm = buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3;
  if (isMp4 || isWebm) return 'video';
  return null;
}

/** Bir /media/uploads/... dosyasını silmek yerine _backup klasörüne taşır. */
function backupUploadedFile(url: string): void {
  if (!url.startsWith('/media/uploads/')) return;
  const name = path.basename(url);
  const src = path.join(uploadDir, name);
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(backupDir, { recursive: true });
  fs.renameSync(src, path.join(backupDir, name));
}

/** Geri almada, yedeğe taşınmış dosyayı yerine koyar. */
function restoreUploadedFile(url: string): void {
  if (!url.startsWith('/media/uploads/')) return;
  const name = path.basename(url);
  const inBackup = path.join(backupDir, name);
  const target = path.join(uploadDir, name);
  if (fs.existsSync(inBackup) && !fs.existsSync(target)) {
    fs.renameSync(inBackup, target);
  }
}

/** Metin alanlarından HTML etiketlerini temizler (XSS önlemi). */
function stripHtml(value: string): string {
  return value
    .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '');
}

// Giriş doğrulama şeması
const loginSchema = z.object({
  username: z.string().trim().min(1, 'Kullanıcı adı gereklidir.'),
  password: z.string().min(1, 'Parola gereklidir.'),
});

// Proje oluşturma / güncelleme şeması
const projectSchema = z.object({
  title: z.string().trim().min(3, 'Proje başlığı en az 3 karakter olmalıdır.'),
  slug: z.string().trim().min(3, 'Slug en az 3 karakter olmalıdır.'),
  category: z.string().trim().min(2, 'Kategori gereklidir.'),
  sector: z.string().trim().default('İnşaat'),
  location: z.string().trim().min(2, 'Konum gereklidir.'),
  year: z.number().int().min(1974).max(2100),
  client: z.string().trim().min(2, 'İşveren idare gereklidir.'),
  description: z.string().trim().min(10, 'Açıklama gereklidir.'),
  cover_image: z.string().trim().min(1, 'Kapak görseli gereklidir.'),
  budget_range: z.string().trim().min(2, 'Bütçe hacmi gereklidir.'),
  duration: z.string().trim().min(2, 'Süre gereklidir.'),
});

// Ürün oluşturma / güncelleme şeması
const productSchema = z.object({
  name: z.string().trim().min(2, 'Ürün adı gereklidir.'),
  slug: z.string().trim().min(2, 'Slug gereklidir.'),
  category: z.string().trim().min(2, 'Kategori gereklidir.'),
  description: z.string().trim().min(5, 'Açıklama gereklidir.'),
  specs_json: z.string().trim().min(2, 'Teknik özellikler JSON formatında gereklidir.'),
  packaging: z.string().trim().min(2, 'Ambalaj bilgisi gereklidir.'),
  image: z.string().trim().min(1, 'Görsel yolu gereklidir.'),
});

// Haber oluşturma / güncelleme şeması
const newsSchema = z.object({
  title: z.string().trim().min(3, 'Haber başlığı gereklidir.'),
  slug: z.string().trim().min(3, 'Slug gereklidir.'),
  summary: z.string().trim().min(10, 'Özet gereklidir.'),
  content: z.string().trim().min(20, 'İçerik gereklidir.'),
  image: z.string().trim().min(1, 'Görsel yolu gereklidir.'),
  published_at: z.string().trim().min(10, 'Yayın tarihi gereklidir.'),
});

/**
 * Admin Girişi
 */
export async function adminLogin(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      success: false,
      message: parseResult.error.errors[0]?.message || 'Geçersiz giriş bilgileri.',
    });
    return;
  }

  const { username, password } = parseResult.data;
  const db = getDatabase();

  const user = db
    .prepare(`SELECT id, username, password_hash, salt, name, role FROM admin_users WHERE username = ?`)
    .get(username) as {
      id: number;
      username: string;
      password_hash: string;
      salt: string;
      name: string;
      role: string;
    } | undefined;

  if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
    res.status(401).json({
      success: false,
      message: 'Kullanıcı adı veya parola hatalı.',
    });
    return;
  }

  const token = generateSessionToken();
  // 7 günlük oturum
  db.prepare(`
    INSERT INTO admin_sessions (token, user_id, expires_at)
    VALUES (?, ?, datetime('now', '+7 days'))
  `).run(token, user.id);

  res.json({
    success: true,
    message: 'Giriş başarılı.',
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    },
  });
}

/**
 * Admin Çıkışı
 */
export async function adminLogout(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    const db = getDatabase();
    db.prepare(`DELETE FROM admin_sessions WHERE token = ?`).run(token);
  }

  res.json({ success: true, message: 'Oturum kapatıldı.' });
}

/**
 * Aktif Yönetici Bilgisi
 */
export async function adminGetMe(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  res.json({
    success: true,
    data: req.adminUser,
  });
}

/**
 * Dashboard İstatistikleri
 */
export async function adminGetDashboardStats(_req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const db = getDatabase();

  const projectCount = (db.prepare(`SELECT COUNT(*) as count FROM projects`).get() as { count: number }).count;
  const productCount = (db.prepare(`SELECT COUNT(*) as count FROM products`).get() as { count: number }).count;
  const totalQuotes = (db.prepare(`SELECT COUNT(*) as count FROM quote_requests`).get() as { count: number }).count;
  const pendingQuotes = (
    db.prepare(`SELECT COUNT(*) as count FROM quote_requests WHERE status = 'beklemede'`).get() as { count: number }
  ).count;
  const totalMessages = (db.prepare(`SELECT COUNT(*) as count FROM contact_messages`).get() as { count: number }).count;
  const unreadMessages = (
    db.prepare(`SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0`).get() as { count: number }
  ).count;
  const newsCount = (db.prepare(`SELECT COUNT(*) as count FROM news`).get() as { count: number }).count;

  const recentQuotes = db
    .prepare(`
      SELECT q.*, p.name as product_name
      FROM quote_requests q
      LEFT JOIN products p ON p.id = q.product_id
      ORDER BY q.id DESC
      LIMIT 6
    `)
    .all();

  const recentMessages = db
    .prepare(`
      SELECT * FROM contact_messages
      ORDER BY id DESC
      LIMIT 6
    `)
    .all();

  res.json({
    success: true,
    data: {
      metrics: {
        projects: projectCount,
        products: productCount,
        totalQuotes,
        pendingQuotes,
        totalMessages,
        unreadMessages,
        news: newsCount,
      },
      recentQuotes,
      recentMessages,
    },
  });
}

/**
 * Fiyat Teklif Talepleri
 */
export async function adminGetQuotes(_req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const db = getDatabase();
  const quotes = db
    .prepare(`
      SELECT q.*, p.name as product_name, p.category as product_category
      FROM quote_requests q
      LEFT JOIN products p ON p.id = q.product_id
      ORDER BY q.id DESC
    `)
    .all();

  res.json({ success: true, data: quotes });
}

export async function adminUpdateQuoteStatus(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['beklemede', 'incelendi', 'teklif_verildi', 'arsivlendi'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ success: false, message: 'Geçersiz teklif durumu.' });
    return;
  }

  const db = getDatabase();
  const result = db.prepare(`UPDATE quote_requests SET status = ? WHERE id = ?`).run(status, id);

  if (result.changes === 0) {
    res.status(404).json({ success: false, message: 'Teklif talebi bulunamadı.' });
    return;
  }

  res.json({ success: true, message: 'Teklif durumu güncellendi.' });
}

export async function adminDeleteQuote(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const db = getDatabase();
  db.prepare(`DELETE FROM quote_requests WHERE id = ?`).run(id);
  res.json({ success: true, message: 'Teklif talebi silindi.' });
}

/**
 * İletişim Mesajları
 */
export async function adminGetMessages(_req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const db = getDatabase();
  const messages = db.prepare(`SELECT * FROM contact_messages ORDER BY id DESC`).all();
  res.json({ success: true, data: messages });
}

export async function adminToggleMessageRead(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const { is_read } = req.body;
  const db = getDatabase();
  db.prepare(`UPDATE contact_messages SET is_read = ? WHERE id = ?`).run(is_read ? 1 : 0, id);
  res.json({ success: true, message: 'Mesaj okundu durumu güncellendi.' });
}

export async function adminDeleteMessage(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const db = getDatabase();
  db.prepare(`DELETE FROM contact_messages WHERE id = ?`).run(id);
  res.json({ success: true, message: 'Mesaj silindi.' });
}

/**
 * Projeler CRUD
 */
export async function adminGetProjects(_req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const db = getDatabase();
  const projects = db
    .prepare(`
      SELECT p.*, (SELECT COUNT(*) FROM project_images pi WHERE pi.project_id = p.id) as image_count
      FROM projects p
      ORDER BY p.id DESC
    `)
    .all();

  res.json({ success: true, data: projects });
}

export async function adminCreateProject(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const parse = projectSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: parse.error.errors[0]?.message });
    return;
  }

  const p = parse.data;
  const db = getDatabase();

  try {
    const result = db.prepare(`
      INSERT INTO projects (title, slug, category, sector, location, year, client, description, cover_image, budget_range, duration)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(p.title, p.slug, p.category, p.sector, p.location, p.year, p.client, p.description, p.cover_image, p.budget_range, p.duration);

    res.status(201).json({ success: true, message: 'Proje başarıyla eklendi.', data: { id: result.lastInsertRowid } });
  } catch (err: any) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ success: false, message: 'Bu slug adresi başka bir projede kullanılıyor.' });
      return;
    }
    res.status(500).json({ success: false, message: 'Proje eklenirken hata oluştu.' });
  }
}

export async function adminUpdateProject(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const parse = projectSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: parse.error.errors[0]?.message });
    return;
  }

  const p = parse.data;
  const db = getDatabase();

  try {
    const result = db.prepare(`
      UPDATE projects
      SET title = ?, slug = ?, category = ?, sector = ?, location = ?, year = ?, client = ?, description = ?, cover_image = ?, budget_range = ?, duration = ?
      WHERE id = ?
    `).run(p.title, p.slug, p.category, p.sector, p.location, p.year, p.client, p.description, p.cover_image, p.budget_range, p.duration, id);

    if (result.changes === 0) {
      res.status(404).json({ success: false, message: 'Proje bulunamadı.' });
      return;
    }

    res.json({ success: true, message: 'Proje başarıyla güncellendi.' });
  } catch (err: any) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ success: false, message: 'Bu slug adresi başka bir projede kullanılıyor.' });
      return;
    }
    res.status(500).json({ success: false, message: 'Proje güncellenirken hata oluştu.' });
  }
}

export async function adminDeleteProject(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const db = getDatabase();
  db.prepare(`DELETE FROM projects WHERE id = ?`).run(id);
  res.json({ success: true, message: 'Proje silindi.' });
}

/**
 * Plastik Hammadde Ürünleri CRUD
 */
export async function adminGetProducts(_req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const db = getDatabase();
  const products = db.prepare(`SELECT * FROM products ORDER BY id ASC`).all();
  res.json({ success: true, data: products });
}

export async function adminCreateProduct(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const parse = productSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: parse.error.errors[0]?.message });
    return;
  }

  const p = parse.data;
  const db = getDatabase();

  try {
    const result = db.prepare(`
      INSERT INTO products (name, slug, category, description, specs_json, packaging, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(p.name, p.slug, p.category, p.description, p.specs_json, p.packaging, p.image);

    res.status(201).json({ success: true, message: 'Ürün grubu eklendi.', data: { id: result.lastInsertRowid } });
  } catch (err: any) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ success: false, message: 'Bu slug başka bir üründe kullanılıyor.' });
      return;
    }
    res.status(500).json({ success: false, message: 'Ürün eklenirken hata oluştu.' });
  }
}

export async function adminUpdateProduct(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const parse = productSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: parse.error.errors[0]?.message });
    return;
  }

  const p = parse.data;
  const db = getDatabase();

  try {
    const result = db.prepare(`
      UPDATE products
      SET name = ?, slug = ?, category = ?, description = ?, specs_json = ?, packaging = ?, image = ?
      WHERE id = ?
    `).run(p.name, p.slug, p.category, p.description, p.specs_json, p.packaging, p.image, id);

    if (result.changes === 0) {
      res.status(404).json({ success: false, message: 'Ürün bulunamadı.' });
      return;
    }

    res.json({ success: true, message: 'Ürün başarıyla güncellendi.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Ürün güncellenirken hata oluştu.' });
  }
}

export async function adminDeleteProduct(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const db = getDatabase();
  db.prepare(`DELETE FROM products WHERE id = ?`).run(id);
  res.json({ success: true, message: 'Ürün grubu silindi.' });
}

/**
 * Haberler CRUD
 */
export async function adminGetNews(_req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const db = getDatabase();
  const news = db.prepare(`SELECT * FROM news ORDER BY published_at DESC`).all();
  res.json({ success: true, data: news });
}

export async function adminCreateNews(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const parse = newsSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: parse.error.errors[0]?.message });
    return;
  }

  const n = parse.data;
  const db = getDatabase();

  try {
    const result = db.prepare(`
      INSERT INTO news (title, slug, summary, content, image, published_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(n.title, n.slug, n.summary, n.content, n.image, n.published_at);

    res.status(201).json({ success: true, message: 'Haber başarıyla eklendi.', data: { id: result.lastInsertRowid } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Haber eklenirken hata oluştu.' });
  }
}

export async function adminUpdateNews(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const parse = newsSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: parse.error.errors[0]?.message });
    return;
  }

  const n = parse.data;
  const db = getDatabase();

  try {
    const result = db.prepare(`
      UPDATE news
      SET title = ?, slug = ?, summary = ?, content = ?, image = ?, published_at = ?
      WHERE id = ?
    `).run(n.title, n.slug, n.summary, n.content, n.image, n.published_at, id);

    if (result.changes === 0) {
      res.status(404).json({ success: false, message: 'Haber bulunamadı.' });
      return;
    }

    res.json({ success: true, message: 'Haber güncellendi.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Haber güncellenirken hata oluştu.' });
  }
}

export async function adminDeleteNews(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const db = getDatabase();
  db.prepare(`DELETE FROM news WHERE id = ?`).run(id);
  res.json({ success: true, message: 'Haber silindi.' });
}

// ----------------------------------------------------
// DÖNÜM NOKTALARI / TARİHÇE (MILESTONES) CRUD
// ----------------------------------------------------
const milestoneSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  title: z.string().trim().min(2, 'Başlık gereklidir.'),
  description: z.string().trim().min(5, 'Açıklama gereklidir.'),
});

export async function adminGetMilestones(_req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const db = getDatabase();
  const list = db.prepare(`SELECT * FROM milestones ORDER BY year ASC`).all();
  res.json({ success: true, data: list });
}

export async function adminCreateMilestone(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const parse = milestoneSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: parse.error.errors[0]?.message });
    return;
  }
  const db = getDatabase();
  const { year, title, description } = parse.data;
  const result = db.prepare(`INSERT INTO milestones (year, title, description) VALUES (?, ?, ?)`).run(year, title, description);
  res.status(201).json({ success: true, message: 'Dönüm noktası eklendi.', data: { id: result.lastInsertRowid } });
}

export async function adminUpdateMilestone(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const parse = milestoneSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: parse.error.errors[0]?.message });
    return;
  }
  const db = getDatabase();
  const { year, title, description } = parse.data;
  db.prepare(`UPDATE milestones SET year = ?, title = ?, description = ? WHERE id = ?`).run(year, title, description, id);
  res.json({ success: true, message: 'Dönüm noktası güncellendi.' });
}

export async function adminDeleteMilestone(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const db = getDatabase();
  db.prepare(`DELETE FROM milestones WHERE id = ?`).run(id);
  res.json({ success: true, message: 'Dönüm noktası silindi.' });
}

// ----------------------------------------------------
// SERTİFİKALAR VE BELGELER (CERTIFICATES) CRUD
// ----------------------------------------------------
const certificateSchema = z.object({
  name: z.string().trim().min(2, 'Sertifika adı gereklidir.'),
  image: z.string().trim().min(1, 'Rozet kodu gereklidir.'),
  description: z.string().trim().min(5, 'Açıklama gereklidir.'),
});

export async function adminGetCertificates(_req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const db = getDatabase();
  const list = db.prepare(`SELECT * FROM certificates ORDER BY id ASC`).all();
  res.json({ success: true, data: list });
}

export async function adminCreateCertificate(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const parse = certificateSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: parse.error.errors[0]?.message });
    return;
  }
  const db = getDatabase();
  const { name, image, description } = parse.data;
  const result = db.prepare(`INSERT INTO certificates (name, image, description) VALUES (?, ?, ?)`).run(name, image, description);
  res.status(201).json({ success: true, message: 'Sertifika eklendi.', data: { id: result.lastInsertRowid } });
}

export async function adminUpdateCertificate(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const parse = certificateSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: parse.error.errors[0]?.message });
    return;
  }
  const db = getDatabase();
  const { name, image, description } = parse.data;
  db.prepare(`UPDATE certificates SET name = ?, image = ?, description = ? WHERE id = ?`).run(name, image, description, id);
  res.json({ success: true, message: 'Sertifika güncellendi.' });
}

export async function adminDeleteCertificate(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const db = getDatabase();
  db.prepare(`DELETE FROM certificates WHERE id = ?`).run(id);
  res.json({ success: true, message: 'Sertifika silindi.' });
}

// ----------------------------------------------------
// RAKAMLARLA ACAR GRUP (STATS) CRUD
// ----------------------------------------------------
const statSchema = z.object({
  label: z.string().trim().min(2, 'Sayaç etiketi gereklidir.'),
  value: z.number().int(),
  suffix: z.string().default(''),
  sort_order: z.number().int().default(0),
});

export async function adminGetStats(_req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const db = getDatabase();
  const list = db.prepare(`SELECT * FROM stats ORDER BY sort_order ASC, id ASC`).all();
  res.json({ success: true, data: list });
}

export async function adminCreateStat(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const parse = statSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: parse.error.errors[0]?.message });
    return;
  }
  const db = getDatabase();
  const { label, value, suffix, sort_order } = parse.data;
  const result = db.prepare(`INSERT INTO stats (label, value, suffix, sort_order) VALUES (?, ?, ?, ?)`).run(label, value, suffix, sort_order);
  res.status(201).json({ success: true, message: 'İstatistik sayacı eklendi.', data: { id: result.lastInsertRowid } });
}

export async function adminUpdateStat(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const parse = statSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: parse.error.errors[0]?.message });
    return;
  }
  const db = getDatabase();
  const { label, value, suffix, sort_order } = parse.data;
  db.prepare(`UPDATE stats SET label = ?, value = ?, suffix = ?, sort_order = ? WHERE id = ?`).run(label, value, suffix, sort_order, id);
  res.json({ success: true, message: 'İstatistik güncellendi.' });
}

export async function adminDeleteStat(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const db = getDatabase();
  db.prepare(`DELETE FROM stats WHERE id = ?`).run(id);
  res.json({ success: true, message: 'İstatistik silindi.' });
}

// ----------------------------------------------------
// SİTE AYARLARI VE SAYFA İÇERİK METİNLERİ (CMS)
// ----------------------------------------------------
const updateSettingsSchema = z.record(z.string());

export async function adminGetSettings(_req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const db = getDatabase();
  const settings = db.prepare(`SELECT key, value, group_name, label, type FROM site_settings ORDER BY group_name ASC, key ASC`).all();
  res.json({ success: true, data: settings });
}

export async function adminUpdateSettings(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const parse = updateSettingsSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: 'Geçersiz ayar verisi.' });
    return;
  }

  const db = getDatabase();
  ensureHistoryTable();
  const selectStmt = db.prepare(`SELECT value, type FROM site_settings WHERE key = ?`);
  const updateStmt = db.prepare(`UPDATE site_settings SET value = ? WHERE key = ?`);
  const insertHistory = db.prepare(`
    INSERT INTO site_settings_history (setting_key, old_value, new_value, changed_by)
    VALUES (?, ?, ?, ?)
  `);
  const pruneHistory = db.prepare(`
    DELETE FROM site_settings_history
    WHERE setting_key = ? AND id NOT IN (
      SELECT id FROM site_settings_history WHERE setting_key = ? ORDER BY id DESC LIMIT ?
    )
  `);
  const adminName = req.adminUser?.username || 'admin';
  const replacedFiles: string[] = [];

  const updateAll = db.transaction((entries: [string, string][]) => {
    for (const [key, rawValue] of entries) {
      const current = selectStmt.get(key) as { value: string; type: string } | undefined;
      if (!current) continue;
      const value = current.type === 'image' ? rawValue.trim() : stripHtml(rawValue);
      if (current.value === value) continue;
      insertHistory.run(key, current.value, value, adminName);
      pruneHistory.run(key, key, HISTORY_LIMIT);
      updateStmt.run(value, key);
      if (current.type === 'image' && current.value) replacedFiles.push(current.value);
    }
  });

  try {
    updateAll(Object.entries(parse.data));
    // Eski fotoğraflar silinmez, başka yerde kullanılmıyorsa _backup klasörüne taşınır.
    for (const oldUrl of replacedFiles) {
      const stillUsed = db.prepare(`SELECT 1 FROM site_settings WHERE value = ? LIMIT 1`).get(oldUrl);
      if (!stillUsed) backupUploadedFile(oldUrl);
    }
    res.json({ success: true, message: 'Site içerikleri başarıyla güncellendi.' });
  } catch {
    res.status(500).json({ success: false, message: 'Ayarlar kaydedilirken hata oluştu.' });
  }
}

const HISTORY_LIMIT = 20;

function ensureHistoryTable(): void {
  getDatabase().exec(`
    CREATE TABLE IF NOT EXISTS site_settings_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      setting_key TEXT NOT NULL,
      old_value TEXT NOT NULL,
      new_value TEXT NOT NULL,
      changed_by TEXT NOT NULL DEFAULT 'admin',
      changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_settings_history_key ON site_settings_history(setting_key, id DESC);
  `);
}

export async function adminGetSettingHistory(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const key = String(req.query.key || '');
  if (!key) {
    res.status(400).json({ success: false, message: 'Alan anahtarı gereklidir.' });
    return;
  }
  ensureHistoryTable();
  const rows = getDatabase()
    .prepare(`
      SELECT id, setting_key, old_value, new_value, changed_by, changed_at
      FROM site_settings_history WHERE setting_key = ? ORDER BY id DESC LIMIT ?
    `)
    .all(key, HISTORY_LIMIT);
  res.json({ success: true, data: rows });
}

export async function adminRestoreSetting(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const parse = z.object({ historyId: z.number().int() }).safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ success: false, message: 'Geçersiz sürüm kimliği.' });
    return;
  }
  ensureHistoryTable();
  const db = getDatabase();
  const entry = db
    .prepare(`SELECT setting_key, old_value FROM site_settings_history WHERE id = ?`)
    .get(parse.data.historyId) as { setting_key: string; old_value: string } | undefined;
  const current = entry
    ? (db.prepare(`SELECT value, type FROM site_settings WHERE key = ?`).get(entry.setting_key) as
        | { value: string; type: string }
        | undefined)
    : undefined;

  if (!entry || !current) {
    res.status(404).json({ success: false, message: 'Önceki sürüm bulunamadı.' });
    return;
  }

  if (current.type === 'image') restoreUploadedFile(entry.old_value);
  db.prepare(`
    INSERT INTO site_settings_history (setting_key, old_value, new_value, changed_by)
    VALUES (?, ?, ?, ?)
  `).run(entry.setting_key, current.value, entry.old_value, `${req.adminUser?.username || 'admin'} (geri alma)`);
  db.prepare(`UPDATE site_settings SET value = ? WHERE key = ?`).run(entry.old_value, entry.setting_key);
  if (current.type === 'image' && current.value !== entry.old_value) {
    const stillUsed = db.prepare(`SELECT 1 FROM site_settings WHERE value = ? LIMIT 1`).get(current.value);
    if (!stillUsed) backupUploadedFile(current.value);
  }
  res.json({ success: true, message: 'Önceki sürüme dönüldü.', data: { key: entry.setting_key, value: entry.old_value } });
}

export async function getPublicSettings(_req: Request, res: Response): Promise<void> {
  const db = getDatabase();
  try {
    const rows = db.prepare(`SELECT key, value FROM site_settings`).all() as { key: string; value: string }[];
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }
    res.json({ success: true, data: map });
  } catch {
    res.json({ success: true, data: {} });
  }
}

// ----------------------------------------------------
// MEDYA VE DOSYA YÜKLEME YÖNETİMİ
// ----------------------------------------------------
export async function adminGetMedia(_req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  try {
    const results: Array<{
      filename: string;
      url: string;
      size: number;
      isUpload: boolean;
      modifiedAt: string;
    }> = [];

    // Ana public/media klasörünü tara
    if (fs.existsSync(mediaDir)) {
      const files = fs.readdirSync(mediaDir);
      for (const file of files) {
        const fullPath = path.join(mediaDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isFile() && !file.startsWith('.')) {
          results.push({
            filename: file,
            url: `/media/${file}`,
            size: stat.size,
            isUpload: false,
            modifiedAt: stat.mtime.toISOString(),
          });
        }
      }
    }

    // Yüklenenler uploads klasörünü tara
    if (fs.existsSync(uploadDir)) {
      const uploads = fs.readdirSync(uploadDir);
      for (const file of uploads) {
        const fullPath = path.join(uploadDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isFile() && !file.startsWith('.')) {
          results.push({
            filename: file,
            url: `/media/uploads/${file}`,
            size: stat.size,
            isUpload: true,
            modifiedAt: stat.mtime.toISOString(),
          });
        }
      }
    }

    results.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

    res.json({ success: true, data: results });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Medya dosyaları taranamadı.' });
  }
}

export async function adminUploadMedia(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'Lütfen bir dosya seçiniz.' });
    return;
  }

  const buffer = req.file.buffer;
  const kind = detectFileKind(buffer);
  if (!kind) {
    res.status(400).json({ success: false, message: 'Dosya içeriği geçerli bir JPG, PNG, WebP, MP4 veya WebM değil.' });
    return;
  }

  const baseName = path
    .basename(req.file.originalname, path.extname(req.file.originalname))
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .slice(0, 48) || 'dosya';

  fs.mkdirSync(uploadDir, { recursive: true });

  try {
    if (kind === 'image') {
      if (buffer.length > MAX_IMAGE_BYTES) {
        res.status(400).json({
          success: false,
          message: `Fotoğraf boyutu en fazla ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)} MB olabilir.`,
        });
        return;
      }
      const filename = `${baseName}-${Date.now()}.webp`;
      // Otomatik küçültme + WebP dönüşümü + EXIF/konum bilgisi temizleme
      const info = await sharp(buffer)
        .rotate()
        .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(uploadDir, filename));
      res.json({
        success: true,
        message: 'Fotoğraf yüklendi ve optimize edildi.',
        data: { url: `/media/uploads/${filename}`, filename, size: info.size, mimetype: 'image/webp' },
      });
      return;
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `${baseName}-${Date.now()}${ext}`;
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    res.json({
      success: true,
      message: 'Dosya başarıyla yüklendi.',
      data: { url: `/media/uploads/${filename}`, filename, size: buffer.length, mimetype: req.file.mimetype },
    });
  } catch {
    res.status(400).json({ success: false, message: 'Görsel işlenemedi; dosya bozuk olabilir.' });
  }
}

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Ad Soyad en az 2 karakter olmalıdır.'),
  username: z.string().trim().min(3, 'Kullanıcı adı en az 3 karakter olmalıdır.'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export async function adminUpdateProfile(req: AuthenticatedAdminRequest, res: Response): Promise<void> {
  const parseResult = updateProfileSchema.safeParse(req.body);
  if (parseResult.success && req.adminUser) {
    const { name, username, currentPassword, newPassword } = parseResult.data;
    const db = getDatabase();

    // Kullanıcı adı başka bir kullanıcıda var mı kontrol et
    const existingOther = db
      .prepare(`SELECT id FROM admin_users WHERE username = ? AND id != ?`)
      .get(username, req.adminUser.id) as { id: number } | undefined;

    if (existingOther) {
      res.status(400).json({ success: false, message: 'Bu kullanıcı adı başka bir yönetici tarafından kullanılıyor.' });
      return;
    }

    // Şifre değişikliği talebi varsa
    if (newPassword && newPassword.trim().length > 0) {
      if (!currentPassword) {
        res.status(400).json({ success: false, message: 'Şifrenizi değiştirmek için mevcut şifrenizi girmelisiniz.' });
        return;
      }
      if (newPassword.trim().length < 6) {
        res.status(400).json({ success: false, message: 'Yeni şifre en az 6 karakter olmalıdır.' });
        return;
      }

      // Mevcut şifreyi doğrula
      const currentUser = db
        .prepare(`SELECT password_hash, salt FROM admin_users WHERE id = ?`)
        .get(req.adminUser.id) as { password_hash: string; salt: string } | undefined;

      if (!currentUser || !verifyPassword(currentPassword, currentUser.password_hash, currentUser.salt)) {
        res.status(400).json({ success: false, message: 'Mevcut şifreniz hatalı.' });
        return;
      }

      const { hash, salt } = hashPassword(newPassword.trim());
      db.prepare(`
        UPDATE admin_users
        SET name = ?, username = ?, password_hash = ?, salt = ?
        WHERE id = ?
      `).run(name, username, hash, salt, req.adminUser.id);
    } else {
      // Yalnızca isim ve kullanıcı adı güncelle
      db.prepare(`
        UPDATE admin_users
        SET name = ?, username = ?
        WHERE id = ?
      `).run(name, username, req.adminUser.id);
    }

    res.json({
      success: true,
      message: 'Profil bilgileri başarıyla güncellendi.',
      data: {
        id: req.adminUser.id,
        username,
        name,
        role: req.adminUser.role,
      },
    });
    return;
  }

  res.status(400).json({
    success: false,
    message: parseResult.error ? parseResult.error.errors[0]?.message : 'Geçersiz profil verileri.',
  });
}

