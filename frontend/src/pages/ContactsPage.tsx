import { Helmet } from 'react-helmet-async';

export function ContactsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-6 md:px-8 md:py-10">
      <Helmet>
        <title>Контакты | toikhana.kz</title>
      </Helmet>
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Контакты</p>
        <h1 className="mt-3 font-serif text-4xl">Свяжитесь с нами</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <a className="rounded-2xl bg-slate-50 p-5" href="mailto:hello@toikhana.kz">
            <div className="text-sm text-slate-500">Email</div>
            <div className="mt-1 font-semibold">hello@toikhana.kz</div>
          </a>
          <a className="rounded-2xl bg-slate-50 p-5" href="https://wa.me/77000000000" target="_blank" rel="noreferrer">
            <div className="text-sm text-slate-500">WhatsApp</div>
            <div className="mt-1 font-semibold">+7 (700) 000-00-00</div>
          </a>
        </div>
      </section>
    </main>
  );
}
