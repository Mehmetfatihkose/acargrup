import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';
import { runSeed } from './seed/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.resolve(serverRoot, '.env') });
dotenv.config({ path: path.resolve(serverRoot, '../.env') });

const app = express();
app.set('trust proxy', 1);
const PORT = Number(process.env.PORT || 4000);

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://127.0.0.1:5173', 'http://localhost:4173');
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        mediaSrc: ["'self'", 'blob:'],
        connectSrc: ["'self'"],
        workerSrc: ["'self'", 'blob:'],
        objectSrc: ["'none'"],
        frameSrc: ['https://www.google.com', 'https://maps.google.com'],
      },
    },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Sunucu içi istekler (origin yok) veya izin verilen frontend adresleri
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new AppError('CORS politikası gereği bu kaynaktan erişime izin verilmiyor.', 403));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })
);

app.use(compression());
app.use(express.json({ limit: '250kb' }));
app.use(express.urlencoded({ extended: true, limit: '250kb' }));

// Yüklenen görseller için statik dizin
app.use('/uploads', express.static(path.resolve(serverRoot, process.env.UPLOAD_DIR || './uploads')));

// API Rotaları
app.use('/api', apiRoutes);

// Tanımsız API rotaları
app.use('/api/*', (_req, _res, next) => {
  next(new AppError('İstenen API uç noktası bulunamadı.', 404));
});

// Üretim: Derlenmiş siteyi (client/dist) ve panelden yüklenen fotoğrafları aynı sunucudan yayınla
if (process.env.NODE_ENV === 'production') {
  const clientRoot = path.resolve(serverRoot, '../client');
  const distDir = path.resolve(clientRoot, 'dist');
  app.use('/media/uploads', express.static(path.resolve(clientRoot, 'public/media/uploads'), { maxAge: '7d' }));
  app.use(express.static(distDir, { maxAge: '1h', index: false }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Merkezi Hata Yakalayıcı
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Acar Grup API] Sunucu http://127.0.0.1:${PORT} adresinde çalışıyor.`);
  try {
    runSeed(false);
  } catch (err) {
    console.error('[Acar Grup DB Seed Hatası]:', err);
  }
});

export default app;
