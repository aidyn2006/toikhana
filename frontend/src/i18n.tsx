import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type Lang = 'ru' | 'kk';

const STORAGE_KEY = 'toikhana.lang';

type Dict = Record<string, string>;

const ru: Dict = {
  'lang.ru': 'Рус',
  'lang.kk': 'Қаз',

  'nav.home': 'Главная',
  'nav.blog': 'Блог',
  'nav.add': 'Разместить тойхану',
  'nav.about': 'О проекте',
  'nav.contacts': 'Контакты',
  'nav.login': 'Войти',
  'nav.register': 'Регистрация',
  'nav.account': 'Кабинет',
  'nav.logout': 'Выйти',
  'nav.allCities': 'Все города',
  'nav.menu': 'Меню',
  'header.subtitle': 'Каталог тойхан Казахстана',

  'hero.title': 'Найдите тойхану мечты по всему Казахстану',
  'hero.subtitle':
    'Сравнивайте банкетные залы по городу, вместимости и цене. Оставьте заявку или свяжитесь с владельцем — бесплатно.',
  'hero.cta.add': 'Разместить тойхану',
  'hero.cta.how': 'Как это работает',
  'hero.selectCity': 'Выберите город',
  'hero.feature.search': 'Быстрый поиск',
  'hero.feature.fast': 'Заявка за 1 минуту',
  'hero.feature.call': 'Звонок / WhatsApp',
  'hero.feature.cities': 'городов',

  'trust.cities': 'Городов в базе',
  'trust.toikhanas': 'Тойхан в каталоге',
  'trust.featured': 'Топ-объектов',

  'how.eyebrow': 'Как это работает',
  'how.title': '3 шага до зала',
  'how.step1': 'Выберите город и формат тоя',
  'how.step2': 'Сравните залы по фото, вместимости и цене',
  'how.step3': 'Позвоните или оставьте заявку владельцу',

  'owner.eyebrow': 'Для владельцев',
  'owner.title': 'Разместите свою тойхану бесплатно',
  'owner.text':
    'Получайте заявки из каталога, показывайте фото и увеличивайте бронирования. Для старта достаточно оставить контакты и данные о зале.',
  'owner.button': 'Подать заявку',

  'faq.eyebrow': 'Вопросы',
  'faq.title': 'Частые вопросы',
  'faq.q1': 'Как забронировать зал?',
  'faq.a1': 'Выберите зал, свяжитесь с владельцем и оставьте заявку через форму.',
  'faq.q2': 'Это бесплатно?',
  'faq.a2': 'Для гостей да. Для владельцев есть отдельная заявка на размещение.',
  'faq.q3': 'Есть ли фото?',
  'faq.a3': 'Да, в карточках и на странице зала.',
  'faq.q4': 'Можно ли искать по вместимости?',
  'faq.a4': 'Да, это основной фильтр каталога.',
  'faq.q5': 'В каких городах вы работаете?',
  'faq.a5': 'По всем крупным городам Казахстана — от Астаны и Алматы до областных центров.',

  'cities.eyebrow': 'Города',
  'cities.title': 'Начните с города',
  'cities.search': 'Поиск города…',
  'cities.unit': 'тойхана',
  'cities.notFound': 'Город не найден',
  'cities.notFoundText': 'Попробуйте изменить запрос.',

  'featured.eyebrow': 'Топ',
  'featured.title': 'Выбор редакции',
  'featured.how': 'Как выбираем',

  'types.eyebrow': 'Форматы',
  'types.title': 'Для какого тоя?',

  'seo.eyebrow': 'О каталоге',
  'seo.body':
    'toikhana.kz помогает быстро найти тойханы и банкетные залы по всем городам Казахстана: Астана, Алматы, Шымкент, Караганда, Актобе, Атырау и другие. Фильтруйте по вместимости, цене и типу торжества — свадьба, день рождения, корпоратив или сватовство.',

  'footer.tagline':
    'Каталог тойхан Казахстана. Ищите залы по городу, вместимости и цене, сравнивайте и оставляйте заявки.',
  'footer.nav': 'Навигация',
  'footer.cities': 'Города',
  'footer.contact': 'Связь',
  'footer.rights': 'все города Казахстана',

  'filter.capacity': 'Вместимость (гостей)',
  'filter.capacityPlaceholder': 'Например 200',
  'filter.type': 'Тип тоя',
  'filter.anyType': 'Любой тип',
  'type.svadba': 'Свадьба',
  'type.kudalyk': 'Сватовство',
  'type.birthday': 'День рождения',
  'type.corporate': 'Корпоратив',

  'catalog.eyebrow': 'Каталог',
  'catalog.count': 'вариантов',
  'card.guests': 'гостей',
  'card.from': 'от',
  'card.photoSoon': 'Фото скоро появится',
  'card.top': 'Топ',
  'card.empty': 'Ничего не найдено',
  'card.emptyText': 'Попробуйте другой город или фильтр.',
  'similar.title': 'Похожие тойханы',

  'contact.call': 'Позвонить',

  'booking.title': 'Оставить заявку',
  'booking.name': 'Ваше имя',
  'booking.phone': 'Телефон',
  'booking.guests': 'Количество гостей',
  'booking.comment': 'Комментарий',
  'booking.submit': 'Отправить заявку',
  'booking.done': 'Заявка отправлена! Владелец свяжется с вами.',

  'auth.login.title': 'Вход в аккаунт',
  'auth.login.subtitle': 'Войдите по email и паролю.',
  'auth.login.email': 'Email',
  'auth.login.password': 'Пароль',
  'auth.login.submit': 'Войти',
  'auth.login.error': 'Не удалось войти. Проверьте email и пароль.',
  'auth.login.noAccount': 'Нет аккаунта?',
  'auth.login.registerLink': 'Зарегистрироваться',

  'auth.register.title': 'Создать аккаунт',
  'auth.register.subtitle': 'Зарегистрируйтесь, чтобы сохранять залы и быстрее оставлять заявки.',
  'auth.register.name': 'Имя',
  'auth.register.email': 'Email',
  'auth.register.phone': 'Телефон',
  'auth.register.password': 'Пароль (минимум 6 символов)',
  'auth.register.submit': 'Зарегистрироваться',
  'auth.register.haveAccount': 'Уже есть аккаунт?',
  'auth.register.loginLink': 'Войти',
  'auth.register.error': 'Не удалось зарегистрироваться. Возможно, email уже занят.',
  'auth.register.success': 'Аккаунт создан. Добро пожаловать!',

  'auth.account.title': 'Личный кабинет',
  'auth.account.hello': 'Здравствуйте',
  'auth.account.email': 'Email',
  'auth.account.phone': 'Телефон',
  'auth.account.logout': 'Выйти',

  'owner.page.eyebrow': 'Для владельцев',
  'owner.page.title': 'Заявка на подключение тойханы',
  'owner.page.text':
    'Оставьте контакты — и мы вернёмся с предложением по размещению вашего зала в каталоге.'
};

