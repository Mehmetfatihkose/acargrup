export interface SeedProject {
  title: string;
  slug: string;
  category: 'Demiryolu' | 'Karayolu' | 'Altyapı' | 'Bina';
  sector: string;
  location: string;
  year: number;
  client: string;
  description: string;
  cover_image: string;
  budget_range: string;
  duration: string;
  gallery: { image_url: string; caption: string }[];
}

export const seedProjects: SeedProject[] = [
  {
    title: 'Anadolu Yüksek Hızlı Tren Üstyapı ve Ray Döşeme Koridoru',
    slug: 'anadolu-yuksek-hizli-tren-ustyapi-koridoru',
    category: 'Demiryolu',
    sector: 'İnşaat',
    location: 'Kırıkkale – Yozgat – Sivas',
    year: 2024,
    client: 'TCDD Genel Müdürlüğü',
    description:
      'Saatte 250 km işletme hızına uygun olarak tasarlanan 312 kilometrelik çift hatlı yüksek hızlı tren koridorunun balastlı ve rijit (slab-track) üstyapı imalatları, UIC 60 uzun kaynaklı ray serimi ve katener elektrifikasyon altyapısı Acar Grup mühendisliğiyle tamamlanmıştır.\n\nZorlu karasal iklim ve yüksek rakımlı topoğrafya koşullarında milimetrik geometrik toleranslarla yürütülen projede, 68 adet yüksek hızlı makas takımı, akustik gürültü bariyerleri ve sismik genleşme derzleri uluslararası TSI standartlarına tam uyumlu olarak devreye alınmıştır.',
    cover_image: '/media/hero-railway.webp',
    budget_range: '₺8,4 Milyar – ₺9,2 Milyar',
    duration: '42 Ay',
    gallery: [
      {
        image_url: '/media/hero-railway.webp',
        caption: 'Sürekli kaynaklı UIC 60 ray serimi ve gece taşlama operasyonları',
      },
      {
        image_url: '/media/viaduct-bridge.webp',
        caption: 'Yüksek rakımlı vadi geçişinde çift hatlı öngerilmeli demiryolu viyadüğü',
      },
      {
        image_url: '/media/railway-after.webp',
        caption: 'Elektrifikasyon ve katener montajı tamamlanan ana hat kesiti',
      },
    ],
  },
  {
    title: 'Toroslar Viyadüğü ve Çift Hat Demiryolu Köprü Geçişi',
    slug: 'toroslar-viyadugu-demiryolu-kopru-gecisi',
    category: 'Demiryolu',
    sector: 'İnşaat',
    location: 'Adana – Mersin – Niğde Aksı',
    year: 2023,
    client: 'Ulaştırma ve Altyapı Bakanlığı (AYGM)',
    description:
      'Maksimum ayak yüksekliği 94 metreye ulaşan ve 1.840 metre toplam açıklığa sahip Toroslar Demiryolu Viyadüğü, dengeli konsol (balanced cantilever) yöntemiyle inşa edilen Türkiye’nin en nitelikli mühendislik yapılarından biridir.\n\nYüksek deprem ivmesine karşı sismik izolatör mesnet sistemleriyle donatılan köprü tabliyesi, ağır yük trenleri ile hızlı yolcu trenlerinin eşzamanlı geçişine olanak tanıyan karma işletme kriterlerine göre projelendirilmiştir.',
    cover_image: '/media/viaduct-bridge.webp',
    budget_range: '₺4,1 Milyar – ₺4,6 Milyar',
    duration: '36 Ay',
    gallery: [
      {
        image_url: '/media/viaduct-bridge.webp',
        caption: '94 metre yüksekliğindeki orta ayaklar ve dengeli konsol tabliye imalatı',
      },
      {
        image_url: '/media/hero-railway.webp',
        caption: 'Viyadük yaklaşım koridorunda balast serimi ve ray kaynak işlemleri',
      },
      {
        image_url: '/media/tunnel-tbm.webp',
        caption: 'Viyadük çıkışında yer alan bağlantı tüneli portal geçişi',
      },
    ],
  },
  {
    title: 'Doğu Karadeniz Çift Tüp Demiryolu ve Altyapı Tüneli',
    slug: 'dogu-karadeniz-cift-tup-demiryolu-tuneli',
    category: 'Altyapı',
    sector: 'İnşaat',
    location: 'Gümüşhane – Trabzon',
    year: 2024,
    client: 'AYGM Altyapı Yatırımları Genel Müdürlüğü',
    description:
      'Her biri 14,2 kilometre uzunluğunda iki paralel tüpten oluşan derin kaya tüneli projesi, tam kesit tünel açma makineleri (TBM) ve Yeni Avusturya Tünel Açma Yöntemi (NATM) hibrit uygulamasıyla hayata geçirilmiştir.\n\nYüksek yeraltı su basıncına karşı çift katmanlı EPDM/PVC membran yalıtımı, prekast C50 segment kaplaması, 28 adet acil kaçış yaklaşım galerisi ve jet-fan havalandırma otomasyonu eksiksiz tamamlanmıştır.',
    cover_image: '/media/tunnel-tbm.webp',
    budget_range: '₺6,8 Milyar – ₺7,5 Milyar',
    duration: '48 Ay',
    gallery: [
      {
        image_url: '/media/tunnel-tbm.webp',
        caption: 'Prekast segment kaplamalı çift tüp demiryolu tüneli iç perspektifi',
      },
      {
        image_url: '/media/railway-before.webp',
        caption: 'Portal kazısı ve iksa destekleme aşaması saha görünümü',
      },
      {
        image_url: '/media/railway-after.webp',
        caption: 'Tünel çıkış hattında tamamlanan slab-track ve elektrifikasyon imalatı',
      },
    ],
  },
  {
    title: 'Kuzey Marmara Lojistik Otoyol Bağlantısı ve Kavşak Sanat Yapıları',
    slug: 'kuzey-marmara-lojistik-otoyol-baglantisi',
    category: 'Karayolu',
    sector: 'İnşaat',
    location: 'Kocaeli – Sakarya',
    year: 2022,
    client: 'Karayolları Genel Müdürlüğü (KGM)',
    description:
      'Organize sanayi bölgeleri ile liman terminallerini ana otoyol omurgasına bağlayan 46 kilometrelik 2x4 şeritli otoyol kesimi; 9 adet farklı seviyeli kavşak, 14 ardgerme köprü ve 1,2 milyon metrekare taş mastik asfalt (SMA) kaplama imalatını kapsamaktadır.\n\nAkıllı ulaşım sistemleri (AUS), fiber optik haberleşme omurgası ve ağır tonajlı lojistik trafiğe dayanıklı modifiye bitüm teknolojisiyle kesintisiz ulaşım güvenliği sağlanmıştır.',
    cover_image: '/media/highway-infrastructure.webp',
    budget_range: '₺3,2 Milyar – ₺3,8 Milyar',
    duration: '30 Ay',
    gallery: [
      {
        image_url: '/media/highway-infrastructure.webp',
        caption: 'Çok katmanlı otoyol kavşağı ve çelik-betonarme kompozit üstgeçitler',
      },
      {
        image_url: '/media/viaduct-bridge.webp',
        caption: 'Ağır taşıt koridoru vadi geçiş viyadüğü',
      },
      {
        image_url: '/media/industrial-building.webp',
        caption: 'Otoyol bakım ve akıllı trafik kontrol merkezi binası',
      },
    ],
  },
  {
    title: 'Ege Endüstriyel Liman Demiryolu İltisak Hattı',
    slug: 'ege-endustriyel-liman-demiryolu-iltisak-hatti',
    category: 'Demiryolu',
    sector: 'İnşaat',
    location: 'İzmir – Aliağa',
    year: 2023,
    client: 'TCDD & Aliağa Liman İşletmeleri Ortak Girişimi',
    description:
      'Petrokimya ve konteyner liman terminallerini ulusal demiryolu şebekesine doğrudan bağlayan 38 kilometrelik ağır yük iltisak hattı, dingil basıncı 25 tona dayanıklı özel travers ve ray altyapısıyla inşa edilmiştir.\n\nLiman sahası içinde gömülü oluklu ray (grooved rail) uygulamaları, otomatik vagon kantarları ve ERTMS Seviye 1 sinyalizasyon entegrasyonu ile deniz-demiryolu kombine taşımacılık kapasitesi üç katına çıkarılmıştır.',
    cover_image: '/media/railway-after.webp',
    budget_range: '₺1,9 Milyar – ₺2,3 Milyar',
    duration: '24 Ay',
    gallery: [
      {
        image_url: '/media/railway-after.webp',
        caption: 'Tamamlanan çift hatlı liman bağlantı koridoru ve elektrifikasyon direkleri',
      },
      {
        image_url: '/media/hero-railway.webp',
        caption: 'Gece vardiyasında ray alüminotermik kaynak uygulaması',
      },
    ],
  },
  {
    title: 'İç Anadolu İçme Suyu İsale Tüneli ve Arıtma Altyapısı',
    slug: 'ic-anadolu-icme-suyu-isale-tuneli',
    category: 'Altyapı',
    sector: 'İnşaat',
    location: 'Konya – Karaman',
    year: 2021,
    client: 'Devlet Su İşleri (DSİ) Genel Müdürlüğü',
    description:
      '2,6 milyon nüfusun uzun vadeli su güvenliğini teminat altına alan proje kapsamında 22 kilometre çelik borulu basınçlı isale hattı, 6,4 kilometre iletim tüneli ve günlük 350.000 metreküp kapasiteli ileri biyolojik-ozonlama içme suyu arıtma tesisi inşa edilmiştir.\n\nSCADA tabanlı uzaktan debi ve basınç izleme istasyonları ile su kayıp-kaçak oranı minimuma indirilmiştir.',
    cover_image: '/media/tunnel-tbm.webp',
    budget_range: '₺2,5 Milyar – ₺2,9 Milyar',
    duration: '34 Ay',
    gallery: [
      {
        image_url: '/media/tunnel-tbm.webp',
        caption: 'İsale tüneli betonarme kaplama ve çelik boru montaj hazırlığı',
      },
      {
        image_url: '/media/railway-before.webp',
        caption: 'Baraj su alma yapısı ve derin kazı şev destekleme imalatları',
      },
    ],
  },
  {
    title: 'Acar Kule Kurumsal Merkez ve Mühendislik Kampüsü',
    slug: 'acar-kule-kurumsal-merkez-kampusu',
    category: 'Bina',
    sector: 'İnşaat',
    location: 'İstanbul – Levent',
    year: 2022,
    client: 'Acar Gayrimenkul Yatırım A.Ş.',
    description:
      'LEED Platinum sürdürülebilirlik sertifikasına sahip 28 katlı Acar Kule, yapısal çelik ve yüksek dayanımlı betonarme çekirdek sistemiyle sismik performansı en üst düzeyde tasarlanmış A+ kurumsal yönetim merkezidir.\n\nÇift cidarlı (double-skin) yüksek performanslı cam cephe, yağmur suyu geri kazanım üniteleri ve akıllı bina otomasyonuyla geleneksel ofis yapılarına kıyasla %38 enerji tasarrufu sağlamaktadır.',
    cover_image: '/media/industrial-building.webp',
    budget_range: '₺2,8 Milyar – ₺3,3 Milyar',
    duration: '28 Ay',
    gallery: [
      {
        image_url: '/media/industrial-building.webp',
        caption: 'Acar Kule gün batımı cephe aydınlatması ve çelik taşıyıcı mimari',
      },
      {
        image_url: '/media/highway-infrastructure.webp',
        caption: 'Kampüs ulaşım bağlantıları ve çevre düzenlemesi',
      },
    ],
  },
  {
    title: 'Gebze Polimer Lojistik Üssü ve Akıllı Silo Terminali',
    slug: 'gebze-polimer-lojistik-ussu-silo-terminali',
    category: 'Bina',
    sector: 'İnşaat',
    location: 'Kocaeli – Gebze OSB',
    year: 2024,
    client: 'Acar Polimer Hammadde A.Ş.',
    description:
      'Acar Grup’un plastik hammadde tedarik operasyonlarının ana kalbi olan 65.000 m² kapalı alanlı lojistik üs; 24 adet paslanmaz alüminyum granül silosu, tam otomatik FFS torbalama hatları ve ISO 17025 akredite polimer kalite kontrol laboratuvarını barındırmaktadır.\n\nDemiryolu iltisak hattının doğrudan depo içine girdiği intermodal mimari sayesinde tek seferde 45 vagonluk blok tren tahliyesi gerçekleştirilebilmektedir.',
    cover_image: '/media/industrial-building.webp',
    budget_range: '₺1,6 Milyar – ₺2,0 Milyar',
    duration: '20 Ay',
    gallery: [
      {
        image_url: '/media/industrial-building.webp',
        caption: '65.000 m² kapalı depolama alanı ve idari teknoloji merkezi',
      },
      {
        image_url: '/media/plastic-granules.webp',
        caption: 'Nem ve sıcaklık kontrollü polimer hammadde analiz laboratuvarı',
      },
    ],
  },
  {
    title: 'Güneydoğu Çevre Otoyolu Viyadük ve Köprü Paketi',
    slug: 'guneydogu-cevre-otoyolu-viyaduk-paketi',
    category: 'Karayolu',
    sector: 'İnşaat',
    location: 'Gaziantep – Şanlıurfa',
    year: 2020,
    client: 'Karayolları Genel Müdürlüğü (KGM)',
    description:
      'Uluslararası transit yük koridorunun kritik kesimini oluşturan 54 kilometrelik çevre otoyolu kapsamında 6 adet öngerilmeli kirişli viyadük, 22 alt-üst geçit ve ağır iklim şartlarına dayanıklı polimer modifiye bitümlü sıcak karışım kaplama tamamlanmıştır.',
    cover_image: '/media/highway-infrastructure.webp',
    budget_range: '₺2,1 Milyar – ₺2,5 Milyar',
    duration: '26 Ay',
    gallery: [
      {
        image_url: '/media/highway-infrastructure.webp',
        caption: 'Transit otoyol koridoru ve viyadük yaklaşım yapıları',
      },
      {
        image_url: '/media/viaduct-bridge.webp',
        caption: 'Vadi geçişi prefabrik kiriş montajı tamamlanan viyadük hattı',
      },
    ],
  },
  {
    title: 'Trakya Hızlı Tren Sinyalizasyon ve Üstyapı Modernizasyonu',
    slug: 'trakya-hizli-tren-sinyalizasyon-modernizasyonu',
    category: 'Demiryolu',
    sector: 'İnşaat',
    location: 'İstanbul (Halkalı) – Tekirdağ – Edirne',
    year: 2025,
    client: 'TCDD Genel Müdürlüğü',
    description:
      'Avrupa demiryolu koridoruna entegre 185 kilometrelik hattın altyapı iyileştirmesi, B70 öngerilmeli beton travers serimi, otomatik tren koruma (ATP) ve ETCS Seviye 2 sinyalizasyon saha ekipmanlarının anahtar teslim kurulumu gerçekleştirilmiştir.',
    cover_image: '/media/hero-railway.webp',
    budget_range: '₺5,4 Milyar – ₺6,0 Milyar',
    duration: '32 Ay',
    gallery: [
      {
        image_url: '/media/hero-railway.webp',
        caption: 'Halkalı-Kapıkule aksında yüksek hassasiyetli ray buraj ve kaynak çalışmaları',
      },
      {
        image_url: '/media/railway-after.webp',
        caption: 'Modernize edilen çift hat elektrifikasyon ve sinyalizasyon kesiti',
      },
    ],
  },
];

