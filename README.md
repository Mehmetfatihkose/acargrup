# Acar Grup — Kurumsal Portföy Web Sitesi

**1974'ten Beri · 50 Yıllık Güven** — Demiryolu, köprü, tünel ve altyapı mühendisliği ile endüstriyel plastik hammadde (PE, PP, PVC, PET, ABS) tedarikinde faaliyet gösteren **Acar Grup Holding A.Ş.** için tasarlanmış tam kapsamlı kurumsal portföy uygulaması.

---

## 1. Teknoloji Yığını

### Frontend (`/client`)
- **React 19 + TypeScript + Vite 6**
- **Tailwind CSS v4** + Marka CSS Değişkenleri (`--navy`, `--orange`, `--gray` ve türevleri)
- **GSAP + ScrollTrigger** & **Lenis** (senkronize smooth scroll, pinned yatay galeri, ray metaforlu zaman çizelgesi)
- **Framer Motion** (`layoutId` sekme ve paylaşımlı kart geçişleri, `AnimatePresence`, çok adımlı form)
- **Three.js + `@react-three/fiber` + `@react-three/drei`** (yalnızca masaüstü Hero bölümünde görünürken tembel yüklenen kıvılcım parçacıkları)
- **TanStack Query**, **React Hook Form + Zod**, **Lottie (`lottie-react`)**, **`react-helmet-async`**

### Backend (`/server`)
- **Node.js + Express + TypeScript**
- **SQLite3 (`better-sqlite3`)** — WAL modu, 9 ilişkisel tablo ve gerçekçi Türkçe seed verileri
- **Güvenlik & Performans:** `zod` doğrulama, `helmet`, `cors` (sadece frontend kaynağı), `express-rate-limit` (formlarda dakikada 5 istek), `compression`, Honeypot spam koruması, `multer`, opsiyonel `nodemailer`

---

## 2. Hızlı Kurulum ve Çalıştırma

### Adım 1 — Bağımlılıkları Yükleyin
Kök dizinde tek komutla tüm paketleri (root + server + client) kurun:
```bash
npm run install:all
```
*(Alternatif olarak sırasıyla `npm install`, `cd server && npm install`, `cd ../client && npm install` çalıştırabilirsiniz.)*

### Adım 2 — Ortam Değişkenlerini Yapılandırın
```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### Adım 3 — Veritabanını Örnek Türkçe Verilerle Doldurun (Seed)
```bash
npm run seed
```
Bu komut `server/data/acargrup.sqlite` veritabanını oluşturur ve **10 proje, 5 polimer ürün grubu, 9 dönüm noktası, 5 haber, 4 sertifika ve 4 istatistik** verisiyle doldurur.

### Adım 4 — Tek Komutla Çalıştırın (Backend + Frontend)
```bash
npm run dev
```
- **Frontend (Vite):** `http://localhost:5173`
- **Backend API (Express):** `http://localhost:4000/api`

### Üretim Derlemesi ve Tür Kontrolü
```bash
npm run typecheck
npm run build
```

---

## 3. API Uç Noktaları

| Metot | Uç Nokta | Açıklama |
|---|---|---|
| `GET` | `/api/projects` | Tüm projeler (`?category=Demiryolu&search=...` destekli) |
| `GET` | `/api/projects/:slug` | Proje detayı, görsel galerisi ve benzer projeler |
| `GET` | `/api/products` | Plastik hammadde ürün grupları (PE, PP, PVC, PET, ABS) |
| `GET` | `/api/products/:slug` | Tekil hammadde detayı ve teknik özellikleri |
| `GET` | `/api/milestones` | 1974–2026 arası 50 yıllık dönüm noktaları |
| `GET` | `/api/news` | Kurumsal haberler ve duyurular |
| `GET` | `/api/news/:slug` | Tekil haber detayı |
| `GET` | `/api/stats` | Kurumsal istatistik sayaç verileri |
| `GET` | `/api/certificates` | ISO 9001, 14001, 45001 ve müteahhitlik yetki belgeleri |
| `POST` | `/api/contact` | İletişim formu kaydı (Zod + Honeypot + 5 istek/dk limit) |
| `POST` | `/api/quote` | Çok adımlı hammadde teklif talebi kaydı |

---

## 4. Erişilebilirlik, Performans ve Reduced Motion
- `prefers-reduced-motion: reduce` etkin olduğunda Lenis smooth scroll, Three.js parçacıkları, özel imleç, 3D tilt, manyetik çekim ve scrub parallax otomatik olarak kapanır; tüm içerik anında erişilebilir kalır.
- Mobil cihazlarda (`< 768px`) Three.js, pinned yatay galeri, özel imleç ve ağır video devre dışı bırakılarak 60fps akıcılık korunur.
- Tüm görseller `AVIF` + duyarlı `WebP srcset` (`640w`, `1440w`) ile sunulur.

