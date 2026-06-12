import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Hero, CityCards, FeaturedToikhanas, FAQ, HowItWorks, OwnerCTA, SEOText, ToyTypes, TrustStats, EmptyState, Seo, organizationJsonLd } from '../components';
import { getCities, getFeaturedToikhanas } from '../api/client';

export function HomePage() {
  const navigate = useNavigate();
  const citiesQuery = useQuery({ queryKey: ['cities'], queryFn: getCities });
  const featuredQuery = useQuery({ queryKey: ['featured'], queryFn: getFeaturedToikhanas });

  const toyTypes = useMemo(
    () => [
      { id: 1, nameRu: 'Свадьба', nameKk: 'Үйлену тойы', slug: 'svadba' },
      { id: 2, nameRu: 'День рождения', nameKk: 'Туған күн', slug: 'birthday' },
      { id: 3, nameRu: 'Корпоратив', nameKk: 'Корпоратив', slug: 'corporate' }
    ],
    []
  );

  const toikhanasCount =
    citiesQuery.data?.reduce((sum, city) => sum + city.toikhanaCount, 0) ?? 0;

  return (
    <main className="mx-auto max-w-7xl space-y-12 px-4 py-6 md:px-8 md:py-10">
      <Seo
        title="Тойхана — банкетные залы по всему Казахстану | toikhana.kz"
        description="Каталог тойхан Казахстана: Астана, Алматы, Шымкент и все областные центры. Сравнивайте залы по цене и вместимости, оставляйте заявки онлайн."
        path="/"
        jsonLd={organizationJsonLd()}
      />
      <Hero
        cities={citiesQuery.data ?? []}
        selectedCity=""
        onCityChange={(slug) => {
          navigate(slug ? `/city/${slug}` : '/');
        }}
      />
      <TrustStats
        cities={citiesQuery.data ?? []}
        toikhanasCount={toikhanasCount}
        featuredCount={featuredQuery.data?.filter((item) => item.featured).length ?? 0}
      />
      <HowItWorks />
      <OwnerCTA />
      <div className="space-y-6">
        <CityCards cities={citiesQuery.data ?? []} />
        {featuredQuery.data?.length ? (
          <FeaturedToikhanas items={featuredQuery.data ?? []} />
        ) : (
          <EmptyState title="Залы загружаются" text="Если API отвечает медленно, секция появится после загрузки данных." />
        )}
        <ToyTypes toyTypes={toyTypes} />
        <FAQ />
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] bg-card p-6 shadow-soft">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Блог</p>
            <h2 className="font-serif text-3xl">Советы по организации тоя</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Как выбрать тойхану, сколько стоит свадьба и чек-листы для торжеств.
            </p>
          </div>
          <Link to="/blog" className="rounded-full bg-primary px-6 py-3 font-semibold text-white">
            Читать блог
          </Link>
        </section>
        <SEOText />
      </div>
    </main>
  );
}