export interface SeedProduct {
  name: string;
  slug: string;
  category: string;
  description: string;
  specs: {
    code: string;
    subtypes: string;
    mfi: string;
    density: string;
    meltingTemp: string;
    tensileStrength: string;
    applications: string[];
    standards: string;
  };
  packaging: string;
  image: string;
}

export const seedProducts: SeedProduct[] = [
  {
    name: 'PE — Polietilen (HDPE / LDPE / LLDPE)',
    slug: 'pe-polietilen',
    category: 'Poliolefin Grubu',
    description:
      'Yüksek kimyasal direnç, üstün darbe mukavemeti ve esnek işlenebilirlik sunan orijinal (virgin) Polietilen granüllerimiz; basınçlı içme suyu/doğalgaz borularından endüstriyel shrink filmlere ve şişirme ambalajlara kadar geniş bir spektrumda kesintisiz tedarik edilmektedir.',
    specs: {
      code: 'PE (HDPE · LDPE · LLDPE · mLLDPE)',
      subtypes: 'PE100 Boruluk, Film Ekstrüzyon, Şişirme (Blow Molding), Enjeksiyon',
      mfi: '0.25 – 35.0 g/10 dk (190°C / 2.16 kg, ISO 1133)',
      density: '0.918 – 0.965 g/cm³ (ISO 1183)',
      meltingTemp: '110°C – 135°C',
      tensileStrength: '18 – 34 MPa (ISO 527)',
      applications: [
        'PE100 Basınçlı Altyapı ve Doğalgaz Boruları',
        'Endüstriyel Stretch, Shrink ve Sera Filmleri',
        'Gıda ve Kimyasal Bidon / Şişirme Ambalajlar',
        'Kablo İzolasyon ve Koruge Boru Sistemleri',
      ],
      standards: 'ISO 9001, REACH, RoHS, FDA Gıda Temas Uygunluğu',
    },
    packaging: '25 kg FFS Polietilen Torba · 1.250 kg Paletli BigBag · 26 Ton Dökme Silobas',
    image: '/media/plastic-granules.webp',
  },
  {
    name: 'PP — Polipropilen (Homopolimer / Kopolimer / Random)',
    slug: 'pp-polipropilen',
    category: 'Poliolefin Grubu',
    description:
      'Yüksek ısıl kararlılık, düşük yoğunluk ve mükemmel yorulma direnci sağlayan Homopolimer (PPH), Darbe Kopolimer (PPC) ve Random Kopolimer (PPR) granüllerimiz otomotiv, beyaz eşya, tekstil rafya ve sıhhi tesisat boru üreticilerinin yüksek tonajlı taleplerini karşılar.',
    specs: {
      code: 'PP (PPH · PPC · PPR)',
      subtypes: 'Rafya/Çuval, Enjeksiyon, BOPP Film, Thermoform, PPR Boruluk',
      mfi: '0.30 – 55.0 g/10 dk (230°C / 2.16 kg, ISO 1133)',
      density: '0.900 – 0.910 g/cm³ (ISO 1183)',
      meltingTemp: '160°C – 168°C',
      tensileStrength: '28 – 38 MPa (ISO 527)',
      applications: [
        'Otomotiv Tampon, Torpido ve İç Trim Parçaları',
        'PPR Sıcak-Soğuk Bina Tesisat Boru ve Ek Parçaları',
        'Dokuma Çuval, BigBag Rafya ve Halı İpliği',
        'Gıda Saklama Kapları, Kapak ve Medikal Enjektörler',
      ],
      standards: 'ISO 15874 (PPR), REACH, Avrasya ve AB Gıda Temas Sertifikalı',
    },
    packaging: '25 kg FFS Torba · 1.100 kg Antistatik BigBag · Dökme Silobas Sevkiyatı',
    image: '/media/plastic-granules.webp',
  },
  {
    name: 'PVC — Polivinil Klorür (Süspansiyon S-PVC / Emülsiyon E-PVC)',
    slug: 'pvc-polivinil-klorur',
    category: 'Vinil Polimer Grubu',
    description:
      'İnşaat ve altyapı sektörünün vazgeçilmez hammaddesi olan K-58, K-65, K-67 ve K-70 değerlerindeki süspansiyon PVC reçinelerimiz; yüksek alev geciktiricilik, hava koşullarına dayanım ve uzun servis ömrü gerektiren profil, boru ve kablo üretim hatlarına özel tedarik edilir.',
    specs: {
      code: 'S-PVC & E-PVC (K58 · K65 · K67 · K70)',
      subtypes: 'Rijit Profil & Boru (K67), Esnek Kablo & Hortum (K70), Enjeksiyon (K58)',
      mfi: 'K Değeri: 57 – 71 (ISO 1628-2)',
      density: '1.38 – 1.42 g/cm³ (Görünür Yoğunluk: 0.48 – 0.58 g/cm³)',
      meltingTemp: 'Camlaşma: 82°C · İşleme: 165°C – 205°C',
      tensileStrength: '42 – 55 MPa (Rijit Formülasyon)',
      applications: [
        'Pencere ve Kapı Mimari Doğrama Profilleri',
        'Atık Su, Temiz Su ve Drenaj Altyapı Boruları',
        'Enerji ve Veri Kablosu Dış Kılıf İzolasyonu',
        'Endüstriyel Zemin Kaplama ve Jeomembran Yalıtım',
      ],
      standards: 'DIN EN ISO 1061, Düşük Kalıntı VCM (< 1 ppm), RoHS Uyumlu',
    },
    packaging: '25 kg Kraft/PE Valf Torba · 1.200 kg BigBag · Pnömatik Silobas',
    image: '/media/plastic-granules.webp',
  },
  {
    name: 'PET — Polietilen Tereftalat (Bottle & Sheet Grade)',
    slug: 'pet-polietilen-tereftalat',
    category: 'Mühendislik & Ambalaj Polimeri',
    description:
      'Kristal berraklık, yüksek gaz bariyeri ve %100 geri dönüştürülebilirlik niteliği taşıyan farklı IV (İçsel Viskozite) derecelerindeki PET cipslerimiz ve rPET (Geri Dönüştürülmüş Gıda Uyumlu PET) granüllerimiz ambalaj ve levha sanayiine düzenli stoktan sunulmaktadır.',
    specs: {
      code: 'PET & rPET (IV 0.76 – 0.84 dl/g)',
      subtypes: 'Su & Meşrubat Preform, APET Termoform Levha, Tekstil Elyaf',
      mfi: 'İçsel Viskozite (IV): 0.76 – 0.85 dl/g (ASTM D4603)',
      density: '1.38 – 1.40 g/cm³',
      meltingTemp: '245°C – 255°C',
      tensileStrength: '55 – 75 MPa',
      applications: [
        'Su, Gazlı İçecek ve Yenilebilir Yağ Şişe Preformları',
        'Şeffaf APET Gıda ve Elektronik Blister Levhaları',
        'Yüksek Mukavemetli Endüstriyel Çemberleme Şeritleri',
        'Sürdürülebilir rPET Döngüsel Ambalaj Çözümleri',
      ],
      standards: 'EFSA & FDA Onaylı, Düşük Asetaldehit (< 1.0 ppm), ISO 14001',
    },
    packaging: '1.100 kg Alüminyum Bariyerli Neme Dayanıklı BigBag',
    image: '/media/plastic-granules.webp',
  },
  {
    name: 'ABS — Akrilonitril Bütadien Stiren (Mühendislik Polimeri)',
    slug: 'abs-muhendislik-polimeri',
    category: 'Mühendislik Polimeri',
    description:
      'Yüksek yüzey parlaklığı, boyutsal hassasiyet, elektroliz kaplanabilirlik ve düşük sıcaklıklarda dahi korunan darbe dayanımıyla öne çıkan ABS granüllerimiz; otomotiv, beyaz eşya, elektrik-elektronik gövde ve hassas endüstriyel kalıplama projeleri için tedarik edilmektedir.',
    specs: {
      code: 'ABS (Genel Amaçlı · Yüksek Akış · Isıya Dayanıklı · FR)',
      subtypes: 'Enjeksiyon Kalıplama, Levha Ekstrüzyon, Alev Geciktiricili (UL94 V-0)',
      mfi: '8.0 – 38.0 g/10 dk (220°C / 10 kg, ISO 1133)',
      density: '1.04 – 1.07 g/cm³ (ISO 1183)',
      meltingTemp: 'Vicat Yumuşama: 96°C – 112°C · İşleme: 210°C – 250°C',
      tensileStrength: '42 – 50 MPa (Izod Darbe: 18 – 28 kJ/m²)',
      applications: [
        'Beyaz Eşya Dış Gövde, Kontrol Paneli ve İç Aksamları',
        'Otomotiv Ön Izgara, Ayna Gövdesi ve Konsol Parçaları',
        'Elektrik Pano Ekipmanları ve Tüketici Elektroniği Muhafazaları',
        'Bavul, Koruyucu Baret ve Endüstriyel Vakum Levhaları',
      ],
      standards: 'UL94 HB / V-0, Otomotiv OEM Onaylı, RoHS & REACH',
    },
    packaging: '25 kg Neme Karşı Lamine Torba · 1.000 kg BigBag',
    image: '/media/plastic-granules.webp',
  },
];

