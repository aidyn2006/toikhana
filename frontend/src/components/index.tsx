import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Booking, City, Photo, ToikhanaCard, ToyType } from '../types';
import { useI18n } from '../i18n';
import type { Lang } from '../i18n';
import { useAuth } from '../auth';
import { Logo } from './Logo';

export { Seo, organizationJsonLd, breadcrumbJsonLd, canonicalUrl } from './Seo';
export { Logo, BrandMark } from './Logo';

const NAV_KEYS = [
  { to: '/', key: 'nav.home' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/add-toikhana', key: 'nav.add' },
  { to: '/about', key: 'nav.about' },
  { to: '/contacts', key: 'nav.contacts' }
] as const;

export function formatPrice(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  return value.toLocaleString('ru-RU').replace(/,/g, ' ');
}

function topCities(cities: City[], limit = 8) {
  return [...cities].sort((a, b) => b.toikhanaCount - a.toikhanaCount).slice(0, limit);
}

function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const options: Lang[] = ['ru', 'kk'];
  return (
    <div className={`inline-flex rounded-full border border-slate-200 bg-white p-0.5 text-xs font-semibold ${className ?? ''}`}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          className={`rounded-full px-3 py-1.5 transition ${
            lang === option ? 'bg-primary text-white' : 'text-slate-500 hover:text-primary'
          }`}
        >
          {t(`lang.${option}`)}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader({ cities }: { cities: City[] }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t, loc } = useI18n();
  const { isAuthenticated, user, logout } = useAuth();
  const strip = useMemo(() => topCities(cities), [cities]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)} aria-label="toikhana.kz">
          <Logo withWordmark={false} className="shrink-0" />
          <div>
            <div className="text-lg font-extrabold leading-none tracking-tight">
              <span className="text-primary">toikhana</span>
              <span className="text-accent">.kz</span>
            </div>
            <div className="text-xs text-slate-500">{t('header.subtitle')}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_KEYS.filter((link) => link.to !== '/').map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm transition hover:text-primary ${
                location.pathname === link.to ? 'font-semibold text-primary' : 'text-slate-600'
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
          <LanguageSwitcher />
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/account"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                {user?.name?.split(' ')[0] || t('nav.account')}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-sm text-slate-500 transition hover:text-primary"
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-semibold text-slate-600 transition hover:text-primary">
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            aria-label={t('nav.menu')}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-primary"
          >
            <span className="sr-only">{t('nav.menu')}</span>
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* City quick-strip */}
      <div className="border-t border-slate-100 bg-background/70">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 text-sm md:px-8">
          <Link to="/" className="whitespace-nowrap rounded-full bg-white px-4 py-2 font-medium shadow-sm">
            {t('nav.allCities')}
          </Link>
          {strip.map((city) => (
            <Link
              key={city.id}
              to={`/${city.slug}`}
              className="whitespace-nowrap rounded-full bg-white px-4 py-2 shadow-sm transition hover:text-primary"
            >
              {loc(city.nameRu, city.nameKk)}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV_KEYS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                {t(link.key)}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded-2xl bg-primary px-4 py-3 text-center text-base font-semibold text-white"
                >
                  {t('nav.account')}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="rounded-2xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded-2xl border border-primary px-4 py-3 text-center text-base font-semibold text-primary"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-primary px-4 py-3 text-center text-base font-semibold text-white"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter({ cities }: { cities: City[] }) {
  const { t, loc } = useI18n();
  const footerCities = useMemo(() => topCities(cities, 10), [cities]);
  return (
    <footer className="mt-16 border-t border-slate-200 bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-8">
        <div className="space-y-3">
          <Logo tone="light" />
          <p className="text-sm leading-6 text-white/75">{t('footer.tagline')}</p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">{t('footer.nav')}</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link to="/blog" className="hover:text-accent">{t('nav.blog')}</Link></li>
            <li><Link to="/about" className="hover:text-accent">{t('nav.about')}</Link></li>
            <li><Link to="/contacts" className="hover:text-accent">{t('nav.contacts')}</Link></li>
            <li><Link to="/add-toikhana" className="hover:text-accent">{t('nav.add')}</Link></li>
            <li><Link to="/register" className="hover:text-accent">{t('nav.register')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">{t('footer.cities')}</h4>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/75">
            {footerCities.map((city) => (
              <li key={city.id}><Link to={`/${city.slug}`} className="hover:text-accent">{loc(city.nameRu, city.nameKk)}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">{t('footer.contact')}</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><a href="mailto:hello@toikhana.kz" className="hover:text-accent">hello@toikhana.kz</a></li>
            <li><a href="https://wa.me/77000000000" target="_blank" rel="noreferrer" className="hover:text-accent">WhatsApp</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-accent">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-white/50 md:px-8">
          © {new Date().getFullYear()} toikhana.kz — {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
}

export function Hero({
  cities,
  selectedCity,
  onCityChange
}: {
  cities: City[];
  selectedCity?: string;
  onCityChange: (slug: string) => void;
}) {
  const { t, loc } = useI18n();
  const totalHalls = cities.reduce((sum, city) => sum + city.toikhanaCount, 0);
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-white shadow-soft md:px-10 md:py-16">
      <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_top_right,_#C8A45A_0,_transparent_38%),radial-gradient(circle_at_bottom_left,_#E3CC97_0,_transparent_26%)]" />
      <div className="relative grid gap-8 md:grid-cols-[1.25fr_0.75fr] md:items-center">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-accent">toikhana.kz</p>
          <h1 className="font-serif text-4xl leading-tight md:text-6xl">{t('hero.title')}</h1>
          <p className="max-w-2xl text-base text-white/80 md:text-lg">{t('hero.subtitle')}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/add-toikhana" className="rounded-full bg-accent px-5 py-3 font-semibold text-primary transition hover:brightness-105">
              {t('hero.cta.add')}
            </Link>
            <Link to="/about" className="rounded-full border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
              {t('hero.cta.how')}
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
          <label className="mb-2 block text-sm text-white/75" htmlFor="hero-city">{t('hero.selectCity')}</label>
          <select
            id="hero-city"
            className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-primary outline-none focus:ring-2 focus:ring-accent"
            value={selectedCity ?? ''}
            onChange={(event) => onCityChange(event.target.value)}
          >
            <option value="">{t('nav.allCities')}</option>
            {[...cities].sort((a, b) => a.nameRu.localeCompare(b.nameRu, 'ru')).map((city) => (
              <option key={city.id} value={city.slug}>
                {loc(city.nameRu, city.nameKk)}
              </option>
            ))}
          </select>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="font-serif text-3xl leading-none text-white">{cities.length}</div>
              <div className="mt-1 text-xs text-white/70">{t('trust.cities')}</div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="font-serif text-3xl leading-none text-white">{totalHalls}</div>
              <div className="mt-1 text-xs text-white/70">{t('trust.toikhanas')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustStats({
  cities,
  toikhanasCount,
  featuredCount
}: {
  cities: City[];
  toikhanasCount: number;
  featuredCount: number;
}) {
  const { t } = useI18n();
  const stats = [
    { label: t('trust.cities'), value: String(cities.length) },
    { label: t('trust.toikhanas'), value: String(toikhanasCount) },
    { label: t('trust.featured'), value: String(featuredCount) }
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-[1.75rem] bg-card p-6 shadow-soft">
          <div className="text-sm text-slate-500">{stat.label}</div>
          <div className="mt-2 font-serif text-4xl">{stat.value}</div>
        </div>
      ))}
    </section>
  );
}

export function HowItWorks() {
  const { t } = useI18n();
  const steps = [t('how.step1'), t('how.step2'), t('how.step3')];
  return (
    <section className="space-y-5 rounded-[1.75rem] bg-card p-6 shadow-soft">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('how.eyebrow')}</p>
        <h2 className="font-serif text-3xl">{t('how.title')}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="rounded-2xl bg-background p-5">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
              {index + 1}
            </div>
            <p className="text-sm leading-6 text-slate-700">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function OwnerCTA() {
  const { t } = useI18n();
  return (
    <section className="grid gap-6 rounded-[2rem] bg-accent px-6 py-8 text-primary md:grid-cols-[1.2fr_0.8fr] md:px-10">
      <div>
        <p className="text-sm uppercase tracking-[0.3em]">{t('owner.eyebrow')}</p>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl">{t('owner.title')}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-primary/80">{t('owner.text')}</p>
      </div>
      <div className="flex items-end md:justify-end">
        <Link to="/add-toikhana" className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:brightness-110">
          {t('owner.button')}
        </Link>
      </div>
    </section>
  );
}

export function FAQ() {
  const { t } = useI18n();
  const faqs = [
    [t('faq.q1'), t('faq.a1')],
    [t('faq.q2'), t('faq.a2')],
    [t('faq.q3'), t('faq.a3')],
    [t('faq.q4'), t('faq.a4')],
    [t('faq.q5'), t('faq.a5')]
  ];
  return (
    <section className="space-y-5 rounded-[1.75rem] bg-card p-6 shadow-soft">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('faq.eyebrow')}</p>
        <h2 className="font-serif text-3xl">{t('faq.title')}</h2>
      </div>
      <div className="grid gap-3">
        {faqs.map(([question, answer]) => (
          <details key={question} className="group rounded-2xl bg-background p-4">
            <summary className="flex cursor-pointer items-center justify-between font-medium">
              {question}
              <span className="ml-3 text-slate-400 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CityCards({ cities }: { cities: City[] }) {
  const { t, loc } = useI18n();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const sorted = [...cities].sort((a, b) => b.toikhanaCount - a.toikhanaCount || a.nameRu.localeCompare(b.nameRu, 'ru'));
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((city) => city.nameRu.toLowerCase().includes(q) || city.nameKk.toLowerCase().includes(q));
  }, [cities, query]);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('cities.eyebrow')}</p>
          <h2 className="font-serif text-3xl">{t('cities.title')}</h2>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('cities.search')}
          className="w-full max-w-xs rounded-full border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-accent"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((city) => (
          <Link
            key={city.id}
            to={`/${city.slug}`}
            className="group rounded-[1.5rem] bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl">{loc(city.nameRu, city.nameKk)}</h3>
                <p className="mt-1 text-sm text-slate-500">{city.toikhanaCount} {t('cities.unit')}</p>
              </div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-primary">
                {city.toikhanaCount}
              </span>
            </div>
          </Link>
        ))}
      </div>
      {!filtered.length ? <EmptyState title={t('cities.notFound')} text={t('cities.notFoundText')} /> : null}
    </section>
  );
}

export function FeaturedToikhanas({ items }: { items: ToikhanaCard[] }) {
  const { t } = useI18n();
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('featured.eyebrow')}</p>
          <h2 className="font-serif text-3xl">{t('featured.title')}</h2>
        </div>
        <Link to="/about" className="text-sm font-medium text-primary hover:underline">
          {t('featured.how')}
        </Link>
      </div>
      <ToikhanaGrid items={items.slice(0, 6)} />
    </section>
  );
}

export function ToyTypes({ toyTypes }: { toyTypes: ToyType[] }) {
  const { t, loc } = useI18n();
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('types.eyebrow')}</p>
        <h2 className="font-serif text-3xl">{t('types.title')}</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {toyTypes.map((toyType) => (
          <span key={toyType.id} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm">
            {loc(toyType.nameRu, toyType.nameKk)}
          </span>
        ))}
      </div>
    </section>
  );
}

export function SEOText() {
  const { t } = useI18n();
  return (
    <section className="rounded-[1.75rem] bg-primary px-6 py-8 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-accent">{t('seo.eyebrow')}</p>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-white/80 md:text-base">{t('seo.body')}</p>
    </section>
  );
}

export function PageHeader({ title, count }: { title: string; count: number }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('catalog.eyebrow')}</p>
        <h1 className="font-serif text-4xl">{title}</h1>
      </div>
      <div className="rounded-full bg-accent/20 px-4 py-2 text-sm font-semibold text-primary">
        {count} {t('catalog.count')}
      </div>
    </div>
  );
}

