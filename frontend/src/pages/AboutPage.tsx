import { Helmet } from 'react-helmet-async';
import { HowItWorks, OwnerCTA, TrustStats } from '../components';
import { useQuery } from '@tanstack/react-query';
import { getCities, getFeaturedToikhanas } from '../api/client';

export function AboutPage() {
  const citiesQuery = useQuery({ queryKey: ['about', 'cities'], queryFn: getCities });
  const featuredQuery = useQuery({ queryKey: ['about', 'featured'], queryFn: getFeaturedToikhanas });
  const toikhanasCount = citiesQuery.data?.reduce((sum, city) => sum + city.toikhanaCount, 0) ?? 0;

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-6 md:px-8 md:py-10">
      <Helmet>
        <title>О проекте | toikhana.kz</title>
      </Helmet>
      <section className="rounded-[2rem] bg-white p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">О проекте</p>
        <h1 className="mt-3 font-serif text-4xl">Каталог тойхан для Казахстана</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Мы делаем понятный каталог залов для тоя: быстрый поиск, карточки с фото, фильтры,
          заявки и отдельный поток для владельцев.
        </p>
      </section>
      <TrustStats
        cities={citiesQuery.data ?? []}
        toikhanasCount={toikhanasCount}
        featuredCount={featuredQuery.data?.filter((item) => item.featured).length ?? 0}
      />
      <HowItWorks />
      <OwnerCTA />
    </main>
  );
}
