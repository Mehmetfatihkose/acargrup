import React from 'react';
import { SEO } from '../components/SEO';
import { TransitionLink } from '../components/PageTransition';
import { useSettings } from '../api/queries';

interface LegalPageProps {
  docType: 'kvkk' | 'gizlilik' | 'cerez';
}

const legalContent = {
  kvkk: {
    path: '/kvkk',
    title: '6698 Sayılı KVKK Aydınlatma Metni',
    updated: '01 Ocak 2026',
    sections: [
      {
        heading: '1. Veri Sorumlusunun Kimliği',
        body: '6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel verileriniz; veri sorumlusu sıfatıyla Büyükdere Caddesi No: 194 Acar Kule Levent, Beşiktaş / İstanbul adresinde mukim Acar Grup Holding A.Ş. (“Acar Grup”) tarafından aşağıda açıklanan kapsamda işlenmektedir.',
      },
      {
        heading: '2. Kişisel Verilerin İşlenme Amaçları',
        body: 'İletişim ve fiyat teklifi formlarımız aracılığıyla paylaştığınız kimlik, kurumsal iletişim, firma ünvanı ve talep bilgileriniz; mühendislik/ihale süreçlerinin yürütülmesi, plastik hammadde satış tekliflerinin hazırlanması, sözleşme öncesi ticari değerlendirmelerin yapılması ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla sınırlı olarak işlenmektedir.',
      },
      {
        heading: '3. Kişisel Verilerin Aktarılması ve Hukuki Sebep',
        body: 'Toplanan kişisel verileriniz, KVKK’nın 5. maddesinde belirtilen “bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması” ve “veri sorumlusunun meşru menfaati” hukuki sebeplerine dayanılarak yalnızca ilgili grup şirketlerimiz (Acar İnşaat A.Ş. ve Acar Polimer Hammadde A.Ş.) ve kanunen yetkili kamu kurumlarıyla paylaşılabilir.',
      },
      {
        heading: '4. İlgili Kişinin Hakları (KVKK Madde 11)',
        body: 'KVKK’nın 11. maddesi kapsamındaki bilgi talep etme, düzeltme, silinmesini isteme ve itiraz haklarınızı kurumsal@acargrup.com.tr adresine yazılı olarak iletebilirsiniz.',
      },
    ],
  },
  gizlilik: {
    path: '/gizlilik',
    title: 'Gizlilik Politikası',
    updated: '01 Ocak 2026',
    sections: [
      {
        heading: '1. Kurumsal Bilgi Güvenliği Yaklaşımımız',
        body: 'Acar Grup Holding A.Ş., kurumsal web sitesini ziyaret eden tüm iş ortaklarının, müşterilerinin ve ziyaretçilerinin bilgi güvenliğini en üst düzeyde korumayı taahhüt eder.',
      },
      {
        heading: '2. Toplanan Bilgiler ve Korunma Yöntemi',
        body: 'Web sitemiz üzerinden iletilen iletişim mesajları ve polimer hammadde teklif talepleri, güvenli sunucu altyapısında şifrelenmiş bağlantılar (HTTPS/TLS) ve hız sınırlandırma (rate-limiting) önlemleriyle korunmaktadır. Verileriniz hiçbir koşulda üçüncü taraf reklam veya pazarlama ağlarına satılmaz.',
      },
      {
        heading: '3. Fikri Mülkiyet Hakları',
        body: 'Bu web sitesinde yer alan tüm proje görselleri, mühendislik verileri, marka logoları ve kurumsal metinler Acar Grup Holding A.Ş.’ye aittir; yazılı izin olmaksızın çoğaltılamaz.',
      },
    ],
  },
  cerez: {
    path: '/cerez-politikasi',
    title: 'Çerez (Cookie) Politikası',
    updated: '01 Ocak 2026',
    sections: [
      {
        heading: '1. Çerez Kullanım Amacımız',
        body: 'Acar Grup kurumsal portföy sitesinde, kullanıcı deneyimini aksatmayan sade ve gizlilik odaklı bir teknik mimari benimsenmiştir. Sitemizde üçüncü taraf reklam veya davranışsal takip çerezi kullanılmamaktadır.',
      },
      {
        heading: '2. Zorunlu Oturum Verileri',
        body: 'Yalnızca açılış ekranı animasyonunun (preloader) aynı oturum içerisinde tekrar gösterilmemesi amacıyla tarayıcınızın geçici oturum belleği (sessionStorage) kullanılmakta olup tarayıcı kapatıldığında otomatik olarak silinmektedir.',
      },
      {
        heading: '3. Tarayıcı Ayarları Yönetimi',
        body: 'Tarayıcınızın gizlilik ayarları üzerinden çerez ve yerel depolama izinlerini dilediğiniz zaman görüntüleyebilir veya temizleyebilirsiniz.',
      },
    ],
  },
};

/**
 * Hukuki Metin Sayfaları (/kvkk, /gizlilik, /cerez-politikasi):
 * 3.3 Bilinçli Sadelik kuralı gereği HİÇBİR giriş animasyonu yoktur.
 */
export const LegalPage: React.FC<LegalPageProps> = ({ docType }) => {
  const doc = legalContent[docType];
  const { data: settings = {} } = useSettings();

  const title =
    (docType === 'kvkk' && settings.legal_kvkk_title) ||
    (docType === 'gizlilik' && settings.legal_privacy_title) ||
    (docType === 'cerez' && settings.legal_cookie_title) ||
    doc.title;

  const customText =
    (docType === 'kvkk' && settings.legal_kvkk_text) ||
    (docType === 'gizlilik' && settings.legal_privacy_text) ||
    (docType === 'cerez' && settings.legal_cookie_text);

  return (
    <>
      <SEO
        title={title}
        description={`Acar Grup Holding A.Ş. ${title} ve kurumsal veri güvenliği esasları.`}
        path={doc.path}
      />

      <section
        data-theme="light"
        className="bg-[var(--paper)] text-[var(--navy)] pt-36 pb-24 sm:pb-32 min-h-screen"
      >
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <nav aria-label="Sayfa konumu" className="mb-6 text-xs uppercase tracking-[0.16em] text-[var(--gray)]">
            <TransitionLink to="/" className="hover:text-[var(--navy)]">
              Anasayfa
            </TransitionLink>{' '}
            / <span className="text-[var(--navy)] font-semibold">{title}</span>
          </nav>

          <div className="rounded-[3px] border border-[var(--navy)]/12 bg-[var(--white)] p-8 sm:p-14">
            <p className="font-industrial text-xs font-bold tracking-[0.2em] uppercase text-[var(--gray)]">
              SON GÜNCELLEME: {doc.updated}
            </p>
            <h1 className="mt-3 font-serif-heritage text-3xl sm:text-5xl font-semibold text-[var(--navy)]">
              {title}
            </h1>

            <div className="mt-10 space-y-8 border-t border-[var(--navy)]/12 pt-8">
              {customText ? (
                <div className="space-y-6 text-base text-[var(--ink)] leading-[1.7] whitespace-pre-line">
                  {customText}
                </div>
              ) : (
                doc.sections.map((sec) => (
                  <div key={sec.heading}>
                    <h2 className="font-serif-heritage text-2xl font-semibold text-[var(--navy)]">
                      {sec.heading}
                    </h2>
                    <p className="mt-2.5 text-base text-[var(--ink)] leading-[1.7]">
                      {sec.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LegalPage;

