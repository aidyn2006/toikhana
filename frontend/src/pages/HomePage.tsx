import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Hero, CityCards, FeaturedToikhanas, FAQ, HowItWorks, OwnerCTA, SEOText, ToyTypes, TrustStats, EmptyState } from '../components';
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
      <Helmet>
        <title>Тойхана — Казахстан залдары | toikhana.kz</title>
        <meta name="description" content="Казахстандағы үздік тойханалар. Астана, Алматы, Шымкент." />
      </Helmet>
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
        <SEOText />
      </div>
    </main>
  );
}