const kk: Dict = {
  'lang.ru': 'Рус',
  'lang.kk': 'Қаз',

  'nav.home': 'Басты бет',
  'nav.blog': 'Блог',
  'nav.add': 'Тойхана қосу',
  'nav.about': 'Жоба туралы',
  'nav.contacts': 'Байланыс',
  'nav.login': 'Кіру',
  'nav.register': 'Тіркелу',
  'nav.account': 'Кабинет',
  'nav.logout': 'Шығу',
  'nav.allCities': 'Барлық қалалар',
  'nav.menu': 'Мәзір',
  'header.subtitle': 'Қазақстан тойханаларының каталогы',

  'hero.title': 'Қазақстан бойынша арман тойхананы табыңыз',
  'hero.subtitle':
    'Банкет залдарын қала, сыйымдылық және баға бойынша салыстырыңыз. Өтінім қалдырыңыз немесе иесімен тікелей байланысыңыз — тегін.',
  'hero.cta.add': 'Тойхана қосу',
  'hero.cta.how': 'Қалай жұмыс істейді',
  'hero.selectCity': 'Қаланы таңдаңыз',
  'hero.feature.search': 'Жылдам іздеу',
  'hero.feature.fast': '1 минутта өтінім',
  'hero.feature.call': 'Қоңырау / WhatsApp',
  'hero.feature.cities': 'қала',

  'trust.cities': 'Базадағы қалалар',
  'trust.toikhanas': 'Каталогтағы тойханалар',
  'trust.featured': 'Үздік нысандар',

  'how.eyebrow': 'Қалай жұмыс істейді',
  'how.title': 'Залға дейін 3 қадам',
  'how.step1': 'Қала мен той форматын таңдаңыз',
  'how.step2': 'Залдарды фото, сыйымдылық және баға бойынша салыстырыңыз',
  'how.step3': 'Қоңырау шалыңыз немесе иесіне өтінім қалдырыңыз',

  'owner.eyebrow': 'Иелерге',
  'owner.title': 'Өз тойханаңызды тегін орналастырыңыз',
  'owner.text':
    'Каталогтан өтінімдер алыңыз, фото көрсетіңіз және брондауды арттырыңыз. Бастау үшін байланыс пен зал туралы мәлімет жеткілікті.',
  'owner.button': 'Өтінім беру',

  'faq.eyebrow': 'Сұрақтар',
  'faq.title': 'Жиі қойылатын сұрақтар',
  'faq.q1': 'Залды қалай брондауға болады?',
  'faq.a1': 'Залды таңдаңыз, иесімен байланысып, форма арқылы өтінім қалдырыңыз.',
  'faq.q2': 'Бұл тегін бе?',
  'faq.a2': 'Қонақтар үшін иә. Иелер үшін бөлек орналастыру өтінімі бар.',
  'faq.q3': 'Фото бар ма?',
  'faq.a3': 'Иә, карточкаларда және зал бетінде.',
  'faq.q4': 'Сыйымдылық бойынша іздеуге бола ма?',
  'faq.a4': 'Иә, бұл каталогтың негізгі сүзгісі.',
  'faq.q5': 'Қай қалаларда жұмыс істейсіздер?',
  'faq.a5': 'Қазақстанның барлық ірі қалаларында — Астана мен Алматыдан облыс орталықтарына дейін.',

  'cities.eyebrow': 'Қалалар',
  'cities.title': 'Қаладан бастаңыз',
  'cities.search': 'Қала іздеу…',
  'cities.unit': 'тойхана',
  'cities.notFound': 'Қала табылмады',
  'cities.notFoundText': 'Сұранысты өзгертіп көріңіз.',

  'featured.eyebrow': 'Үздік',
  'featured.title': 'Редакция таңдауы',
  'featured.how': 'Қалай таңдаймыз',

  'types.eyebrow': 'Форматтар',
  'types.title': 'Қандай тойға?',

  'seo.eyebrow': 'Каталог туралы',
  'seo.body':
    'toikhana.kz Қазақстанның барлық қалалары бойынша тойханалар мен банкет залдарын жылдам табуға көмектеседі: Астана, Алматы, Шымкент, Қарағанды, Ақтөбе, Атырау және басқалары. Сыйымдылық, баға және той түрі бойынша сүзіңіз — үйлену тойы, туған күн, корпоратив немесе құдалық.',

  'footer.tagline':
    'Қазақстан тойханаларының каталогы. Залдарды қала, сыйымдылық және баға бойынша іздеп, салыстырып, өтінім қалдырыңыз.',
  'footer.nav': 'Навигация',
  'footer.cities': 'Қалалар',
  'footer.contact': 'Байланыс',
  'footer.rights': 'Қазақстанның барлық қалалары',

  'filter.capacity': 'Сыйымдылық (қонақ)',
  'filter.capacityPlaceholder': 'Мысалы 200',
  'filter.type': 'Той түрі',
  'filter.anyType': 'Кез келген түрі',
  'type.svadba': 'Үйлену тойы',
  'type.kudalyk': 'Құдалық',
  'type.birthday': 'Туған күн',
  'type.corporate': 'Корпоратив',

  'catalog.eyebrow': 'Каталог',
  'catalog.count': 'нұсқа',
  'card.guests': 'қонақ',
  'card.from': 'бастап',
  'card.photoSoon': 'Фото жақында',
  'card.top': 'Үздік',
  'card.empty': 'Ештеңе табылмады',
  'card.emptyText': 'Басқа қаланы немесе сүзгіні таңдап көріңіз.',
  'similar.title': 'Ұқсас тойханалар',

  'contact.call': 'Қоңырау шалу',

  'booking.title': 'Өтінім қалдыру',
  'booking.name': 'Атыңыз',
  'booking.phone': 'Телефон',
  'booking.guests': 'Қонақ саны',
  'booking.comment': 'Түсініктеме',
  'booking.submit': 'Өтінім жіберу',
  'booking.done': 'Өтінім жіберілді! Иесі сізбен байланысады.',

  'auth.login.title': 'Аккаунтқа кіру',
  'auth.login.subtitle': 'Email пен құпиясөз арқылы кіріңіз.',
  'auth.login.email': 'Email',
  'auth.login.password': 'Құпиясөз',
  'auth.login.submit': 'Кіру',
  'auth.login.error': 'Кіру сәтсіз. Email мен құпиясөзді тексеріңіз.',
  'auth.login.noAccount': 'Аккаунт жоқ па?',
  'auth.login.registerLink': 'Тіркелу',

  'auth.register.title': 'Аккаунт құру',
  'auth.register.subtitle': 'Залдарды сақтау және өтінімдерді жылдам қалдыру үшін тіркеліңіз.',
  'auth.register.name': 'Аты-жөні',
  'auth.register.email': 'Email',
  'auth.register.phone': 'Телефон',
  'auth.register.password': 'Құпиясөз (кемінде 6 таңба)',
  'auth.register.submit': 'Тіркелу',
  'auth.register.haveAccount': 'Аккаунт бар ма?',
  'auth.register.loginLink': 'Кіру',
  'auth.register.error': 'Тіркелу сәтсіз. Бұл email бұрыннан тіркелген болуы мүмкін.',
  'auth.register.success': 'Аккаунт құрылды. Қош келдіңіз!',

  'auth.account.title': 'Жеке кабинет',
  'auth.account.hello': 'Сәлеметсіз бе',
  'auth.account.email': 'Email',
  'auth.account.phone': 'Телефон',
  'auth.account.logout': 'Шығу',

  'owner.page.eyebrow': 'Иелерге',
  'owner.page.title': 'Тойхананы қосуға өтінім',
  'owner.page.text':
    'Байланысыңызды қалдырыңыз — біз залыңызды каталогқа орналастыру бойынша ұсыныспен қайта байланысамыз.'
};

const DICTS: Record<Lang, Dict> = { ru, kk };

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** translate a UI key */
  t: (key: string) => string;
  /** pick the right field for localized content (e.g. nameRu / nameKk) */
  loc: (ruValue?: string, kkValue?: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'ru';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'kk' ? 'kk' : 'ru';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const value = useMemo<I18nValue>(() => {
    const table = DICTS[lang];
    return {
      lang,
      setLang,
      t: (key) => table[key] ?? DICTS.ru[key] ?? key,
      loc: (ruValue, kkValue) => (lang === 'kk' ? kkValue || ruValue || '' : ruValue || kkValue || '')
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
