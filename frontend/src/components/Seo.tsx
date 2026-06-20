import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'toikhana.kz';
const SITE_ORIGIN = 'https://toikhana.kz';
// Brand social-preview image served from /public. Drop the logo file at
// frontend/public/og-image.jpg to make it appear in link previews.
const DEFAULT_IMAGE_PATH = '/og-image.jpg';

function siteOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return SITE_ORIGIN;
}

export function canonicalUrl(path?: string) {
  const origin = siteOrigin();
  if (!path) {
    return typeof window !== 'undefined' ? `${origin}${window.location.pathname}` : origin;
  }
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export interface SeoProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  /** JSON-LD structured data objects */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

export function Seo({ title, description, path, image, type = 'website', jsonLd, noindex }: SeoProps) {
  const url = canonicalUrl(path);
  const img = image ?? `${siteOrigin()}${DEFAULT_IMAGE_PATH}`;
  const desc = description ?? 'Каталог тойхан и банкетных залов по всем городам Казахстана. Фото, цены, вместимость и заявки онлайн.';
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <html lang="ru" />
      <title>{title}</title>
      <meta name="description" content={desc} />
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : <meta name="robots" content="index,follow" />}
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content="ru_RU" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {blocks.map((block, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteOrigin(),
    description: 'Каталог тойхан и банкетных залов Казахстана.',
    areaServed: 'KZ'
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path)
    }))
  };
}
