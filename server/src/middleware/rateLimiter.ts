import rateLimit from 'express-rate-limit';

/**
 * Form gönderimleri için hız sınırı: dakikada en fazla 5 istek
 */
export const formRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => req.ip || '127.0.0.1',
  message: {
    success: false,
    message:
      'Çok fazla form isteği gönderdiniz. Güvenlik nedeniyle lütfen 1 dakika bekleyip tekrar deneyiniz.',
  },
});

/**
 * Genel okuma API uçları için hız sınırı
 */
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 240,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  keyGenerator: (req) => req.ip || '127.0.0.1',
  message: {
    success: false,
    message: 'İstek sınırı aşıldı. Lütfen kısa bir süre sonra tekrar deneyiniz.',
  },
});
