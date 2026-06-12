import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Booking, City, Photo, ToikhanaCard, ToyType } from '../types';

export function SiteHeader({ cities }: { cities: City[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">
            TK
          </div>
          <div>
            <div className="font-serif text-lg leading-none">toikhana.kz</div>
            <div className="text-xs text-slate-500">Тойхана каталогы</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          <Link to="/add-toikhana" className="text-sm text-slate-600 hover:text-primary">
            Разместить тойхану
          </Link>
          <Link to="/about" className="text-sm text-slate-600 hover:text-primary">
            О проекте
          </Link>
          <Link to="/contacts" className="text-sm text-slate-600 hover:text-primary">
            Контакты
          </Link>
          <Link to="/login" className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary">
            Войти
          </Link>
        </nav>
      </div>
      <div className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-3 text-sm md:px-8">
          <Link to="/" className="whitespace-nowrap rounded-full bg-white px-4 py-2 shadow-sm">
            Все города
          </Link>
          {cities.slice(0, 6).map((city) => (
            <Link key={city.id} to={`/${city.slug}`} className="whitespace-nowrap rounded-full bg-white px-4 py-2 shadow-sm">
              {city.nameRu}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ cities }: { cities: City[] }) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 md:px-8">
        <div className="space-y-3">
          <div className="font-serif text-2xl">toikhana.kz</div>
          <p className="text-sm leading-6 text-white/75">
            Каталог тойхан Казахстана. Ищите залы, сравнивайте, звоните и оставляйте заявки.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Навигация</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link to="/about">О проекте</Link></li>
            <li><Link to="/contacts">Контакты</Link></li>
            <li><Link to="/add-toikhana">Разместить тойхану</Link></li>
            <li><Link to="/login">Войти</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Города</h4>
          <ul className="space-y-2 text-sm text-white/75">
            {cities.slice(0, 6).map((city) => (
              <li key={city.id}><Link to={`/${city.slug}`}>{city.nameRu}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Связь</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><a href="mailto:hello@toikhana.kz">hello@toikhana.kz</a></li>
            <li><a href="https://wa.me/77000000000" target="_blank" rel="noreferrer">WhatsApp</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
          </ul>
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
            Тойхана таңдауды проще и быстрее
          </h1>
          <p className="max-w-2xl text-base text-white/80 md:text-lg">
            Сравните банкетные залы по городу, вместимости и цене. Оставьте заявку или
            сразу свяжитесь с владельцем.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/add-toikhana" className="rounded-full bg-accent px-5 py-3 font-semibold text-primary">
              Разместить тойхану
            </Link>
            <Link to="/about" className="rounded-full border border-white/30 px-5 py-3 font-semibold text-white">
              Как это работает
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
          <label className="mb-2 block text-sm text-white/75">Выберите город</label>
          <select
            className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-primary outline-none"
            value={selectedCity ?? ''}
            onChange={(event) => onCityChange(event.target.value)}
          >
            <option value="">Все города</option>
            {cities.map((city) => (
              <option key={city.id} value={city.slug}>
                {city.nameRu}
              </option>
            ))}
          </select>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-white/80">
            <div className="rounded-2xl bg-white/10 p-4">Быстрый поиск</div>
            <div className="rounded-2xl bg-white/10 p-4">Заявка за 1 минуту</div>
            <div className="rounded-2xl bg-white/10 p-4">Звонок / WhatsApp</div>
            <div className="rounded-2xl bg-white/10 p-4">Каталог залов</div>
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
        <Link to="/add-toikhana" className="rounded-full bg-primary px-6 py-3 font-semibold text-white">
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
    ['Вы работаете только по Казахстану?', 'Да, сейчас фокус на городах Казахстана.']
  ];
  return (
    <section className="space-y-5 rounded-[1.75rem] bg-card p-6 shadow-soft">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">FAQ</p>
        <h2 className="font-serif text-3xl">Частые вопросы</h2>
      </div>
      <div className="grid gap-3">
        {faqs.map(([question, answer]) => (
          <details key={question} className="rounded-2xl bg-slate-50 p-4">
            <summary className="cursor-pointer font-medium">{question}</summary>
            <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CityCards({ cities }: { cities: City[] }) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Города</p>
        <h2 className="font-serif text-3xl">Начните с города</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <Link
            key={city.id}
            to={`/${city.slug}`}
            className="group rounded-[1.75rem] bg-card p-6 shadow-soft transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Город</p>
                <h3 className="font-serif text-2xl">{city.nameRu}</h3>
              </div>
              <div className="rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-primary">
                {city.toikhanaCount}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">Тойханалар в базе</p>
          </Link>
        ))}
      </div>
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
        <Link to="/about" className="text-sm font-medium text-primary">
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
      <p className="text-sm uppercase tracking-[0.3em] text-accent/80">SEO</p>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-white/80 md:text-base">
        toikhana.kz помогает быстро найти тойханы по городам Казахстана, вместимости, цене и типу
        торжества. Каталог полезен и для гостей, и для владельцев банкетных залов.
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
  return (
    <div className="grid gap-4 rounded-[1.75rem] bg-card p-5 shadow-soft md:grid-cols-2">
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-600">Вместимость</span>
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
        <input
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
          placeholder="svadba / birthday"
        />
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
      className="overflow-hidden rounded-[1.75rem] bg-card shadow-soft transition hover:-translate-y-1"
    >
      <div className="aspect-[4/3] w-full bg-slate-100">
        {item.mainPhotoUrl ? (
          <img src={item.mainPhotoUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            Фото скоро появится
          </div>
        )}
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl">{item.name}</h3>
            <p className="text-sm text-slate-500">{item.cityName}</p>
          </div>
          {item.featured ? (
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold">Топ</span>
          ) : null}
        </div>
        <p className="text-sm text-slate-600">{item.address}</p>
        <div className="flex flex-wrap gap-2 text-sm text-slate-700">
          {item.capacityMin || item.capacityMax ? (
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {item.capacityMin ?? 0}-{item.capacityMax ?? 0} гостей
            </span>
          ) : null}
          {item.priceMin ? <span className="rounded-full bg-slate-100 px-3 py-1">от {item.priceMin} тг</span> : null}
        </div>
      </div>
    </Link>
  );
}

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const main = photos[0];
  return (
    <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
      <div className="overflow-hidden rounded-[1.75rem] bg-slate-100">
        {main ? <img src={main.url} alt="" className="h-full w-full object-cover" /> : null}
      </div>
      <div className="grid gap-3">
        {photos.slice(1, 3).map((photo) => (
          <div key={photo.id} className="overflow-hidden rounded-[1.5rem] bg-slate-100">
            <img src={photo.url} alt="" className="h-full w-full object-cover" />
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
            {item.capacityMin ?? 0}-{item.capacityMax ?? 0} гостей
          </span>
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
        <a className="rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white" href={`tel:${phone}`}>
          Позвонить
        </a>
      ) : null}
      {whatsapp ? (
        <a
          className="rounded-full border border-primary px-4 py-3 text-sm font-semibold text-primary"
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

export function SimilarToikhanas({ items }: { items: ToikhanaCard[] }) {
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
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[1.75rem] bg-card p-6 shadow-soft">
      <h3 className="font-serif text-2xl">Оставить заявку</h3>
      <input name="toikhanaId" type="hidden" value={toikhanaId ?? ''} readOnly />
      <div className="grid gap-3 md:grid-cols-2">
        <input name="name" required placeholder="Ваше имя" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="phone" required placeholder="Телефон" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="eventDate" required type="date" className="rounded-2xl border border-slate-200 px-4 py-3" />
        <input name="guestsCount" required type="number" placeholder="Количество гостей" className="rounded-2xl border border-slate-200 px-4 py-3" />
      </div>
      <textarea name="message" rows={4} placeholder="Комментарий" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
      <button className="rounded-full bg-accent px-5 py-3 font-semibold text-primary" type="submit">
        Отправить заявку
      </button>
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