export const seedMilestones = [
  {
    year: 1974,
    title: 'Kuruluş ve İlk Altyapı Taahhüdü',
    description:
      'Yüksek Mühendis Kemal Acar tarafından Ankara’da kurulan Acar İnşaat, Anadolu’daki ilk devlet karayolu sanat yapıları ve köprü taahhüdünü başarıyla üstlendi.',
  },
  {
    year: 1982,
    title: 'Demiryolu Mühendisliğine Giriş',
    description:
      'TCDD hat yenileme ve balastlı üstyapı projeleriyle demiryolu sektörüne adım atıldı; ilk ağır iş makinesi ve ray kaynak parkuru oluşturuldu.',
  },
  {
    year: 1991,
    title: 'Plastik Hammadde ve Polimer Tedarik Grubu',
    description:
      'Türkiye sanayiinin artan polimer ihtiyacını karşılamak üzere İstanbul ve Gebze depolama tesisleriyle Acar Polimer Hammadde A.Ş. faaliyete geçti.',
  },
  {
    year: 1999,
    title: 'Derin Tünel ve Viyadük Uzmanlığı',
    description:
      'Zorlu dağ geçitlerinde NATM tünelciliği ve dengeli konsol viyadük projeleriyle A Grubu Sınırsız Müteahhitlik Yetki Belgesi alındı.',
  },
  {
    year: 2006,
    title: 'Holding Yapılanması ve Küresel Tedarik Ağı',
    description:
      'İnşaat, altyapı ve polimer tedarik şirketleri Acar Grup Holding A.Ş. çatısı altında birleşti; Orta Doğu, Avrupa ve Asya petrokimya üreticileriyle doğrudan distribütörlük anlaşmaları imzalandı.',
  },
  {
    year: 2012,
    title: 'Yüksek Hızlı Tren (YHT) Koridorlarında Öncülük',
    description:
      'Saatte 250 km hıza uygun slab-track ve uzun kaynaklı ray serim teknolojilerine yapılan yatırımla ulusal YHT projelerinde ana yüklenici konumuna ulaşıldı.',
  },
  {
    year: 2018,
    title: 'Sürdürülebilir Polimer ve rPET Dönüşüm Hamlesi',
    description:
      'Döngüsel ekonomi vizyonu doğrultusunda gıda uyumlu geri dönüştürülmüş polimer (rPET / rHDPE) tedariki ve ISO 14001/45001 entegre yönetim sistemleri devreye alındı.',
  },
  {
    year: 2022,
    title: 'Acar Kule ve Gebze İntermodal Silo Terminali',
    description:
      'LEED Platinum sertifikalı İstanbul Levent genel merkez binası ve demiryolu iltisak hatlı 65.000 m² Gebze akıllı polimer lojistik üssü hizmete açıldı.',
  },
  {
    year: 2025,
    title: '50+ Yıllık Miras ve Yeni Nesil Yeşil Altyapı',
    description:
      '2.450 kilometreyi aşan demiryolu imalatı ve yıllık 320.000 ton polimer tedarik kapasitesiyle Türkiye’nin geleceğini inşa etme kararlılığı yarım asrı geride bıraktı.',
  },
];

