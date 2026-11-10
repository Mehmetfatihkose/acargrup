import nodemailer from 'nodemailer';

interface NotificationPayload {
  subject: string;
  text: string;
}

/**
 * Opsiyonel Nodemailer E-Posta Bildirimi.
 * SMTP ayarları tanımlı değilse hata fırlatmaz, güvenli şekilde konsola bilgi yazar.
 */
export async function sendOptionalMail({ subject, text }: NotificationPayload): Promise<void> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !user || !pass) {
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'Acar Grup Kurumsal <kurumsal@acargrup.com.tr>',
      to: process.env.MAIL_TO || 'iletisim@acargrup.com.tr',
      subject,
      text,
    });
  } catch (err) {
    console.warn('[Nodemailer Uyarı] E-posta gönderilemedi (kayıt veritabanına alındı):', err);
  }
}

