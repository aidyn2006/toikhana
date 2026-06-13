import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Hero, CityCards, FeaturedToikhanas, FAQ, HowItWorks, OwnerCTA, SEOText, ToyTypes, Seo, organizationJsonLd } from '../components';
import { getCities, getFeaturedToikhanas } from '../api/client';
import { useI18n } from '../i18n';

export function HomePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const citiesQuery = useQuery({ queryKey: ['cities'], queryFn: getCities });
  const featuredQuery = useQuery({ queryKey: ['featured'], queryFn: getFeaturedToikhanas });

  const toyTypes = useMemo(
    () => [
      { id: 1, nameRu: 'Свадьба', nameKk: 'Үйлену тойы', slug: 'svadba' },
      { id: 2, nameRu: 'Сватовство', nameKk: 'Құдалық', slug: 'kudalyk' },
      { id: 3, nameRu: 'День рождения', nameKk: 'Туған күн', slug: 'birthday' },
      { id: 4, nameRu: 'Корпоратив', nameKk: 'Корпоратив', slug: 'corporate' }
    ],
    []
  );

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
      {/* Real listings first — the most useful content for a visitor */}
      {featuredQuery.data?.length ? <FeaturedToikhanas items={featuredQuery.data} /> : null}
      <CityCards cities={citiesQuery.data ?? []} />
      <ToyTypes toyTypes={toyTypes} />
      <HowItWorks />
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] bg-card p-6 shadow-soft">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('blog.eyebrow')}</p>
          <h2 className="font-serif text-3xl">{t('blog.title')}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{t('blog.intro')}</p>
        </div>
        <Link to="/blog" className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-dark">
          {t('nav.blog')}
        </Link>
      </section>
      <OwnerCTA />
      <FAQ />
      <SEOText />
    </main>
  );
}
