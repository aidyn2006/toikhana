import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCities, submitOwnerApplication } from '../api/client';
import { OwnerApplicationForm } from '../components/OwnerApplicationForm';
import { useI18n } from '../i18n';

export function AddToikhanaPage() {
  const { t } = useI18n();
  const citiesQuery = useQuery({ queryKey: ['owner-applications', 'cities'], queryFn: getCities });
  const mutation = useMutation({ mutationFn: submitOwnerApplication });

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-6 md:px-8 md:py-10">
      <Helmet>
        <title>{t('nav.add')} | toikhana.kz</title>
      </Helmet>
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('owner.page.eyebrow')}</p>
        <h1 className="mt-3 font-serif text-4xl">{t('owner.title')}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{t('owner.page.text')}</p>
      </section>
      <OwnerApplicationForm
        cities={citiesQuery.data ?? []}
        title={t('owner.page.formTitle')}
        description={t('owner.page.formDesc')}
        submitLabel={t('ownerForm.submit')}
        onSubmit={async (payload) => {
          await mutation.mutateAsync(payload);
        }}
      />
      {mutation.isSuccess ? (
        <div className="rounded-[1.75rem] bg-emerald-50 p-6 text-emerald-900">{t('owner.page.success')}</div>
      ) : null}
    </main>
  );
}
