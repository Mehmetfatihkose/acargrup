import React from 'react';
import { getResponsiveMedia } from '../lib/fallbackData';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  pictureClassName?: string;
}

/**
 * AVIF + WebP srcset destekli, CLS önleyici kurumsal görsel bileşeni
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  className = '',
  pictureClassName = 'block w-full h-full',
  ...rest
}) => {
  const media = getResponsiveMedia(src);

  return (
    <picture className={pictureClassName}>
      {media.avif && <source srcSet={media.avif} type="image/avif" />}
      {media.webpSrcSet && (
        <source srcSet={media.webpSrcSet} sizes={sizes} type="image/webp" />
      )}
      <img
        src={media.fallback}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
        {...rest}
      />
    </picture>
  );
};

