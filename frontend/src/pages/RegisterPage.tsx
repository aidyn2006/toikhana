import { useState } from 'react';
import type { FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { useI18n } from '../i18n';

export function RegisterPage() {
  const { register } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      await register({
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? ''),
        password: String(data.get('password') ?? '')
      });
      navigate('/account');
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10 md:px-8 md:py-16">
      <Helmet>
        <title>{t('auth.register.title')} | toikhana.kz</title>
      </Helmet>
      <form onSubmit={submit} className="space-y-4 rounded-[2rem] bg-card p-8 shadow-soft">
        <div>
          <h1 className="font-serif text-3xl">{t('auth.register.title')}</h1>
          <p className="mt-2 text-sm text-slate-500">{t('auth.register.subtitle')}</p>
        </div>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-600">{t('auth.register.name')}</span>
          <input
            name="name"
            required
            autoComplete="name"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-600">{t('auth.register.email')}</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-600">{t('auth.register.phone')}</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+7 700 000 00 00"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-600">{t('auth.register.password')}</span>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-accent"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {t('auth.register.submit')}
        </button>
        {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-800">{t('auth.register.error')}</p> : null}
        <p className="text-center text-sm text-slate-500">
          {t('auth.register.haveAccount')}{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {t('auth.register.loginLink')}
          </Link>
        </p>
      </form>
    </main>
  );
}