export function FilterPanel({
  capacity,
  onCapacityChange,
  type,
  onTypeChange
}: {
  capacity: string;
  onCapacityChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
}) {
  const { t } = useI18n();
  const types = [
    { slug: '', label: t('filter.anyType') },
    { slug: 'svadba', label: t('type.svadba') },
    { slug: 'kudalyk', label: t('type.kudalyk') },
    { slug: 'birthday', label: t('type.birthday') },
    { slug: 'corporate', label: t('type.corporate') }
  ];
  return (
    <div className="grid gap-4 rounded-[1.75rem] bg-card p-5 shadow-soft md:grid-cols-2">
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-600">{t('filter.capacity')}</span>
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          value={capacity}
          onChange={(event) => onCapacityChange(event.target.value)}
          placeholder={t('filter.capacityPlaceholder')}
          inputMode="numeric"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-600">{t('filter.type')}</span>
        <select
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-accent"
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
        >
          {types.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function ToikhanaGrid({ items }: { items: ToikhanaCard[] }) {
  const { t } = useI18n();
  if (!items.length) {
    return <EmptyState title={t('card.empty')} text={t('card.emptyText')} />;
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ToikhanaCardItem key={item.id} item={item} />
      ))}
    </div>
  );
}

function ToikhanaCardItem({ item }: { item: ToikhanaCard }) {
  const { t } = useI18n();
  return (
    <Link
      to={`/toikhana/${item.slug}`}
      className="group overflow-hidden rounded-[1.75rem] bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {item.mainPhotoUrl ? (
          <img
            src={item.mainPhotoUrl}
            alt={`${item.name} — ${t('cities.unit')} ${item.cityName}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            {t('card.photoSoon')}
          </div>
        )}
        {item.featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary shadow">
            {t('card.top')}
          </span>
        ) : null}
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="font-serif text-2xl">{item.name}</h3>
          <p className="text-sm text-slate-500">{item.cityName}</p>
        </div>
        <p className="line-clamp-1 text-sm text-slate-600">{item.address}</p>
        <div className="flex flex-wrap gap-2 text-sm text-slate-700">
          {item.capacityMin || item.capacityMax ? (
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {item.capacityMin ?? 0}–{item.capacityMax ?? 0} {t('card.guests')}
            </span>
          ) : null}
          {item.priceMin ? <span className="rounded-full bg-slate-100 px-3 py-1">{t('card.from')} {formatPrice(item.priceMin)} ₸</span> : null}
        </div>
      </div>
    </Link>
  );
}

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const main = photos[0];
  return (
    <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
      <div className="aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-slate-100 md:aspect-auto">
        {main ? <img src={main.url} alt="" className="h-full w-full object-cover" /> : null}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
        {photos.slice(1, 3).map((photo) => (
          <div key={photo.id} className="aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-slate-100 md:aspect-auto">
            <img src={photo.url} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ToikhanaInfo({ item }: { item: ToikhanaCard }) {
  const { t } = useI18n();
  return (
    <div className="rounded-[1.75rem] bg-card p-6 shadow-soft">
      <h2 className="font-serif text-3xl">{item.name}</h2>
      <p className="mt-2 text-slate-500">{item.address}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{item.cityName}</span>
        {item.capacityMin || item.capacityMax ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
            {item.capacityMin ?? 0}–{item.capacityMax ?? 0} {t('card.guests')}
          </span>
        ) : null}
        {item.priceMin ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{t('card.from')} {formatPrice(item.priceMin)} ₸</span>
        ) : null}
      </div>
    </div>
  );
}

export function Description({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-[1.75rem] bg-card p-6 shadow-soft">
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{body}</p>
    </div>
  );
}

export function ToyTypeBadges({ toyTypes }: { toyTypes: ToyType[] }) {
  const { loc } = useI18n();
  return (
    <div className="flex flex-wrap gap-2">
      {toyTypes.map((toyType) => (
        <span key={toyType.id} className="rounded-full bg-accent/20 px-3 py-1 text-sm">
          {loc(toyType.nameRu, toyType.nameKk)}
        </span>
      ))}
    </div>
  );
}

export function ContactButtons({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap gap-3">
      {phone ? (
        <a className="rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110" href={`tel:${phone}`}>
          {t('contact.call')}
        </a>
      ) : null}
      {whatsapp ? (
        <a
          className="rounded-full border border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      ) : null}
    </div>
  );
}

/** Sticky bottom contact bar for mobile on the toikhana page */
export function MobileContactBar({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  const { t } = useI18n();
  if (!phone && !whatsapp) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-7xl gap-3">
        {phone ? (
          <a href={`tel:${phone}`} className="flex-1 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-white">
            {t('contact.call')}
          </a>
        ) : null}
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-full bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function SimilarToikhanas({ items }: { items: ToikhanaCard[] }) {
  const { t } = useI18n();
  if (!items.length) return null;
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-2xl">{t('similar.title')}</h3>
      <ToikhanaGrid items={items.slice(0, 3)} />
    </div>
  );
}

export function BookingForm({
  toikhanaId,
  onSubmit
}: {
  toikhanaId?: number;
  onSubmit: (data: Booking) => Promise<void> | void;
}) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    await onSubmit({
      toikhanaId: toikhanaId ?? Number(data.get('toikhanaId')),
      name: String(data.get('name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      eventDate: String(data.get('eventDate') ?? ''),
      guestsCount: Number(data.get('guestsCount') ?? 0),
      message: String(data.get('message') ?? '')
    });
    form.reset();
    setDone(true);
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft lg:sticky lg:top-28">
      <h3 className="font-serif text-2xl">{t('booking.title')}</h3>
      <input name="toikhanaId" type="hidden" value={toikhanaId ?? ''} readOnly />
      <div className="grid gap-3 md:grid-cols-2">
        <input name="name" required placeholder={t('booking.name')} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" />
        <input name="phone" required placeholder={t('booking.phone')} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" />
        <input name="eventDate" required type="date" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" />
        <input name="guestsCount" required type="number" placeholder={t('booking.guests')} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" />
      </div>
      <textarea name="message" rows={4} placeholder={t('booking.comment')} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" />
      <button className="w-full rounded-full bg-accent px-5 py-3 font-semibold text-primary transition hover:brightness-105" type="submit">
        {t('booking.submit')}
      </button>
      {done ? <p className="text-sm text-emerald-700">{t('booking.done')}</p> : null}
    </form>
  );
}

/** Admin (Basic auth) login form — internal use only. */
export function LoginForm({
  onSubmit
}: {
  onSubmit: (username: string, password: string) => Promise<void> | void;
}) {
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    await onSubmit(String(data.get('username') ?? ''), String(data.get('password') ?? ''));
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft">
      <h3 className="font-serif text-2xl">Войти в админку</h3>
      <input name="username" placeholder="Username" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <input name="password" type="password" placeholder="Password" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <button className="rounded-full bg-primary px-5 py-3 font-semibold text-white" type="submit">
        Войти
      </button>
    </form>
  );
}

const adminInputClass = 'w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent';

/** Labelled field wrapper for the admin forms. */
function AdminField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

export function ToikhanaForm({
  cities,
  toyTypes,
  onSubmit
}: {
  cities: City[];
  toyTypes: ToyType[];
  onSubmit: (payload: Record<string, unknown>) => Promise<void> | void;
}) {
  const { loc } = useI18n();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [selectedToyTypes, setSelectedToyTypes] = useState<number[]>([]);
  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => a.nameRu.localeCompare(b.nameRu, 'ru')),
    [cities]
  );

  const handleName = (value: string) => {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  };

  const toggleToyType = (id: number) => {
    setSelectedToyTypes((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const reset = (form: HTMLFormElement) => {
    form.reset();
    setName('');
    setSlug('');
    setSlugEdited(false);
    setSelectedToyTypes([]);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    await onSubmit({
      cityId: Number(data.get('cityId') ?? 0),
      name: name.trim(),
      slug: slug.trim(),
      descriptionKk: String(data.get('descriptionKk') ?? ''),
      descriptionRu: String(data.get('descriptionRu') ?? ''),
      address: String(data.get('address') ?? ''),
      phone: String(data.get('phone') ?? ''),
      whatsapp: String(data.get('whatsapp') ?? ''),
      capacityMin: parseOptionalNumber(data.get('capacityMin')),
      capacityMax: parseOptionalNumber(data.get('capacityMax')),
      priceMin: parseOptionalNumber(data.get('priceMin')),
      priceMax: parseOptionalNumber(data.get('priceMax')),
      active: data.get('active') === 'on',
      featured: data.get('featured') === 'on',
      toyTypeIds: selectedToyTypes
    });
    reset(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft">
      <h3 className="font-serif text-2xl">Добавить тойхану</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Город">
          <select name="cityId" required defaultValue="" className={`${adminInputClass} bg-white`}>
            <option value="" disabled>Выберите город</option>
            {sortedCities.map((city) => (
              <option key={city.id} value={city.id}>{loc(city.nameRu, city.nameKk)}</option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Название">
          <input required value={name} onChange={(e) => handleName(e.target.value)} placeholder="Напр. Aq Orda Hall" className={adminInputClass} />
        </AdminField>
        <AdminField label="Адрес в строке (slug)">
          <input
            required
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
            placeholder="aq-orda-hall"
            className={adminInputClass}
          />
        </AdminField>
        <AdminField label="Адрес">
          <input name="address" placeholder="Город, улица" className={adminInputClass} />
        </AdminField>
        <AdminField label="Телефон">
          <input name="phone" placeholder="+7 (700) 000-00-00" className={adminInputClass} />
        </AdminField>
        <AdminField label="WhatsApp">
          <input name="whatsapp" placeholder="+77000000000" className={adminInputClass} />
        </AdminField>
        <AdminField label="Мин. вместимость">
          <input name="capacityMin" type="number" min={0} placeholder="50" className={adminInputClass} />
        </AdminField>
        <AdminField label="Макс. вместимость">
          <input name="capacityMax" type="number" min={0} placeholder="300" className={adminInputClass} />
        </AdminField>
        <AdminField label="Цена от, ₸">
          <input name="priceMin" type="number" min={0} placeholder="90000" className={adminInputClass} />
        </AdminField>
        <AdminField label="Цена до, ₸">
          <input name="priceMax" type="number" min={0} placeholder="450000" className={adminInputClass} />
        </AdminField>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-slate-600">Типы тоя</span>
        <div className="flex flex-wrap gap-2">
          {toyTypes.length === 0 ? (
            <span className="text-sm text-slate-400">Список типов загружается…</span>
          ) : (
            toyTypes.map((toyType) => {
              const checked = selectedToyTypes.includes(toyType.id);
              return (
                <button
                  key={toyType.id}
                  type="button"
                  onClick={() => toggleToyType(toyType.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    checked ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-primary'
                  }`}
                >
                  {loc(toyType.nameRu, toyType.nameKk)}
                </button>
              );
            })
          )}
        </div>
      </div>

      <AdminField label="Описание (KZ)">
        <textarea name="descriptionKk" rows={3} placeholder="Той өткізуге арналған зал…" className={adminInputClass} />
      </AdminField>
      <AdminField label="Описание (RU)">
        <textarea name="descriptionRu" rows={3} placeholder="Уютный зал для проведения тоя…" className={adminInputClass} />
      </AdminField>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input name="active" type="checkbox" defaultChecked /> Активна (видна в каталоге)</label>
        <label className="flex items-center gap-2"><input name="featured" type="checkbox" /> В топе</label>
      </div>
      <button className="rounded-full bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark" type="submit">
        Сохранить
      </button>
    </form>
  );
}

