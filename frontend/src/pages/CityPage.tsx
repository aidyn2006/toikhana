import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { FilterPanel, PageHeader, Pagination, ToikhanaGrid } from '../components';
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

  return (
    <main className="space-y-8 p-4 md:p-8">
      <Helmet>
        <title>{cityQuery.data ? `Тойхана ${cityQuery.data.nameRu} — ${cityQuery.data.toikhanaCount} залов | toikhana.kz` : 'Тойхана | toikhana.kz'}</title>
        <meta name="description" content={cityQuery.data ? `${cityQuery.data.nameRu} тойханалары. ${cityQuery.data.toikhanaCount} зал.` : 'Тойханалар каталогы'} />
      </Helmet>
      <PageHeader title={title} count={itemsQuery.data?.count ?? 0} />
      <FilterPanel capacity={capacity} onCapacityChange={setCapacity} type={type} onTypeChange={setType} />
      <ToikhanaGrid items={itemsQuery.data?.items ?? []} />
      <Pagination current={1} total={1} onChange={() => undefined} />
    </main>
  );
}
