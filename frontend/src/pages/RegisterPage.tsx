import { Helmet } from 'react-helmet-async';

export function RegisterPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <Helmet>
        <title>Регистрация | toikhana.kz</title>
      </Helmet>
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Регистрация</p>
        <h1 className="mt-3 font-serif text-4xl">Публичная регистрация пока не включена</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Сейчас у проекта приоритет на каталог и заявки. Для владельцев есть отдельная посадочная
          страница “Разместить тойхану”, а для гостей регистрация не требуется.
        </p>
      </section>
    </main>
  );
}
