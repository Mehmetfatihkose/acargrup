import { z } from 'zod';

/**
 * İletişim Formu Doğrulama Şeması (Türkçe hata mesajları + Honeypot)
 */
export const contactSchema = z.object({
  name: z
    .string({ required_error: 'Ad Soyad alanı zorunludur.' })
    .trim()
    .min(2, 'Ad Soyad en az 2 karakter olmalıdır.')
    .max(120, 'Ad Soyad en fazla 120 karakter olabilir.'),
  email: z
    .string({ required_error: 'E-posta adresi zorunludur.' })
    .trim()
    .email('Lütfen geçerli bir kurumsal veya bireysel e-posta adresi giriniz.')
    .max(160, 'E-posta adresi çok uzun.'),
  phone: z
    .string({ required_error: 'Telefon numarası zorunludur.' })
    .trim()
    .min(10, 'Lütfen geçerli bir telefon numarası giriniz (en az 10 hane).')
    .max(30, 'Telefon numarası en fazla 30 karakter olabilir.'),
  company: z
    .string()
    .trim()
    .max(150, 'Firma adı en fazla 150 karakter olabilir.')
    .optional()
    .default(''),
  subject: z
    .string({ required_error: 'Konu alanı zorunludur.' })
    .trim()
    .min(3, 'Konu başlığı en az 3 karakter olmalıdır.')
    .max(160, 'Konu başlığı en fazla 160 karakter olabilir.'),
  message: z
    .string({ required_error: 'Mesaj alanı zorunludur.' })
    .trim()
    .min(10, 'Mesajınız en az 10 karakter olmalıdır.')
    .max(3000, 'Mesajınız en fazla 3000 karakter olabilir.'),
  // Honeypot spam koruması alanı (normal kullanıcılar boş bırakır)
  website: z.string().optional().default(''),
});

/**
 * Plastik Hammadde / İnşaat Teklif Talebi Doğrulama Şeması
 */
export const quoteSchema = z.object({
  name: z
    .string({ required_error: 'Yetkili Ad Soyad alanı zorunludur.' })
    .trim()
    .min(2, 'Yetkili adı en az 2 karakter olmalıdır.')
    .max(120, 'Yetkili adı en fazla 120 karakter olabilir.'),
  company: z
    .string({ required_error: 'Firma ünvanı zorunludur.' })
    .trim()
    .min(2, 'Firma ünvanı en az 2 karakter olmalıdır.')
    .max(180, 'Firma ünvanı en fazla 180 karakter olabilir.'),
  email: z
    .string({ required_error: 'Kurumsal e-posta adresi zorunludur.' })
    .trim()
    .email('Lütfen geçerli bir e-posta adresi giriniz.')
    .max(160, 'E-posta adresi çok uzun.'),
  phone: z
    .string({ required_error: 'Telefon numarası zorunludur.' })
    .trim()
    .min(10, 'Lütfen geçerli bir telefon numarası giriniz.')
    .max(30, 'Telefon numarası çok uzun.'),
  product_id: z
    .union([z.number().int().positive(), z.string().regex(/^\d+$/).transform(Number), z.null()])
    .optional()
    .nullable()
    .default(null),
  quantity: z
    .string({ required_error: 'Talep edilen miktar / tonaj bilgisi zorunludur.' })
    .trim()
    .min(1, 'Lütfen talep edilen miktar veya tonaj aralığını belirtiniz.')
    .max(120, 'Miktar bilgisi en fazla 120 karakter olabilir.'),
  message: z
    .string()
    .trim()
    .max(3000, 'Ek teknik notlar en fazla 3000 karakter olabilir.')
    .optional()
    .default(''),
  // Honeypot spam koruması alanı
  website: z.string().optional().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;

