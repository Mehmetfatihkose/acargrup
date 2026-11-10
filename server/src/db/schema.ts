import Database from 'better-sqlite3';
import crypto from 'node:crypto';

/**
 * Acar Grup SQLite3 Veritabanı Şeması
 * Tüm tablolar ve indeksler oluşturulur.
 */
export function initializeSchema(db: Database.Database): void {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      sector TEXT NOT NULL DEFAULT 'İnşaat',
      location TEXT NOT NULL,
      year INTEGER NOT NULL,
      client TEXT NOT NULL,
      description TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      budget_range TEXT NOT NULL,
      duration TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
    CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

    CREATE TABLE IF NOT EXISTS project_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      specs_json TEXT NOT NULL,
      packaging TEXT NOT NULL,
      image TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

    CREATE TABLE IF NOT EXISTS milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_milestones_year ON milestones(year);

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT NOT NULL,
      published_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);

    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      value INTEGER NOT NULL,
      suffix TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT DEFAULT '',
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quote_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      product_id INTEGER,
      quantity TEXT NOT NULL,
      message TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'beklemede',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      group_name TEXT NOT NULL,
      label TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'text'
    );
  `);

  // Kolon göç kontrolleri (eski SQLite tabloları için)
  try {
    const messageColumns = db.prepare(`PRAGMA table_info(contact_messages)`).all() as { name: string }[];
    if (!messageColumns.some((col) => col.name === 'is_read')) {
      db.exec(`ALTER TABLE contact_messages ADD COLUMN is_read INTEGER NOT NULL DEFAULT 0;`);
    }
  } catch {
    // Tablo henüz yeni oluşturuldu
  }

  try {
    const quoteColumns = db.prepare(`PRAGMA table_info(quote_requests)`).all() as { name: string }[];
    if (!quoteColumns.some((col) => col.name === 'status')) {
      db.exec(`ALTER TABLE quote_requests ADD COLUMN status TEXT NOT NULL DEFAULT 'beklemede';`);
    }
  } catch {
    // Tablo henüz yeni oluşturuldu
  }

  // Varsayılan Site Ayarları & İçerik Metinleri Kontrolü
  try {
    const countSettings = (db.prepare(`SELECT COUNT(*) as count FROM site_settings`).get() as { count: number }).count;
    if (countSettings === 0) {
      const insertSetting = db.prepare(`
        INSERT INTO site_settings (key, value, group_name, label, type)
        VALUES (?, ?, ?, ?, ?)
      `);

      const defaultSettings = [
        // Anasayfa Hero
        ['hero_headline_left_top', 'Geleceğin', 'hero', 'Sol Kanat Başlık 1. Satır', 'text'],
        ['hero_headline_left_sub', 'Hatlarını', 'hero', 'Sol Kanat Başlık 2. Satır', 'text'],
        ['hero_headline_left_orange', 'Döşüyoruz.', 'hero', 'Sol Kanat Vurgulu Kelime', 'text'],
        ['hero_desc_left', '1974\'ten bu yana yüksek hızlı tren hatları, derin kaya tünelleri ve öngerilmeli viyadüklerle Türkiye\'nin en zorlu coğrafyalarında kalıcı mühendislik eserleri inşa ediyoruz.', 'hero', 'Sol Kanat Açıklama Metni', 'textarea'],
        ['hero_metric1_val', '2.450+', 'hero', 'Sol Kanat Metrik 1 Değeri', 'text'],
        ['hero_metric1_lbl', 'Km Demiryolu', 'hero', 'Sol Kanat Metrik 1 Etiketi', 'text'],
        ['hero_metric2_val', '48+', 'hero', 'Sol Kanat Metrik 2 Değeri', 'text'],
        ['hero_metric2_lbl', 'Köprü & Viyadük', 'hero', 'Sol Kanat Metrik 2 Etiketi', 'text'],
        ['hero_video_url', '/media/hero-railway.mp4', 'hero', 'Sol Kanat Arka Plan Video URL', 'text'],

        ['hero_headline_right_top', 'Sanayinin', 'hero', 'Sağ Kanat Başlık 1. Satır', 'text'],
        ['hero_headline_right_sub', 'Üretim', 'hero', 'Sağ Kanat Başlık 2. Satır', 'text'],
        ['hero_headline_right_orange', 'Gücüyüz.', 'hero', 'Sağ Kanat Vurgulu Kelime', 'text'],
        ['hero_desc_right', 'PE, PP, PVC, PET ve ABS granül sınıflarında küresel üreticilerden doğrudan ithalat, Gebze intermodal silo altyapısı ve akredite kalite kontrolüyle sanayiye kesintisiz hammadde sağlıyoruz.', 'hero', 'Sağ Kanat Açıklama Metni', 'textarea'],
        ['hero_metric3_val', '320.000+', 'hero', 'Sağ Kanat Metrik 1 Değeri', 'text'],
        ['hero_metric3_lbl', 'Ton / Yıl Tedarik', 'hero', 'Sağ Kanat Metrik 1 Etiketi', 'text'],
        ['hero_metric4_val', '24 Saat', 'hero', 'Sağ Kanat Metrik 2 Değeri', 'text'],
        ['hero_metric4_lbl', 'Hızlı Sevkiyat', 'hero', 'Sağ Kanat Metrik 2 Etiketi', 'text'],
        ['hero_image_right', '/media/plastic-granules.webp', 'hero', 'Sağ Kanat Arka Plan Görseli', 'image'],

        // Yönetim Kurulu Başkanı Mesajı
        ['chairman_name', 'Yük. Müh. Selim Acar', 'chairman', 'Başkan Adı ve Soyadı', 'text'],
        ['chairman_title', 'Yönetim Kurulu Başkanı · Acar Grup Holding A.Ş.', 'chairman', 'Başkan Kurumsal Unvanı', 'text'],
        ['chairman_portrait', '/media/chairman-portrait.webp', 'chairman', 'Başkan Portre Fotoğrafı URL', 'image'],
        ['chairman_quote', '“Bir ülkenin yarınlarına bırakılabilecek en sağlam miras, güvenle döşenmiş hatlar ve kesintisiz üreten fabrikalardır.”', 'chairman', 'Vurgulu Manşet Sözü', 'textarea'],
        ['chairman_letter', 'Değerli İş Ortaklarımız ve Paydaşlarımız,\n\n1974 yılında kurucumuz Kemal Acar’ın Anadolu’daki ilk köprü şantiyesinde yaktığı mühendislik meşalesi, bugün 50 yılı geride bırakmış güçlü bir kurumsal çınara dönüşmüştür. Yarım asır boyunca ekonomik döngüler ve teknolojiler değişirken, Acar Grup’un hiç değişmeyen tek pusulası taahhüt ettiği işi en yüksek mühendislik standartlarında ve zamanında teslim etme sorumluluğu olmuştur.\n\nBugün bir yandan yüksek hızlı demiryolu koridorları, derin tüneller ve anıtsal viyadüklerle şehirlerimizi birbirine bağlarken; diğer yandan Gebze intermodal polimer üssümüzden yüzlerce sanayi kuruluşumuza PE, PP, PVC, PET ve ABS hammadde tedarik ederek üretim çarklarının durmaksızın dönmesine omuz veriyoruz.\n\nÖnümüzdeki yarım yüzyılda da döngüsel polimer ekonomisi, düşük karbonlu yeşil altyapı ve dijital şantiye teknolojilerine yaptığımız yatırımlarla ülkemiz için kalıcı değer üretmeye devam edeceğiz.', 'chairman', 'Başkanın Kurumsal Mektubu', 'textarea'],

        // Kurumsal Vizyon & Değerler
        ['about_group_eyebrow', "ACAR GRUP HAKKINDA · 1974'TEN BERİ", 'values', 'Grup Hakkında Üst Rozet Metni', 'text'],
        ['about_group_title', 'Yarım Asırlık Mühendislik ve Tedarik Disiplini', 'values', 'Grup Hakkında Bölüm Başlığı', 'text'],
        ['about_group_lead1', '1974 yılında kamu altyapı ve köprü taahhütleriyle temelleri atılan Acar Grup, yarım asır boyunca Türkiye\'nin en çetin coğrafyalarında demiryolu hatları, yüksek viyadükler, derin tüneller ve otoyol koridorları inşa ederek mühendislik güveninin simgesi haline gelmiştir.', 'values', 'Grup Hakkında Paragraf 1', 'textarea'],
        ['about_group_lead2', 'Grubumuzun ikinci stratejik sütununu oluşturan plastik hammadde tedarik operasyonlarımız ise, küresel petrokimya devleriyle kurulan doğrudan iş birlikleri ve intermodal silo altyapısıyla binlerce sanayi kuruluşuna kesintisiz üretim gücü sunmaktadır.', 'values', 'Grup Hakkında Paragraf 2', 'textarea'],
        ['about_vision', 'Demiryolu ve yüksek mühendislik altyapısı ile endüstriyel polimer tedarikinde bölgesel ölçekte referans gösterilen, düşük karbonlu ve teknoloji odaklı lider Türk holdingi olmak.', 'values', 'Kurumsal Vizyonumuz', 'textarea'],
        ['about_mission', 'Kamu yararını, iş sağlığı güvenliğini ve mühendislik etiğini her şeyin üzerinde tutarak; ülke ulaşım omurgasını güçlendiren kalıcı eserler üretmek ve sanayicimize kesintisiz hammadde güvencesi sağlamak.', 'values', 'Kurumsal Misyonumuz', 'textarea'],
        ['about_precision', 'Milimetrik ray toleranslarından polimer MFI kararlılığına kadar tüm operasyonlarımızda uluslararası kalite standartlarını tavizsiz uygularız.', 'values', 'Mühendislik Hassasiyeti İlkesi', 'textarea'],
        ['about_heritage', '1974’ten bu yana işveren kurumlarımızla, tedarikçilerimizle ve çalışma arkadaşlarımızla kurduğumuz sözüne sadık kurumsal itibar en değerli sermayemizdir.', 'values', 'Kuşaklararası Güven İlkesi', 'textarea'],

        // İletişim & Lokasyonlar
        ['contact_hq_address', 'Büyükdere Caddesi No: 194, Kat: 18–22, 34394 Levent, Beşiktaş / İstanbul', 'contact', 'Genel Merkez Adresi', 'textarea'],
        ['contact_hq_phone', '+90 (212) 310 19 74', 'contact', 'Genel Merkez Santral Telefonu', 'text'],
        ['contact_hq_email', 'kurumsal@acargrup.com.tr', 'contact', 'Genel Merkez Kurumsal E-Posta', 'text'],
        ['contact_plant_address', 'Gebze Organize Sanayi Bölgesi (GOSB), 1400. Cadde No: 18, 41480 Gebze / Kocaeli', 'contact', 'Gebze Terminali Adresi', 'textarea'],
        ['contact_plant_phone', '+90 (262) 648 19 74', 'contact', 'Gebze Terminali Satış Telefonu', 'text'],
        ['contact_plant_email', 'polimer@acargrup.com.tr', 'contact', 'Gebze Terminali E-Posta', 'text'],

        // CTA
        ['cta_heading', 'Büyük Ölçekli Altyapı ve Kesintisiz Hammadde İçin Güçlerimizi Birleştirelim.', 'cta', 'Alt CTA Ana Başlığı', 'textarea'],
        ['cta_desc', 'Demiryolu, altyapı taahhüt projeleriniz veya yüksek tonajlı polimer hammadde talepleriniz için mühendislik ve satış ekiplerimizle doğrudan iletişime geçin.', 'cta', 'Alt CTA Açıklama Metni', 'textarea'],

        // Faaliyet Alanları Vitrini
        ['sector1_title', 'İnşaat & Raylı Sistemler', 'sectors', 'Sektör 1 Ana Başlık', 'text'],
        ['sector1_headline', 'Türkiye Omurgasını Birleştiren Ağır Mühendislik', 'sectors', 'Sektör 1 Vurgulu Manşet', 'text'],
        ['sector1_desc', 'Yüksek hızlı tren (YHT) hatları, sismik izolasyonlu viyadükler, TBM derin tünelleri ve entegre karayolu koridorlarında 50 yıllık kesintisiz taahhüt tecrübesi.', 'sectors', 'Sektör 1 Tanıtım Metni', 'textarea'],
        ['sector1_image', '/media/hero-railway.webp', 'sectors', 'Sektör 1 Kapak Görseli URL', 'image'],
        ['sector1_metrics', '2.450+ Km Demiryolu Ağı | 48+ Sanat Yapısı | A Grubu Yetki Seviyesi', 'sectors', 'Sektör 1 Göstergeler', 'text'],
        ['sector1_highlights', 'UIC 60 Alüminotermik Ray Kaynağı ve Balastsız Rijit Hat\nDengeli Konsol ve Ard-Germeli Viyadük Teknolojisi\nÇift Tüp TBM ve NATM Yeraltı Altyapı Tünelleri\nERTMS/ETCS Seviye 2 Sinyalizasyon & Elektrifikasyon', 'sectors', 'Sektör 1 Teknik Yetkinlikler (Her Satır Bir Madde)', 'textarea'],

        ['sector2_title', 'Plastik Hammadde & Polimer', 'sectors', 'Sektör 2 Ana Başlık', 'text'],
        ['sector2_headline', 'İmalat Sanayiine Kesintisiz ve Akredite Hammadde', 'sectors', 'Sektör 2 Vurgulu Manşet', 'text'],
        ['sector2_desc', 'Global petrokimya üreticilerinden doğrudan ithalat, Gebze intermodal silo terminali ve laboratuvar onaylı MFI değerleriyle Türkiye sanayiine yıllık 320.000 ton polimer güvencesi.', 'sectors', 'Sektör 2 Tanıtım Metni', 'textarea'],
        ['sector2_image', '/media/plastic-granules.webp', 'sectors', 'Sektör 2 Kapak Görseli URL', 'image'],
        ['sector2_metrics', '320.000 Ton Yıllık Kapasite | 5 Ana Polimer Ailesi | Demiryolu İltisaklı Silo', 'sectors', 'Sektör 2 Göstergeler', 'text'],
        ['sector2_highlights', 'HDPE, LDPE, LLDPE Film ve Şişirmelik Poliolefinler\nPPH, PPC, PPR Enjeksiyon ve Boruluk Homopolimer/Kopolimer\nSüspansiyon PVC (K58–K70) Profil ve Boru Granülleri\nOtomotiv ve Beyaz Eşya Sınıfı Mühendislik ABS & PET', 'sectors', 'Sektör 2 Teknik Yetkinlikler (Her Satır Bir Madde)', 'textarea'],

        // İnşaat Sayfası (/insaat)
        ['construction_intro_text', '1974 yılından bu yana Türkiye’nin en zorlu topoğrafyalarında mühendislik sınırlarını aşan Acar Grup İnşaat Grubu; yüksek hızlı demiryolu hatlarından sismik izolatörlü viyadüklere, TBM derin tünellerden intermodal sanayi yapılarına kadar kalıcı eserler üretmektedir.', 'construction', 'İnşaat Tanıtım Paragrafı', 'textarea'],
        ['construction_before_img', '/media/railway-before.webp', 'construction', 'Önce/Sonra Şantiye Başlangıç Görseli (Before)', 'image'],
        ['construction_after_img', '/media/railway-after.webp', 'construction', 'Önce/Sonra Tamamlanmış Proje Görseli (After)', 'image'],
        ['construction_service1_title', 'Demiryolu & Raylı Sistemler', 'construction', 'Hizmet 1 Başlık', 'text'],
        ['construction_service1_desc', 'Yüksek hızlı tren (YHT) koridorları, balastlı ve rijit (slab-track) üstyapı serimi, UIC 60 alüminotermik ray kaynağı, katener elektrifikasyon ve ERTMS/ETCS sinyalizasyon projeleri.', 'construction', 'Hizmet 1 Açıklama', 'textarea'],
        ['construction_service2_title', 'Köprü & Viyadük Mühendisliği', 'construction', 'Hizmet 2 Başlık', 'text'],
        ['construction_service2_desc', 'Derin vadileri aşan dengeli konsol (balanced cantilever) demiryolu ve otoyol viyadükleri, ardgerme kutu kesitli tabliyeler ve sismik izolatörlü ağır yük köprüleri.', 'construction', 'Hizmet 2 Açıklama', 'textarea'],
        ['construction_service3_title', 'Tünel & Yeraltı Yapıları', 'construction', 'Hizmet 3 Başlık', 'text'],
        ['construction_service3_desc', 'Tam kesit tünel açma makineleri (TBM) ve NATM metodolojisiyle inşa edilen çift tüp demiryolu, otoyol ve basınçlı içme suyu/enerji iletim tünelleri.', 'construction', 'Hizmet 3 Açıklama', 'textarea'],
        ['construction_service4_title', 'Karayolu & Otoyol Koridorları', 'construction', 'Hizmet 4 Başlık', 'text'],
        ['construction_service4_desc', 'Yüksek standartlı bölünmüş yollar, çok katmanlı lojistik kavşaklar, toprak işleri ve ağır taşıt trafiğine dayanıklı polimer modifiye taş mastik asfalt (SMA) kaplamalar.', 'construction', 'Hizmet 4 Açıklama', 'textarea'],
        ['construction_service5_title', 'Altyapı & Su Sanat Yapıları', 'construction', 'Hizmet 5 Başlık', 'text'],
        ['construction_service5_desc', 'Baraj isale hatları, ileri biyolojik içme suyu arıtma tesisleri, yağmur suyu/atık su kolektörleri, istinat ve derin kazı iksa mühendisliği.', 'construction', 'Hizmet 5 Açıklama', 'textarea'],
        ['construction_service6_title', 'Endüstriyel & Kurumsal Üstyapı', 'construction', 'Hizmet 6 Başlık', 'text'],
        ['construction_service6_desc', 'LEED sertifikalı yönetim kuleleri, demiryolu iltisak hatlı intermodal lojistik depolar, fabrika kampüsleri ve yüksek sismik güvenlikli çelik-betonarme yapılar.', 'construction', 'Hizmet 6 Açıklama', 'textarea'],

        // Plastik Hammadde Sayfası (/plastik-hammadde)
        ['plastic_intro_lead', 'Global petrokimya üreticilerinden doğrudan ithalat, Gebze intermodal silo altyapısı ve akredite kalite kontrolüyle sanayiye kesintisiz PE, PP, PVC, PET ve ABS polimer hammadde tedariki.', 'plastic', 'Plastik Sayfası Tanıtım Metni', 'textarea'],
        ['plastic_step1_title', 'Küresel Hammadde Temini', 'plastic', 'Tedarik Adım 1 Başlık', 'text'],
        ['plastic_step1_desc', 'Avrupa, Orta Doğu ve Asya’nın lider petrokimya rafinerileriyle uzun vadeli doğrudan kontratlar üzerinden orijinal (virgin) granül tedariki.', 'plastic', 'Tedarik Adım 1 Açıklama', 'textarea'],
        ['plastic_step2_title', 'Akredite Kalite Kontrol', 'plastic', 'Tedarik Adım 2 Başlık', 'text'],
        ['plastic_step2_desc', 'Her parti (lot) için ISO 1133 MFI, yoğunluk, nem ve mekanik mukavemet analizleri ile CoA (Analiz Sertifikası) doğrulaması.', 'plastic', 'Tedarik Adım 2 Açıklama', 'textarea'],
        ['plastic_step3_title', 'İntermodal Silo Depolama', 'plastic', 'Tedarik Adım 3 Başlık', 'text'],
        ['plastic_step3_desc', 'Gebze OSB’deki 65.000 m² kapalı tesisimizde nemden ve kontaminasyondan izole 24 paslanmaz alüminyum silo ve stok yönetimi.', 'plastic', 'Tedarik Adım 3 Açıklama', 'textarea'],
        ['plastic_step4_title', '24 Saatte Kesintisiz Sevkiyat', 'plastic', 'Tedarik Adım 4 Başlık', 'text'],
        ['plastic_step4_desc', '25 kg FFS torba, BigBag veya pnömatik silobas filosuyla Türkiye’nin tüm organize sanayi bölgelerine tam zamanında teslimat.', 'plastic', 'Tedarik Adım 4 Açıklama', 'textarea'],
        ['plastic_sustainability_title', 'Geri Dönüştürülmüş rPET ve rHDPE ile Düşük Karbon Ayak İzi', 'plastic', 'Sürdürülebilirlik Başlığı', 'text'],
        ['plastic_sustainability_desc', 'Avrupa Gıda Güvenliği Otoritesi (EFSA) ve FDA standartlarına uygun mekanik ve kimyasal geri kazanımlı granül portföyümüzle, ambalaj ve otomotiv üreticilerinin yeşil dönüşüm hedeflerine doğrudan katkı sağlıyoruz.', 'plastic', 'Sürdürülebilirlik Açıklaması', 'textarea'],

        // Footer & Sosyal Ağlar
        ['footer_lead', 'Yarım asrı aşan mühendislik mirasıyla demiryolu, altyapı ve üstyapı inşaatında; küresel tedarik gücüyle endüstriyel plastik hammaddede Türkiye\'nin güvenilir iş ortağı.', 'footer', 'Footer Kurumsal Özet Metni', 'textarea'],
        ['footer_copyright', '© 2026 Acar Grup Holding A.Ş. Tüm hakları saklıdır.', 'footer', 'Telif Hakkı Metni', 'text'],
        ['social_linkedin', 'https://www.linkedin.com', 'footer', 'LinkedIn Profil Bağlantısı', 'text'],
        ['social_youtube', 'https://www.youtube.com', 'footer', 'YouTube Kanal Bağlantısı', 'text'],
        ['social_x', 'https://x.com', 'footer', 'X (Twitter) Profil Bağlantısı', 'text'],
        ['social_instagram', 'https://www.instagram.com', 'footer', 'Instagram Profil Bağlantısı', 'text'],

        // Yasal Metinler
        ['legal_kvkk_title', '6698 Sayılı KVKK Aydınlatma Metni', 'legal', 'KVKK Başlığı', 'text'],
        ['legal_kvkk_text', '6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel verileriniz; veri sorumlusu sıfatıyla Büyükdere Caddesi No: 194 Acar Kule Levent, Beşiktaş / İstanbul adresinde mukim Acar Grup Holding A.Ş. (“Acar Grup”) tarafından kanuna uygun şekilde işlenmektedir.\n\nİletişim ve fiyat teklifi formlarımız aracılığıyla paylaştığınız kimlik, kurumsal iletişim, firma ünvanı ve talep bilgileriniz; mühendislik/ihale süreçlerinin yürütülmesi, plastik hammadde satış tekliflerinin hazırlanması ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.', 'legal', 'KVKK Aydınlatma Metni', 'textarea'],
        ['legal_privacy_title', 'Gizlilik Politikası', 'legal', 'Gizlilik Başlığı', 'text'],
        ['legal_privacy_text', 'Acar Grup Holding A.Ş., kurumsal web sitesini ziyaret eden tüm iş ortaklarının, müşterilerinin ve ziyaretçilerinin bilgi güvenliğini en üst düzeyde korumayı taahhüt eder.\n\nWeb sitemiz üzerinden iletilen iletişim mesajları ve polimer hammadde teklif talepleri, güvenli sunucu altyapısında şifrelenmiş bağlantılar (HTTPS/TLS) ve hız sınırlandırma (rate-limiting) önlemleriyle korunmaktadır. Verileriniz hiçbir koşulda üçüncü taraf reklam veya pazarlama ağlarına satılmaz.', 'legal', 'Gizlilik Politikası Metni', 'textarea'],
        ['legal_cookie_title', 'Çerez (Cookie) Politikası', 'legal', 'Çerez Başlığı', 'text'],
        ['legal_cookie_text', 'Acar Grup kurumsal portföy sitesinde, kullanıcı deneyimini aksatmayan sade ve gizlilik odaklı bir teknik mimari benimsenmiştir. Sitemizde üçüncü taraf reklam veya davranışsal takip çerezi kullanılmamaktadır.\n\nYalnızca açılış ekranı animasyonunun (preloader) aynı oturum içerisinde tekrar gösterilmemesi amacıyla tarayıcınızın geçici oturum belleği (sessionStorage) kullanılmaktadır.', 'legal', 'Çerez Politikası Metni', 'textarea'],
      ];

      for (const s of defaultSettings) {
        insertSetting.run(s[0], s[1], s[2], s[3], s[4]);
      }
      console.log('[Acar Grup DB] Varsayılan site ayarları ve içerik metinleri yüklendi.');
    }
  } catch (err) {
    console.error('[Acar Grup DB] Site ayarları tablosu başlatılamadı:', err);
  }

  // İlk Admin Kullanıcısı: bilgiler .env'den (ADMIN_USERNAME / ADMIN_PASSWORD) okunur.
  // ADMIN_PASSWORD tanımlı değilse rastgele bir şifre üretilir ve konsola yalnızca bir kez yazılır.
  try {
    const adminUsername = (process.env.ADMIN_USERNAME || 'admin').trim();
    const adminCount = db.prepare(`SELECT COUNT(*) AS c FROM admin_users`).get() as { c: number };
    if (adminCount.c === 0) {
      const generated = !process.env.ADMIN_PASSWORD;
      const plainPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url');
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.scryptSync(plainPassword, salt, 64).toString('hex');

      db.prepare(`
        INSERT INTO admin_users (username, password_hash, salt, name, role)
        VALUES (?, ?, ?, ?, ?)
      `).run(adminUsername, hash, salt, 'Acar Grup Yönetici', 'superadmin');
      console.log(`[Acar Grup DB] İlk yönetici oluşturuldu. Kullanıcı: ${adminUsername}`);
      if (generated) {
        console.log(`[Acar Grup DB] Geçici şifre (giriş yapınca Profil sayfasından değiştirin): ${plainPassword}`);
      }
    }
  } catch (err) {
    console.error('[Acar Grup DB] Admin kullanıcısı oluşturulamadı:', err);
  }
}