export function Import2gisForm({
  cities,
  onSubmit,
  pending,
  result,
  error
}: {
  cities: City[];
  onSubmit: (payload: {
    url: string;
    cityId: number;
    active: boolean;
    withPhotos: boolean;
    maxRecords?: number;
  }) => Promise<void> | void;
  pending?: boolean;
  result?: { parsed: number; sent: number; toikhana: { created: number; skipped: number; photosDownloaded: number } } | null;
  error?: string | null;
}) {
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const maxRecordsRaw = data.get('maxRecords');
    await onSubmit({
      url: String(data.get('url') ?? '').trim(),
      cityId: Number(data.get('cityId') ?? 0),
      active: data.get('active') === 'on',
      withPhotos: data.get('withPhotos') === 'on',
      maxRecords: maxRecordsRaw ? Number(maxRecordsRaw) : undefined
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft">
      <div>
        <h3 className="font-serif text-2xl">Импорт из 2GIS</h3>
        <p className="mt-1 text-sm text-slate-500">
          Вставьте ссылку на выдачу 2GIS — организации и фотографии добавятся автоматически.
        </p>
      </div>
      <input
        name="url"
        required
        placeholder="https://2gis.kz/astana/search/тойхана"
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
      />
      <div className="grid gap-3 md:grid-cols-2">
        <select name="cityId" required defaultValue="" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-accent">
          <option value="" disabled>Выберите город</option>
          {[...cities].sort((a, b) => a.nameRu.localeCompare(b.nameRu, 'ru')).map((city) => (
            <option key={city.id} value={city.id}>{city.nameRu}</option>
          ))}
        </select>
        <input
          name="maxRecords"
          type="number"
          min={1}
          placeholder="Лимит записей (необязательно)"
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
        />
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input name="active" type="checkbox" defaultChecked /> Сразу активные</label>
        <label className="flex items-center gap-2"><input name="withPhotos" type="checkbox" defaultChecked /> Скачивать фото</label>
      </div>
      <button
        disabled={pending}
        className="rounded-full bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
        type="submit"
      >
        {pending ? 'Импорт идёт…' : 'Импортировать'}
      </button>
      {pending ? (
        <p className="text-sm text-slate-500">Парсер открывает 2GIS в браузере — это может занять пару минут.</p>
      ) : null}
      {result ? (
        <p className="text-sm text-emerald-700">
          Готово: найдено {result.parsed}, создано {result.toikhana.created}, пропущено {result.toikhana.skipped}, фото {result.toikhana.photosDownloaded}.
        </p>
      ) : null}
      {error ? <p className="text-sm text-red-600">Ошибка: {error}</p> : null}
    </form>
  );
}

export function PhotoUpload({
  toikhanas,
  onSubmit
}: {
  toikhanas: ToikhanaCard[];
  onSubmit: (payload: { toikhanaId: number; file: File; isMain: boolean; sortOrder?: number }) => Promise<void> | void;
}) {
  const sorted = useMemo(
    () => [...toikhanas].sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    [toikhanas]
  );
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get('file');
    if (!(file instanceof File)) return;
    await onSubmit({
      toikhanaId: Number(data.get('toikhanaId') ?? 0),
      file,
      isMain: data.get('isMain') === 'on',
      sortOrder: data.get('sortOrder') ? Number(data.get('sortOrder')) : undefined
    });
    form.reset();
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft">
      <h3 className="font-serif text-2xl">Загрузка фото</h3>
      <AdminField label="Тойхана">
        <select name="toikhanaId" required defaultValue="" className={`${adminInputClass} bg-white`}>
          <option value="" disabled>Выберите тойхану</option>
          {sorted.map((toikhana) => (
            <option key={toikhana.id} value={toikhana.id}>
              {toikhana.name} — {toikhana.cityName}
            </option>
          ))}
        </select>
      </AdminField>
      <AdminField label="Файл">
        <input name="file" type="file" accept="image/*" required className={adminInputClass} />
      </AdminField>
      <AdminField label="Порядок (необязательно)">
        <input name="sortOrder" type="number" min={0} placeholder="0" className={adminInputClass} />
      </AdminField>
      <label className="flex items-center gap-2 text-sm"><input name="isMain" type="checkbox" /> Главное фото</label>
      <button className="rounded-full bg-accent px-5 py-3 font-semibold text-primary transition hover:brightness-105" type="submit">
        Загрузить
      </button>
    </form>
  );
}

