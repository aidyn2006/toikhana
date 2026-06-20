import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { EmptyState, FilterPanel, PageHeader, ToikhanaGrid, Seo, breadcrumbJsonLd } from '../components';
import { getCity, getToikhanas } from '../api/client';
import { useI18n } from '../i18n';

export function CityPage() {
  const { t, loc } = useI18n();
  const { citySlug = '' } = useParams();
  const [capacity, setCapacity] = useState('');
  const [type, setType] = useState('');

  const cityQuery = useQuery({ queryKey: ['city', citySlug], queryFn: () => getCity(citySlug), enabled: Boolean(citySlug) });
  const itemsQuery = useQuery({
    queryKey: ['toikhanas', citySlug, capacity, type],
    queryFn: () => getToikhanas({ city: citySlug, capacity: capacity ? Number(capacity) : undefined, type: type || undefined })
  });

  const localCityName = cityQuery.data ? loc(cityQuery.data.nameRu, cityQuery.data.nameKk) : undefined;
  const title = useMemo(
    () => (localCityName ? `${t('city.titlePrefix')} ${localCityName}` : t('city.titleAll')),
    [localCityName, t]
  );

  const cityName = cityQuery.data?.nameRu;

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
      <Seo
        title={cityName ? `Тойхана ${cityName} — банкетные залы и цены | toikhana.kz` : 'Тойхана — банкетные залы Казахстана | toikhana.kz'}
        description={
          cityName
            ? `Тойханы и банкетные залы в городе ${cityName}: фото, цены, вместимость и онлайн-заявки. Подберите и забронируйте зал в городе ${cityName} на toikhana.kz.`
            : 'Каталог тойхан по городам Казахстана.'
        }
        path={citySlug ? `/${citySlug}` : '/'}
        jsonLd={breadcrumbJsonLd([
          { name: 'Главная', path: '/' },
          { name: cityName ?? 'Город', path: citySlug ? `/${citySlug}` : '/' }
        ])}
      />
      <PageHeader title={title} count={itemsQuery.data?.count ?? 0} />
      {localCityName ? (
        <section className="rounded-[1.75rem] bg-card p-6 text-sm leading-7 text-slate-600 shadow-soft">
          <p>
            <strong className="text-primary">Тойхана {localCityName}</strong> — подберите банкетный зал для свадьбы,
            той-думана, дня рождения или корпоратива в городе {localCityName}. Сравнивайте тойханы по вместимости,
            цене и расположению, смотрите фото залов и оставляйте заявку онлайн прямо на toikhana.kz.
          </p>
        </section>
      ) : null}
      <FilterPanel capacity={capacity} onCapacityChange={setCapacity} type={type} onTypeChange={setType} />
      {itemsQuery.data?.items?.length ? (
        <ToikhanaGrid items={itemsQuery.data.items} />
      ) : (
        <EmptyState title={t('city.empty')} text={t('city.emptyText')} />
      )}
    </main>
  );
}
