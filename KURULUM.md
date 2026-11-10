# Acar Grup — Kurulum, Admin Paneli ve Yayına Alma Rehberi

## 1. Bilgisayarınızda çalıştırma (yeni başlayanlar için)

1. **Node.js 20 veya üstünü** https://nodejs.org adresinden kurun.
2. Proje klasöründe terminal açın ve sırayla çalıştırın:
   ```bash
   cp .env.example .env        # ayar dosyasını oluşturur
   npm install                 # kök klasör
   npm --prefix server install
   npm --prefix client install
   ```
3. `.env` dosyasını açın ve **`ADMIN_PASSWORD=`** satırına kendi güçlü şifrenizi yazın.
   Boş bırakırsanız ilk açılışta rastgele bir şifre üretilir ve terminalde görünür.
4. Başlatın:
   ```bash
   npm run dev
   ```
5. Site: http://localhost:5173 — Admin paneli: http://localhost:5173/admin

## 2. İlk admin kullanıcısı ve şifre değiştirme

- İlk kullanıcı, **veritabanında hiç yönetici yokken** ilk açılışta `.env` içindeki
  `ADMIN_USERNAME` / `ADMIN_PASSWORD` ile oluşturulur. Şifre **scrypt** ile hash'lenerek saklanır; düz metin tutulmaz.
- Şifre/kullanıcı adı değiştirmek için: panelde **Profil & Şifre** sayfası (sağ üstteki avatar).
- Şifreyi unuttuysanız: `server/data/acargrup.sqlite` dosyasını silmeyin! Bunun yerine bize başvurun ya da
  `admin_users` tablosundaki satırı silip sunucuyu yeniden başlatın (`.env`'deki şifreyle yeniden oluşur;
  içerikler `site_settings` tablosunda kalır).

## 3. Panel nasıl kullanılır

- **Sayfa İçerikleri** (`/admin/icerikler`): Üstteki sekmelerden bölümü seçin, metni değiştirin.
  - **Kaydet**'e basınca önce *eski / yeni karşılaştırması* çıkar; "Onayla ve Yayınla" deyince site güncellenir.
  - Her alanın yanındaki **↺ Geçmiş** ile son 20 sürüm görünür, "Bu sürüme dön" ile geri alınır.
- **Fotoğraf**: Alanın yanındaki **Fotoğrafı Değiştir** ile bilgisayarınızdan seçin.
  Sadece JPG / PNG / WebP, en fazla 5 MB. Fotoğraf otomatik olarak en fazla 1920 px'e küçültülür,
  WebP'ye çevrilir ve konum (EXIF) bilgisi temizlenir. Eski fotoğraf **silinmez**,
  `client/public/media/uploads/_backup/` klasörüne taşınır (geri alınca otomatik yerine döner).

## 4. Güvenlik özeti

| Önlem | Nasıl |
|---|---|
| Giriş | Kullanıcı adı + şifre, süreli oturum, çıkış butonu, giriş yapmayan panele giremez |
| Şifre | scrypt + rastgele salt |
| CSRF | Oturum anahtarı çerezde değil `Authorization` başlığında; ayrıca tüm değiştirici isteklerde `X-Requested-With` başlığı zorunlu |
| XSS | Sunucuda metinlerden HTML etiketleri temizlenir; React çıktıyı kaçışlar |
| Dosya yükleme | Uzantı + **gerçek dosya içeriği (magic bytes)** kontrolü, boyut sınırı, SVG yasak |
| Gizli bilgiler | `.env` dosyasında (git'e eklenmemeli) |

## 5. Yayına alırken (cPanel paylaşımlı hosting)

> **Önemli:** Bu site bir Node.js sunucusu (Express + SQLite) gerektirir. Her cPanel hosting bunu desteklemez.
> Hosting panelinizde **"Setup Node.js App"** (CloudLinux Node.js Selector) bölümü var mı kontrol edin.
> Yoksa bu panel çalışmaz; küçük bir VPS (ör. Hetzner, DigitalOcean) önerilir.

Node.js App varsa:

1. Bilgisayarınızda `npm --prefix client run build` çalıştırın → `client/dist` oluşur.
2. `server/` klasörünü ve `client/dist` klasörünü hosting'e yükleyin. `node_modules` yüklemeyin.
3. cPanel → **Setup Node.js App**: Node 20+, uygulama kökü `server`, başlangıç dosyası `start.cjs`.
4. Panelde **NPM Install** düğmesine basın (`better-sqlite3` ve `sharp` derlenir/indirilir).
5. Ortam değişkenlerini panelden girin: `NODE_ENV=production`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`,
   `CORS_ORIGIN=https://siteniz.com`, `DATABASE_PATH`.
6. Siteyi HTTPS (SSL) ile yayınlayın; `CORS_ORIGIN` ve `VITE_SITE_URL` adreslerini gerçek alan adınızla güncelleyin.
7. **Yedek:** `server/data/acargrup.sqlite` ve `client/public/media/uploads/` klasörlerini düzenli indirin.
   Tüm içerik, geçmiş ve fotoğraflar bunlardadır.
8. İlk girişten sonra Profil sayfasından şifrenizi değiştirin; `.env` dosyasını asla paylaşmayın.

