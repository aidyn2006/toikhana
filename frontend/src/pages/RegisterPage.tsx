import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCities, submitOwnerApplication } from '../api/client';
import { OwnerApplicationForm } from '../components/OwnerApplicationForm';

export function RegisterPage() {
  const citiesQuery = useQuery({ queryKey: ['register', 'cities'], queryFn: getCities });
  const mutation = useMutation({ mutationFn: submitOwnerApplication });

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <Helmet>
        <title>Регистрация владельца | toikhana.kz</title>
      </Helmet>
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Регистрация</p>
        <h1 className="mt-3 font-serif text-4xl">Заявка на подключение тойханы</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Для гостей регистрация не нужна. Для владельцев мы предлагаем короткую рабочую форму: оставьте контакты и
          мы вернёмся с предложением по размещению.
        </p>
      </section>
      <div className="mt-8">
        <OwnerApplicationForm
          cities={citiesQuery.data ?? []}
          title="Подключить свою тойхану"
          description="Отправьте заявку, если хотите получать гостей из каталога."
          submitLabel="Отправить заявку"
          onSubmit={async (payload) => mutation.mutateAsync(payload)}
        />
      </div>
      {mutation.isSuccess ? (
        <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-emerald-900">Заявка принята. Мы свяжемся с вами.</div>
      ) : null}
    </main>
  );
}
