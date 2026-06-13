import { Helmet } from 'react-helmet-async';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { useI18n } from '../i18n';

export function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 md:px-8 md:py-16">
      <Helmet>
        <title>{t('auth.account.title')} | toikhana.kz</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className="rounded-[2rem] bg-card p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('auth.account.title')}</p>
        <h1 className="mt-2 font-serif text-3xl">
          {t('auth.account.hello')}, {user.name}!
        </h1>
        <dl className="mt-6 grid gap-3 text-sm">
          <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
            <dt className="text-slate-500">{t('auth.account.email')}</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          {user.phone ? (
            <div className="flex items-center justify-between rounded-2xl bg-background px-4 py-3">
              <dt className="text-slate-500">{t('auth.account.phone')}</dt>
              <dd className="font-medium">{user.phone}</dd>
            </div>
          ) : null}
        </dl>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="mt-6 rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
        >
          {t('auth.account.logout')}
        </button>
      </section>
    </main>
  );
}