export function BookingList({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="space-y-3">
      {bookings.map((booking, index) => (
        <div key={booking.id ?? index} className="rounded-2xl bg-card p-4 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <strong>{booking.name}</strong>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{booking.status ?? 'new'}</span>
          </div>
          <p className="text-sm text-slate-600">{booking.phone}</p>
          <p className="text-sm text-slate-600">{booking.eventDate}</p>
        </div>
      ))}
    </div>
  );
}

export function Pagination({
  current,
  total,
  onChange
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, index) => index + 1);
  return (
    <div className="flex flex-wrap gap-2">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          className={`rounded-full px-4 py-2 text-sm ${page === current ? 'bg-primary text-white' : 'bg-white text-primary'}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </div>
  );
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (value === null || value === '') return undefined;
  return Number(value);
}

const TRANSLIT: Record<string, string> = {
  а: 'a', ә: 'a', б: 'b', в: 'v', г: 'g', ғ: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'i', к: 'k', қ: 'q', л: 'l', м: 'm', н: 'n', ң: 'n', о: 'o', ө: 'o', п: 'p',
  р: 'r', с: 's', т: 't', у: 'u', ұ: 'u', ү: 'u', ф: 'f', х: 'h', һ: 'h', ц: 'ts', ч: 'ch',
  ш: 'sh', щ: 'sch', ъ: '', ы: 'y', і: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya'
};

/** Builds a URL-safe slug from a (Cyrillic/Kazakh or Latin) name. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .split('')
    .map((ch) => (ch in TRANSLIT ? TRANSLIT[ch] : ch))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
