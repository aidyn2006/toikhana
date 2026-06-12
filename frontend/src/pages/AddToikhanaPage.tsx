import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCities, submitOwnerApplication } from '../api/client';
import { OwnerApplicationForm } from '../components/OwnerApplicationForm';

export function AddToikhanaPage() {
  const citiesQuery = useQuery({ queryKey: ['owner-applications', 'cities'], queryFn: getCities });
  const mutation = useMutation({ mutationFn: submitOwnerApplication });

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-6 md:px-8 md:py-10">
      <Helmet>
        <title>Разместить тойхану | toikhana.kz</title>
      </Helmet>
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Для владельцев</p>
        <h1 className="mt-3 font-serif text-4xl">Разместите свою тойхану</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Оставьте контакты и данные о зале. Мы свяжемся с вами и поможем добавить карточку в каталог.
        </p>
      </section>
      <OwnerApplicationForm
        cities={citiesQuery.data ?? []}
        title="Заявка на размещение"
        description="Это не кабинет администратора. Это рабочая форма для новых владельцев тойхан."
        submitLabel="Отправить заявку"
        onSubmit={async (payload) => {
          await mutation.mutateAsync(payload);
        }}
      />
      {mutation.isSuccess ? (
        <div className="rounded-[1.75rem] bg-emerald-50 p-6 text-emerald-900">
          Заявка отправлена. Мы свяжемся с вами.
        </div>
      ) : null}
    </main>
  );
}