export const seedNews = [
  {
    title: 'Anadolu YHT Koridorunda 312 Kilometrelik Üstyapı Etabı Başarıyla Tamamlandı',
    slug: 'anadolu-yht-koridorunda-312-km-ustyapi-etabi-tamamlandi',
    summary:
      'Acar Grup mühendislik ekiplerinin gece-gündüz sürdürdüğü yüksek hassasiyetli ray serimi ve elektrifikasyon çalışmaları, planlanan takvimden üç ay önce test sürüşlerine açıldı.',
    content:
      'Türkiye’nin doğu-batı demiryolu omurgasını güçlendiren Anadolu Yüksek Hızlı Tren Projesi kapsamında Acar Grup sorumluluğunda yürütülen 312 kilometrelik çift hat üstyapı ve elektromekanik paketi başarıyla tamamlanmıştır.\n\nProje süresince 1.400 kişilik uzman saha kadrosu ve grup bünyesindeki tam otomatik dinamik buraj, ray profil taşlama ve mobil alın kaynak makineleri görev almıştır. Milimetrik hat geometrisi ölçümleri uluslararası bağımsız denetim kuruluşları tarafından tam notla onaylanmıştır.\n\nHattın devreye girmesiyle birlikte yıllık 4,2 milyon yolcu kapasitesi ve önemli ölçüde karbon emisyonu tasarrufu sağlanması hedeflenmektedir.',
    image: '/media/hero-railway.webp',
    published_at: '2026-09-18',
  },
  {
    title: 'Gebze İntermodal Polimer Terminali Kapasitesini %40 Artırdı',
    slug: 'gebze-intermodal-polimer-terminali-kapasitesini-artirdi',
    summary:
      'Yeni devreye alınan 8 paslanmaz alüminyum silo ve demiryolu doğrudan tahliye hattı ile PE, PP ve PVC hammadde sevkiyatlarında teslim süreleri 24 saatin altına indi.',
    content:
      'Sanayi üreticilerine kesintisiz ve homojen kalitede plastik hammadde sunma hedefiyle yatırımlarını sürdüren Acar Polimer, Gebze OSB’deki lojistik üssünde ikinci faz kapasite artışını tamamladı.\n\nDoğrudan depo içerisine uzanan demiryolu iltisak hattı sayesinde limanlardan blok trenlerle taşınan granül hammaddeler, dış ortamla temas etmeksizin pnömatik transfer hatlarıyla silolara aktarılmaktadır. Bu sayede hem lojistik kaynaklı karbon ayak izi %32 azaltılmış hem de nem ve kontaminasyon riski sıfıra indirilmiştir.\n\nYeni yatırım ile birlikte yıllık toplam depolama ve sevkiyat kapasitemiz 320.000 ton seviyesine ulaşmıştır.',
    image: '/media/plastic-granules.webp',
    published_at: '2026-08-04',
  },
  {
    title: 'Doğu Karadeniz Çift Tüp Demiryolu Tünelinde Işık Göründü',
    slug: 'dogu-karadeniz-cift-tup-demiryolu-tunelinde-isik-gorundu',
    summary:
      '14,2 kilometrelik zorlu kaya formasyonunu aşan TBM kazısı, sıfır iş kazası bilançosu ve rekor günlük ilerleme hızıyla tamamlanarak tünel birleşimi gerçekleştirildi.',
    content:
      'Ülkemizin en zorlu jeolojik kesitlerinden birinde yürütülen Doğu Karadeniz Çift Tüp Demiryolu Tüneli projesinde kazı aşaması başarıyla noktalandı.\n\nYüksek yeraltı su geliri ve değişken kaya basınçlarına rağmen Acar Grup’un 50 yıllık yeraltı yapıları tecrübesiyle yönetilen süreçte, günde ortalama 24 metre TBM ilerleme hızına ulaşıldı. ISO 45001 İş Sağlığı ve Güvenliği standartlarının tavizsiz uygulanması sayesinde 4,5 milyon adam-saatlik çalışma kayıp günlü kaza yaşanmadan tamamlandı.',
    image: '/media/tunnel-tbm.webp',
    published_at: '2026-06-21',
  },
  {
    title: 'Acar Grup 2026 Sürdürülebilirlik ve Döngüsel Polimer Raporunu Yayımladı',
    slug: 'acar-grup-2026-surdurulebilirlik-raporunu-yayimladi',
    summary:
      'Yeşil şantiye uygulamaları, güneş enerjili lojistik çatı santralleri ve EFSA onaylı rPET/rHDPE portföyümüzle 2030 net-sıfır yol haritamızı paydaşlarımızla paylaştık.',
    content:
      'Acar Grup Holding A.Ş., hem altyapı inşaatı şantiyelerinde hem de plastik hammadde tedarik zincirinde çevresel sorumluluğu merkeze alan 2026 Sürdürülebilirlik Raporunu kamuoyuna sundu.\n\nRaporda öne çıkan başlıklar arasında; demiryolu projelerinde geri kazanılmış balast kullanımı, Gebze ve Adana lojistik çatılarında kurulan 8,5 MWp GES kurulumu ve ambalaj sanayiine sunulan gıda temas onaylı geri dönüştürülmüş polimer (rPET ve rHDPE) hacminin toplam satışlar içindeki payının %22’ye yükselmesi yer alıyor.',
    image: '/media/industrial-building.webp',
    published_at: '2026-04-12',
  },
  {
    title: 'Toroslar Demiryolu Viyadüğü Uluslararası Mühendislik Mükemmeliyet Ödülü’ne Layık Görüldü',
    slug: 'toroslar-viyadugu-muhendislik-odulune-layik-goruldu',
    summary:
      '94 metre ayak yüksekliği ve ileri sismik izolasyon tasarımıyla dikkat çeken Toroslar Viyadüğü, Avrupa Altyapı Konseyi tarafından yılın referans köprü projesi seçildi.',
    content:
      'Acar Grup’un tasarım optimizasyonu ve inşasını üstlendiği 1.840 metrelik Toroslar Çift Hat Demiryolu Viyadüğü, yüksek sismik dayanım kriterleri ve doğaya duyarlı dengeli konsol yapım metodolojisiyle uluslararası alanda takdir topladı.\n\nÖdül jürisi; derin vadi ekosistemine minimum müdahaleyle yürütülen temel imalatlarını, yüksek dayanımlı C60 beton teknolojisini ve uzun ömürlü yapı sağlığı izleme sensör ağını örnek mühendislik uygulaması olarak nitelendirdi.',
    image: '/media/viaduct-bridge.webp',
    published_at: '2026-02-09',
  },
];

