import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { EmptyState, FilterPanel, PageHeader, ToikhanaGrid, Seo, breadcrumbJsonLd } from '../components';
import { getCity, getToikhanas } from '../api/client';

export function CityPage() {
  const { citySlug = '' } = useParams();
  const [capacity, setCapacity] = useState('');
  const [type, setType] = useState('');

  const cityQuery = useQuery({ queryKey: ['city', citySlug], queryFn: () => getCity(citySlug), enabled: Boolean(citySlug) });
  const itemsQuery = useQuery({
    queryKey: ['toikhanas', citySlug, capacity, type],
    queryFn: () => getToikhanas({ city: citySlug, capacity: capacity ? Number(capacity) : undefined, type: type || undefined })
  });

  const title = useMemo(
    () => (cityQuery.data ? `Тойхана ${cityQuery.data.nameRu}` : 'Тойханалар'),
    [cityQuery.data]
  );

  const cityName = cityQuery.data?.nameRu;

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
      <Seo
        title={cityName ? `Тойхана ${cityName} — ${cityQuery.data?.toikhanaCount ?? 0} залов | toikhana.kz` : 'Тойхана | toikhana.kz'}
        description={
          cityName
            ? `Тойханы и банкетные залы в городе ${cityName}. ${cityQuery.data?.toikhanaCount ?? 0} объектов: фото, цены, вместимость и заявки онлайн.`
            : 'Каталог тойхан по городам Казахстана.'
        }
        path={citySlug ? `/${citySlug}` : '/'}
        jsonLd={breadcrumbJsonLd([
          { name: 'Главная', path: '/' },
          { name: cityName ?? 'Город', path: citySlug ? `/${citySlug}` : '/' }
        ])}
      />
      <PageHeader title={title} count={itemsQuery.data?.count ?? 0} />
      <FilterPanel capacity={capacity} onCapacityChange={setCapacity} type={type} onTypeChange={setType} />
      {itemsQuery.data?.items?.length ? (
        <ToikhanaGrid items={itemsQuery.data.items} />
      ) : (
        <EmptyState title="Залов пока нет" text="Попробуйте другой город или другой фильтр." />
      )}
    </main>
  );
}
