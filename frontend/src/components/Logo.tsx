interface MarkColors {
  /** dome arch + circle outline + petals */
  primary?: string;
  /** the crossed bands */
  cross?: string;
}

/**
 * toikhana.kz brand mark — a stylised shanyrak (yurt dome) over an ornamental
 * medallion with a gold cross and four petals. Rebuilt as SVG so it stays crisp
 * at any size and can be recoloured for light/dark surfaces.
 */
export function BrandMark({
  className,
  primary = '#15463F',
  cross = '#C8A45A'
}: { className?: string } & MarkColors) {
  return (
    <svg viewBox="0 0 48 58" className={className} fill="none" role="img" aria-label="toikhana.kz">
      {/* dome / shanyrak silhouette */}
      <path
        d="M11 55 V27 C11 15 16.5 7 24 7 C31.5 7 37 15 37 27 V55"
        stroke={primary}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* subtle scroll at the crown */}
      <path
        d="M27.5 8.4 C31 7 34 8.8 33.6 12.4"
        stroke={primary}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* medallion */}
      <circle cx="24" cy="34" r="11" stroke={primary} strokeWidth="2" />
      {/* gold cross */}
      <path d="M16.2 26.2 L31.8 41.8 M31.8 26.2 L16.2 41.8" stroke={cross} strokeWidth="3.1" strokeLinecap="round" />
      {/* four petals between the cross arms */}
      <path d="M24 24.6 C25.7 26 25.7 28.6 24 30 C22.3 28.6 22.3 26 24 24.6 Z" fill={primary} />
      <path d="M24 38 C25.7 39.4 25.7 42 24 43.4 C22.3 42 22.3 39.4 24 38 Z" fill={primary} />
      <path d="M15.2 34 C16.6 32.3 19.2 32.3 20.6 34 C19.2 35.7 16.6 35.7 15.2 34 Z" fill={primary} />
      <path d="M27.4 34 C28.8 32.3 31.4 32.3 32.8 34 C31.4 35.7 28.8 35.7 27.4 34 Z" fill={primary} />
    </svg>
  );
}

/** Full lockup: mark + wordmark. `tone` switches colours for dark surfaces. */
export function Logo({
  className,
  tone = 'color',
  withWordmark = true
}: {
  className?: string;
  tone?: 'color' | 'light';
  withWordmark?: boolean;
}) {
  const light = tone === 'light';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <BrandMark
        className="h-9 w-auto shrink-0"
        primary={light ? '#FFFFFF' : '#15463F'}
        cross="#C8A45A"
      />
      {withWordmark ? (
        <span className="text-xl font-extrabold tracking-tight">
          <span className={light ? 'text-white' : 'text-primary'}>toikhana</span>
          <span className="text-accent">.kz</span>
        </span>
      ) : null}
    </span>
  );
}
