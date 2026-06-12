import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Booking, City, Photo, ToikhanaCard, ToyType } from '../types';

export { Seo, organizationJsonLd, breadcrumbJsonLd, canonicalUrl } from './Seo';

const NAV_LINKS = [
  { to: '/', label: 'Главная' },
  { to: '/blog', label: 'Блог' },
  { to: '/add-toikhana', label: 'Разместить тойхану' },
  { to: '/about', label: 'О проекте' },
  { to: '/contacts', label: 'Контакты' }
];

export function formatPrice(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  return value.toLocaleString('ru-RU').replace(/,/g, ' ');
}

function topCities(cities: City[], limit = 8) {
  return [...cities].sort((a, b) => b.toikhanaCount - a.toikhanaCount).slice(0, limit);
}

export function SiteHeader({ cities }: { cities: City[] }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const strip = useMemo(() => topCities(cities), [cities]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">
            TK
          </div>
          <div>
            <div className="font-serif text-lg leading-none">toikhana.kz</div>
            <div className="text-xs text-slate-500">Каталог тойхан Казахстана</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.filter((link) => link.to !== '/').map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm transition hover:text-primary ${
                location.pathname === link.to ? 'font-semibold text-primary' : 'text-slate-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Войти
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Меню"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-primary md:hidden"
        >
          <span className="sr-only">Меню</span>
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

      {/* City quick-strip (desktop + mobile horizontal scroll) */}
      <div className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 text-sm md:px-8">
          <Link to="/" className="whitespace-nowrap rounded-full bg-white px-4 py-2 font-medium shadow-sm">
            Все города
          </Link>
          {strip.map((city) => (
            <Link
              key={city.id}
              to={`/${city.slug}`}
              className="whitespace-nowrap rounded-full bg-white px-4 py-2 shadow-sm transition hover:text-primary"
            >
              {city.nameRu}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-2xl bg-primary px-4 py-3 text-center text-base font-semibold text-white"
            >
              Войти
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function SiteFooter({ cities }: { cities: City[] }) {
  const footerCities = useMemo(() => topCities(cities, 10), [cities]);
  return (
    <footer className="mt-16 border-t border-slate-200 bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-8">
        <div className="space-y-3">
          <div className="font-serif text-2xl">toikhana.kz</div>
          <p className="text-sm leading-6 text-white/75">
            Каталог тойхан Казахстана. Ищите залы по городу, вместимости и цене, сравнивайте и оставляйте заявки.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Навигация</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link to="/blog" className="hover:text-accent">Блог</Link></li>
            <li><Link to="/about" className="hover:text-accent">О проекте</Link></li>
            <li><Link to="/contacts" className="hover:text-accent">Контакты</Link></li>
            <li><Link to="/add-toikhana" className="hover:text-accent">Разместить тойхану</Link></li>
            <li><Link to="/login" className="hover:text-accent">Войти</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Города</h4>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/75">
            {footerCities.map((city) => (
              <li key={city.id}><Link to={`/${city.slug}`} className="hover:text-accent">{city.nameRu}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Связь</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><a href="mailto:hello@toikhana.kz" className="hover:text-accent">hello@toikhana.kz</a></li>
            <li><a href="https://wa.me/77000000000" target="_blank" rel="noreferrer" className="hover:text-accent">WhatsApp</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-accent">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-white/50 md:px-8">
          © {new Date().getFullYear()} toikhana.kz — все города Казахстана
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
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-white shadow-soft md:px-10 md:py-16">
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top_right,_#e8b86d_0,_transparent_35%),radial-gradient(circle_at_bottom_left,_#ffffff_0,_transparent_28%)]" />
      <div className="relative grid gap-8 md:grid-cols-[1.25fr_0.75fr] md:items-center">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-accent/80">toikhana.kz</p>
          <h1 className="font-serif text-4xl leading-tight md:text-6xl">
            Найдите тойхану мечты по всему Казахстану
          </h1>
          <p className="max-w-2xl text-base text-white/80 md:text-lg">
            Сравнивайте банкетные залы по городу, вместимости и цене. Оставьте заявку или сразу свяжитесь
            с владельцем — бесплатно.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/add-toikhana" className="rounded-full bg-accent px-5 py-3 font-semibold text-primary transition hover:brightness-105">
              Разместить тойхану
            </Link>
            <Link to="/about" className="rounded-full border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
              Как это работает
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
          <label className="mb-2 block text-sm text-white/75" htmlFor="hero-city">Выберите город</label>
          <select
            id="hero-city"
            className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-primary outline-none focus:ring-2 focus:ring-accent"
            value={selectedCity ?? ''}
            onChange={(event) => onCityChange(event.target.value)}
          >
            <option value="">Все города</option>
            {[...cities].sort((a, b) => a.nameRu.localeCompare(b.nameRu, 'ru')).map((city) => (
              <option key={city.id} value={city.slug}>
                {city.nameRu}
              </option>
            ))}
          </select>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-white/80">
            <div className="rounded-2xl bg-white/10 p-4">Быстрый поиск</div>
            <div className="rounded-2xl bg-white/10 p-4">Заявка за 1 минуту</div>
            <div className="rounded-2xl bg-white/10 p-4">Звонок / WhatsApp</div>
            <div className="rounded-2xl bg-white/10 p-4">{cities.length}+ городов</div>
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
  const stats = [
    { label: 'Городов в базе', value: String(cities.length) },
    { label: 'Тойхан в каталоге', value: String(toikhanasCount) },
    { label: 'Топ-объектов', value: String(featuredCount) }
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
  const steps = [
    'Выберите город и формат тоя',
    'Сравните залы по фото, вместимости и цене',
    'Позвоните или оставьте заявку владельцу'
  ];
  return (
    <section className="space-y-5 rounded-[1.75rem] bg-card p-6 shadow-soft">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Как это работает</p>
        <h2 className="font-serif text-3xl">3 шага до зала</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="rounded-2xl bg-slate-50 p-5">
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
  return (
    <section className="grid gap-6 rounded-[2rem] bg-accent px-6 py-8 text-primary md:grid-cols-[1.2fr_0.8fr] md:px-10">
      <div>
        <p className="text-sm uppercase tracking-[0.3em]">Для владельцев</p>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl">Разместите свою тойхану бесплатно</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-primary/80">
          Получайте заявки из каталога, показывайте фото и увеличивайте бронирования. Для старта
          достаточно оставить контакты и данные о зале.
        </p>
      </div>
      <div className="flex items-end md:justify-end">
        <Link to="/add-toikhana" className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:brightness-110">
          Подать заявку
        </Link>
      </div>
    </section>
  );
}

export function FAQ() {
  const faqs = [
    ['Как забронировать зал?', 'Выберите зал, свяжитесь с владельцем и оставьте заявку через форму.'],
    ['Это бесплатно?', 'Для гостей да. Для владельцев есть отдельная заявка на размещение.'],
    ['Есть ли фото?', 'Да, в карточках и на странице зала.'],
    ['Можно ли искать по вместимости?', 'Да, это основной фильтр каталога.'],
    ['В каких городах вы работаете?', 'По всем крупным городам Казахстана — от Астаны и Алматы до областных центров.']
  ];
  return (
    <section className="space-y-5 rounded-[1.75rem] bg-card p-6 shadow-soft">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">FAQ</p>
        <h2 className="font-serif text-3xl">Частые вопросы</h2>
      </div>
      <div className="grid gap-3">
        {faqs.map(([question, answer]) => (
          <details key={question} className="group rounded-2xl bg-slate-50 p-4">
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
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Города</p>
          <h2 className="font-serif text-3xl">Начните с города</h2>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Поиск города…"
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
                <h3 className="font-serif text-2xl">{city.nameRu}</h3>
                <p className="mt-1 text-sm text-slate-500">{city.toikhanaCount} тойхана</p>
              </div>
              <span className="rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-primary">
                {city.toikhanaCount}
              </span>
            </div>
          </Link>
        ))}
      </div>
      {!filtered.length ? <EmptyState title="Город не найден" text="Попробуйте изменить запрос." /> : null}
    </section>
  );
}

export function FeaturedToikhanas({ items }: { items: ToikhanaCard[] }) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Топ</p>
          <h2 className="font-serif text-3xl">Выбор редакции</h2>
        </div>
        <Link to="/about" className="text-sm font-medium text-primary hover:underline">
          Как выбираем
        </Link>
      </div>
      <ToikhanaGrid items={items.slice(0, 6)} />
    </section>
  );
}

export function ToyTypes({ toyTypes }: { toyTypes: ToyType[] }) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Форматы</p>
        <h2 className="font-serif text-3xl">Для какого тоя?</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {toyTypes.map((toyType) => (
          <span key={toyType.id} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm">
            {toyType.nameRu}
          </span>
        ))}
      </div>
    </section>
  );
}

export function SEOText() {
  return (
    <section className="rounded-[1.75rem] bg-primary px-6 py-8 text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-accent/80">О каталоге</p>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-white/80 md:text-base">
        toikhana.kz помогает быстро найти тойханы и банкетные залы по всем городам Казахстана: Астана, Алматы,
        Шымкент, Караганда, Актобе, Атырау и другие. Фильтруйте по вместимости, цене и типу торжества — свадьба,
        день рождения, корпоратив или сватовство. Каталог одинаково удобен и для гостей, и для владельцев залов.
      </p>
    </section>
  );
}

export function PageHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Каталог</p>
        <h1 className="font-serif text-4xl">{title}</h1>
      </div>
      <div className="rounded-full bg-accent/15 px-4 py-2 text-sm font-semibold text-primary">
        {count} вариантов
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
  const types = [
    { slug: '', label: 'Любой тип' },
    { slug: 'svadba', label: 'Свадьба' },
    { slug: 'kudalyk', label: 'Сватовство' },
    { slug: 'birthday', label: 'День рождения' },
    { slug: 'corporate', label: 'Корпоратив' }
  ];
  return (
    <div className="grid gap-4 rounded-[1.75rem] bg-card p-5 shadow-soft md:grid-cols-2">
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-600">Вместимость (гостей)</span>
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          value={capacity}
          onChange={(event) => onCapacityChange(event.target.value)}
          placeholder="Например 200"
          inputMode="numeric"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-600">Тип тоя</span>
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
  if (!items.length) {
    return <EmptyState title="Ничего не найдено" text="Попробуйте другой город или фильтр." />;
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
  return (
    <Link
      to={`/toikhana/${item.slug}`}
      className="group overflow-hidden rounded-[1.75rem] bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {item.mainPhotoUrl ? (
          <img
            src={item.mainPhotoUrl}
            alt={`${item.name} — тойхана в городе ${item.cityName}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            Фото скоро появится
          </div>
        )}
        {item.featured ? (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary shadow">
            Топ
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
              {item.capacityMin ?? 0}–{item.capacityMax ?? 0} гостей
            </span>
          ) : null}
          {item.priceMin ? <span className="rounded-full bg-slate-100 px-3 py-1">от {formatPrice(item.priceMin)} ₸</span> : null}
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
  return (
    <div className="rounded-[1.75rem] bg-card p-6 shadow-soft">
      <h2 className="font-serif text-3xl">{item.name}</h2>
      <p className="mt-2 text-slate-500">{item.address}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{item.cityName}</span>
        {item.capacityMin || item.capacityMax ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
            {item.capacityMin ?? 0}–{item.capacityMax ?? 0} гостей
          </span>
        ) : null}
        {item.priceMin ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">от {formatPrice(item.priceMin)} ₸</span>
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
  return (
    <div className="flex flex-wrap gap-2">
      {toyTypes.map((toyType) => (
        <span key={toyType.id} className="rounded-full bg-accent/15 px-3 py-1 text-sm">
          {toyType.nameRu}
        </span>
      ))}
    </div>
  );
}

export function ContactButtons({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      {phone ? (
        <a className="rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110" href={`tel:${phone}`}>
          Позвонить
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
  if (!phone && !whatsapp) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-7xl gap-3">
        {phone ? (
          <a href={`tel:${phone}`} className="flex-1 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-white">
            Позвонить
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
  if (!items.length) return null;
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-2xl">Похожие тойханы</h3>
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
      <h3 className="font-serif text-2xl">Оставить заявку</h3>
      <input name="toikhanaId" type="hidden" value={toikhanaId ?? ''} readOnly />
      <div className="grid gap-3 md:grid-cols-2">
        <input name="name" required placeholder="Ваше имя" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" />
        <input name="phone" required placeholder="Телефон" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" />
        <input name="eventDate" required type="date" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" />
        <input name="guestsCount" required type="number" placeholder="Количество гостей" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" />
      </div>
      <textarea name="message" rows={4} placeholder="Комментарий" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent" />
      <button className="w-full rounded-full bg-accent px-5 py-3 font-semibold text-primary transition hover:brightness-105" type="submit">
        Отправить заявку
      </button>
      {done ? <p className="text-sm text-emerald-700">Заявка отправлена! Владелец свяжется с вами.</p> : null}
    </form>
  );
}

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

export function ToikhanaForm({
  onSubmit
}: {
  onSubmit: (payload: Record<string, unknown>) => Promise<void> | void;
}) {
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const toyTypeIds = String(data.get('toyTypeIds') ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => Number(value));

    await onSubmit({
      cityId: Number(data.get('cityId') ?? 0),
      name: String(data.get('name') ?? ''),
      slug: String(data.get('slug') ?? ''),
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
      toyTypeIds
    });
    form.reset();
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft">
      <h3 className="font-serif text-2xl">Добавить тойхану</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <input name="cityId" type="number" required placeholder="City ID" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="name" required placeholder="Название" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="slug" required placeholder="Slug" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="address" placeholder="Адрес" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="phone" placeholder="Телефон" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="whatsapp" placeholder="WhatsApp" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="capacityMin" type="number" placeholder="Мин. вместимость" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="capacityMax" type="number" placeholder="Макс. вместимость" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="priceMin" type="number" placeholder="Цена от" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="priceMax" type="number" placeholder="Цена до" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="toyTypeIds" placeholder="ID типов тоя через запятую" className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" />
      </div>
      <textarea name="descriptionKk" rows={3} placeholder="Описание KK" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <textarea name="descriptionRu" rows={3} placeholder="Описание RU" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input name="active" type="checkbox" defaultChecked /> Активна</label>
        <label className="flex items-center gap-2"><input name="featured" type="checkbox" /> В топе</label>
      </div>
      <button className="rounded-full bg-primary px-5 py-3 font-semibold text-white" type="submit">
        Сохранить
      </button>
    </form>
  );
}

export function PhotoUpload({
  onSubmit
}: {
  onSubmit: (payload: { toikhanaId: number; file: File; isMain: boolean; sortOrder?: number }) => Promise<void> | void;
}) {
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
      <input name="toikhanaId" type="number" required placeholder="Toikhana ID" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <input name="file" type="file" accept="image/*" required className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <input name="sortOrder" type="number" placeholder="Порядок" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <label className="flex items-center gap-2 text-sm"><input name="isMain" type="checkbox" /> Главное фото</label>
      <button className="rounded-full bg-accent px-5 py-3 font-semibold text-primary" type="submit">
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
