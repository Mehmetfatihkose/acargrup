import { Router } from 'express';
import {
  adminLogin,
  adminLogout,
  adminGetMe,
  adminGetDashboardStats,
  adminGetQuotes,
  adminUpdateQuoteStatus,
  adminDeleteQuote,
  adminGetMessages,
  adminToggleMessageRead,
  adminDeleteMessage,
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetNews,
  adminCreateNews,
  adminUpdateNews,
  adminDeleteNews,
  adminGetMilestones,
  adminCreateMilestone,
  adminUpdateMilestone,
  adminDeleteMilestone,
  adminGetCertificates,
  adminCreateCertificate,
  adminUpdateCertificate,
  adminDeleteCertificate,
  adminGetStats,
  adminCreateStat,
  adminUpdateStat,
  adminDeleteStat,
  adminGetSettings,
  adminUpdateSettings,
  adminGetSettingHistory,
  adminRestoreSetting,
  adminGetMedia,
  adminUploadMedia,
  adminUpdateProfile,
  upload,
} from '../controllers/adminController.js';
import { requireAdminAuth } from '../middleware/adminAuth.js';
import { formRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * CSRF koruması: Oturum anahtarı çerezde değil Authorization başlığında taşınır
 * (tarayıcı otomatik göndermez). Buna ek olarak değiştirici isteklerde özel bir başlık zorunludur;
 * başka bir sitedeki form/istek bu başlığı CORS izni olmadan ekleyemez.
 */
router.use((req, res, next) => {
  const safe = req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS';
  if (safe || req.header('X-Requested-With') === 'AcarAdminPanel') {
    next();
    return;
  }
  res.status(403).json({ success: false, message: 'Geçersiz istek kaynağı (CSRF doğrulaması başarısız).' });
});

// Kimlik Doğrulama
router.post('/login', formRateLimiter, adminLogin);
router.post('/logout', requireAdminAuth, adminLogout);
router.get('/me', requireAdminAuth, adminGetMe);
router.put('/profile', requireAdminAuth, adminUpdateProfile);

// Dashboard İstatistikleri
router.get('/dashboard', requireAdminAuth, adminGetDashboardStats);

// Fiyat Teklifi Talepleri
router.get('/quotes', requireAdminAuth, adminGetQuotes);
router.patch('/quotes/:id/status', requireAdminAuth, adminUpdateQuoteStatus);
router.delete('/quotes/:id', requireAdminAuth, adminDeleteQuote);

// İletişim Mesajları
router.get('/messages', requireAdminAuth, adminGetMessages);
router.patch('/messages/:id/read', requireAdminAuth, adminToggleMessageRead);
router.delete('/messages/:id', requireAdminAuth, adminDeleteMessage);

// Projeler CRUD
router.get('/projects', requireAdminAuth, adminGetProjects);
router.post('/projects', requireAdminAuth, adminCreateProject);
router.put('/projects/:id', requireAdminAuth, adminUpdateProject);
router.delete('/projects/:id', requireAdminAuth, adminDeleteProject);

// Plastik Ürünler CRUD
router.get('/products', requireAdminAuth, adminGetProducts);
router.post('/products', requireAdminAuth, adminCreateProduct);
router.put('/products/:id', requireAdminAuth, adminUpdateProduct);
router.delete('/products/:id', requireAdminAuth, adminDeleteProduct);

// Haberler CRUD
router.get('/news', requireAdminAuth, adminGetNews);
router.post('/news', requireAdminAuth, adminCreateNews);
router.put('/news/:id', requireAdminAuth, adminUpdateNews);
router.delete('/news/:id', requireAdminAuth, adminDeleteNews);

// Dönüm Noktaları / Tarihçe CRUD
router.get('/milestones', requireAdminAuth, adminGetMilestones);
router.post('/milestones', requireAdminAuth, adminCreateMilestone);
router.put('/milestones/:id', requireAdminAuth, adminUpdateMilestone);
router.delete('/milestones/:id', requireAdminAuth, adminDeleteMilestone);

// Sertifikalar & Belgeler CRUD
router.get('/certificates', requireAdminAuth, adminGetCertificates);
router.post('/certificates', requireAdminAuth, adminCreateCertificate);
router.put('/certificates/:id', requireAdminAuth, adminUpdateCertificate);
router.delete('/certificates/:id', requireAdminAuth, adminDeleteCertificate);

// Sayaç İstatistikleri CRUD
router.get('/stats', requireAdminAuth, adminGetStats);
router.post('/stats', requireAdminAuth, adminCreateStat);
router.put('/stats/:id', requireAdminAuth, adminUpdateStat);
router.delete('/stats/:id', requireAdminAuth, adminDeleteStat);

// Site Ayarları & İçerik Metinleri (CMS)
router.get('/settings', requireAdminAuth, adminGetSettings);
router.put('/settings', requireAdminAuth, adminUpdateSettings);
router.get('/settings/history', requireAdminAuth, adminGetSettingHistory);
router.post('/settings/restore', requireAdminAuth, adminRestoreSetting);

// Medya Kütüphanesi & Yükleme
router.get('/media', requireAdminAuth, adminGetMedia);
router.post('/upload', requireAdminAuth, upload.single('file'), adminUploadMedia);

export default router;

