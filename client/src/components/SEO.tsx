import React from 'react';

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.acargrup.com.tr';

/**
 * Sayfa Bazlı SEO, Open Graph ve Twitter Etiketleri Bileşeni
 * React 19 yerel Document Metadata desteği kullanır (title, meta ve link etiketleri doğrudan head'e taşınır).
 */
export const SEO: React.FC<SEOProps> = ({
  title,
  description = 'Acar Grup — Demiryolu, Tünel, Viyadük Altyapı İnşaatı ve Küresel Plastik Hammadde Tedariği (1974-2026)',
  path = '/',
  image = '/media/hero-poster.webp',
  type = 'website',
  noIndex = false,
}) => {
  const fullTitle = `${title} | Acar Grup — 1974'ten Beri`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const fullImageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <link rel="canonical" href={canonicalUrl} />
      )}

      {/* Open Graph */}
      <meta property="og:locale" content="tr_TR" />
      <meta property="og:site_name" content="Acar Grup Holding A.Ş." />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
    </>
  );
};

