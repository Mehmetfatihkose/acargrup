import type { Request, Response, NextFunction } from 'express';
import db from '../db/connection.js';
import { contactSchema, quoteSchema } from '../validators/schemas.js';
import { sendOptionalMail } from '../middleware/mailer.js';

export async function submitContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = contactSchema.parse(req.body);

    // Honeypot spam kontrolü: botlar gizli "website" alanını doldurursa sessizce başarılı dön
    if (parsed.website && parsed.website.trim().length > 0) {
      res.status(200).json({
        success: true,
        message: 'Mesajınız alındı.',
      });
      return;
    }

    const stmt = db.prepare(`
      INSERT INTO contact_messages (name, email, phone, company, subject, message)
      VALUES (@name, @email, @phone, @company, @subject, @message)
    `);

    const info = stmt.run({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      company: parsed.company || '',
      subject: parsed.subject,
      message: parsed.message,
    });

    await sendOptionalMail({
      subject: `[Acar Grup İletişim] ${parsed.subject} — ${parsed.name}`,
      text: `Ad Soyad: ${parsed.name}\nFirma: ${parsed.company || '-'}\nE-Posta: ${parsed.email}\nTelefon: ${parsed.phone}\nKonu: ${parsed.subject}\n\nMesaj:\n${parsed.message}`,
    });

    res.status(201).json({
      success: true,
      id: Number(info.lastInsertRowid),
      message:
        'Mesajınız başarıyla kaydedildi. Kurumsal iletişim ekibimiz en kısa sürede tarafınıza dönüş sağlayacaktır.',
    });
  } catch (err) {
    next(err);
  }
}

export async function submitQuote(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = quoteSchema.parse(req.body);

    // Honeypot spam kontrolü
    if (parsed.website && parsed.website.trim().length > 0) {
      res.status(200).json({
        success: true,
        message: 'Talebiniz alındı.',
      });
      return;
    }

    let validProductId: number | null = null;
    let productName = 'Genel / Özel Talep';

    if (parsed.product_id) {
      const product = db
        .prepare('SELECT id, name FROM products WHERE id = ?')
        .get(parsed.product_id) as { id: number; name: string } | undefined;
      if (product) {
        validProductId = product.id;
        productName = product.name;
      }
    }

    const stmt = db.prepare(`
      INSERT INTO quote_requests (name, company, email, phone, product_id, quantity, message)
      VALUES (@name, @company, @email, @phone, @product_id, @quantity, @message)
    `);

    const info = stmt.run({
      name: parsed.name,
      company: parsed.company,
      email: parsed.email,
      phone: parsed.phone,
      product_id: validProductId,
      quantity: parsed.quantity,
      message: parsed.message || '',
    });

    await sendOptionalMail({
      subject: `[Acar Grup Teklif Talebi] ${parsed.company} — ${productName}`,
      text: `Yetkili: ${parsed.name}\nFirma: ${parsed.company}\nE-Posta: ${parsed.email}\nTelefon: ${parsed.phone}\nÜrün: ${productName}\nMiktar: ${parsed.quantity}\n\nNotlar:\n${parsed.message || '-'}`,
    });

    res.status(201).json({
      success: true,
      id: Number(info.lastInsertRowid),
      message:
        'Fiyat teklifi talebiniz başarıyla alındı. Satış mühendislerimiz 24 saat içerisinde kurumsal teklifinizi iletecektir.',
    });
  } catch (err) {
    next(err);
  }
}

