// Static list of catalog cities, kept in sync with DataLoader.ensureCity(...)
// in the backend. Used ONLY at build time by prerender.mjs to emit a crawlable
// HTML page per city (its own <title>/<meta>/JSON-LD) so each city can rank for
// "тойхана <город>". The live toikhana list still loads client-side at runtime.
export const CITY_SEED = [
  { slug: 'astana', nameKk: 'Астана', nameRu: 'Астана' },
  { slug: 'almaty', nameKk: 'Алматы', nameRu: 'Алматы' },
  { slug: 'shymkent', nameKk: 'Шымкент', nameRu: 'Шымкент' },
  { slug: 'karaganda', nameKk: 'Қарағанды', nameRu: 'Караганда' },
  { slug: 'aktobe', nameKk: 'Ақтөбе', nameRu: 'Актобе' },
  { slug: 'taraz', nameKk: 'Тараз', nameRu: 'Тараз' },
  { slug: 'pavlodar', nameKk: 'Павлодар', nameRu: 'Павлодар' },
  { slug: 'ust-kamenogorsk', nameKk: 'Өскемен', nameRu: 'Усть-Каменогорск' },
  { slug: 'semey', nameKk: 'Семей', nameRu: 'Семей' },
  { slug: 'atyrau', nameKk: 'Атырау', nameRu: 'Атырау' },
  { slug: 'kostanay', nameKk: 'Қостанай', nameRu: 'Костанай' },
  { slug: 'kyzylorda', nameKk: 'Қызылорда', nameRu: 'Кызылорда' },
  { slug: 'uralsk', nameKk: 'Орал', nameRu: 'Уральск' },
  { slug: 'petropavlovsk', nameKk: 'Петропавл', nameRu: 'Петропавловск' },
  { slug: 'aktau', nameKk: 'Ақтау', nameRu: 'Актау' },
  { slug: 'temirtau', nameKk: 'Теміртау', nameRu: 'Темиртау' },
  { slug: 'turkestan', nameKk: 'Түркістан', nameRu: 'Туркестан' },
  { slug: 'kokshetau', nameKk: 'Көкшетау', nameRu: 'Кокшетау' },
  { slug: 'taldykorgan', nameKk: 'Талдықорған', nameRu: 'Талдыкорган' },
  { slug: 'ekibastuz', nameKk: 'Екібастұз', nameRu: 'Экибастуз' },
  { slug: 'rudny', nameKk: 'Рудный', nameRu: 'Рудный' },
  { slug: 'zhezkazgan', nameKk: 'Жезқазған', nameRu: 'Жезказган' },
  { slug: 'konaev', nameKk: 'Қонаев', nameRu: 'Конаев' }
];