export const seedCertificates = [
  {
    name: 'ISO 9001:2015 Kalite Yönetim Sistemi',
    image: 'ISO-9001',
    description:
      'Altyapı, üstyapı ve raylı sistem müteahhitliği ile polimer hammadde tedarik operasyonlarında uluslararası kalite güvence ve izlenebilirlik standardı.',
  },
  {
    name: 'ISO 14001:2015 Çevre Yönetim Sistemi',
    image: 'ISO-14001',
    description:
      'Şantiye sahalarında doğal kaynakların korunması, atık yönetimi, düşük karbon ayak izi ve sürdürülebilir hammadde lojistiği sertifikasyonu.',
  },
  {
    name: 'ISO 45001:2018 İş Sağlığı ve Güvenliği',
    image: 'ISO-45001',
    description:
      'Ağır mühendislik yapıları, tünel, viyadük ve depolama tesislerinde sıfır iş kazası kültürünü belgeleyen uluslararası İSG yönetim sistemi.',
  },
  {
    name: 'A Grubu Sınırsız Müteahhitlik Yetki Belgesi',
    image: 'YETKI-A',
    description:
      'T.C. Çevre, Şehircilik ve İklim Değişikliği Bakanlığı tarafından verilen, üst limit sınırı olmaksızın kamu ve özel mega altyapı projelerini üstlenme yetkisi.',
  },
];

export const seedStats = [
  { label: 'Yıllık Kurumsal Güven', value: 52, suffix: '+', sort_order: 1 },
  { label: 'Km Tamamlanan Demiryolu & Hat', value: 2450, suffix: '+', sort_order: 2 },
  { label: 'Tamamlanan Mega Proje', value: 140, suffix: '+', sort_order: 3 },
  { label: 'Bin Ton Yıllık Polimer Tedariki', value: 320, suffix: '+', sort_order: 4 },
];

