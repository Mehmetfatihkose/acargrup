import { Router } from 'express';
import { getProjects, getProjectBySlug } from '../controllers/projectsController.js';
import { getProducts, getProductBySlug } from '../controllers/productsController.js';
import {
  getMilestones,
  getNews,
  getNewsBySlug,
  getStats,
  getCertificates,
} from '../controllers/contentController.js';
import { submitContact, submitQuote } from '../controllers/formsController.js';
import { getPublicSettings } from '../controllers/adminController.js';
import { apiRateLimiter, formRateLimiter } from '../middleware/rateLimiter.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, service: 'Acar Grup API', status: 'ok' });
});

// Yönetim Paneli Uçları
router.use('/admin', adminRoutes);

// Okuma Uçları
router.get('/settings', apiRateLimiter, getPublicSettings);
router.get('/projects', apiRateLimiter, getProjects);
router.get('/projects/:slug', apiRateLimiter, getProjectBySlug);
router.get('/products', apiRateLimiter, getProducts);
router.get('/products/:slug', apiRateLimiter, getProductBySlug);
router.get('/milestones', apiRateLimiter, getMilestones);
router.get('/news', apiRateLimiter, getNews);
router.get('/news/:slug', apiRateLimiter, getNewsBySlug);
router.get('/stats', apiRateLimiter, getStats);
router.get('/certificates', apiRateLimiter, getCertificates);

// Form Gönderim Uçları (Dakikada maks 5 istek + Zod + Honeypot)
router.post('/contact', formRateLimiter, submitContact);
router.post('/quote', formRateLimiter, submitQuote);

export default router;

