import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  BookingForm,
  ContactButtons,
  Description,
  PhotoGallery,
  SimilarToikhanas,
  ToyTypeBadges,
  ToikhanaInfo,
  MobileContactBar,
  Seo,
  breadcrumbJsonLd,
  canonicalUrl
} from '../components';
import { getSimilarToikhanas, getToikhana, submitBooking } from '../api/client';

export function ToikhanaPage() {
  const { slug = '' } = useParams();
  const queryClient = useQueryClient();
  const itemQuery = useQuery({ queryKey: ['toikhana', slug], queryFn: () => getToikhana(slug), enabled: Boolean(slug) });
  const similarQuery = useQuery({ queryKey: ['similar', slug], queryFn: () => getSimilarToikhanas(slug), enabled: Boolean(slug) });
  const bookingMutation = useMutation({ mutationFn: submitBooking, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }) });

  const item = itemQuery.data;

  const placeJsonLd = item
    ? {
        '@context': 'https://schema.org',
        '@type': 'EventVenue',
        name: item.name,
        description: item.descriptionRu,
        url: canonicalUrl(`/toikhana/${item.slug}`),
        image: item.photos?.[0]?.url,
        telephone: item.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: item.address,
          addressLocality: item.cityName,
          addressCountry: 'KZ'
        }
      }
    : null;

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-4 pb-24 md:p-8 md:pb-8">
      <Seo
        title={item ? `${item.name} — тойхана в городе ${item.cityName} | toikhana.kz` : 'Тойхана | toikhana.kz'}
        description={
          item
            ? item.descriptionRu ??
              `${item.name} — банкетный зал в городе ${item.cityName}. Вместимость, цены, фото и заявки онлайн.`
            : 'Информация о тойхане.'
        }
        path={item ? `/toikhana/${item.slug}` : undefined}
        image={item?.photos?.[0]?.url}
        jsonLd={
          item && placeJsonLd
            ? [
                placeJsonLd,
                breadcrumbJsonLd([
                  { name: 'Главная', path: '/' },
                  { name: item.cityName ?? 'Город', path: `/${item.citySlug}` },
                  { name: item.name, path: `/toikhana/${item.slug}` }
                ])
              ]
            : undefined
        }
      />
      {item ? (
        <>
          <PhotoGallery photos={item.photos} />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <ToikhanaInfo item={item} />
              <Description title="Описание" body={item.descriptionRu} />
              <div className="rounded-[1.75rem] bg-card p-6 shadow-soft">
                <h3 className="font-serif text-2xl">Типы тоя</h3>
                <div className="mt-4">
                  <ToyTypeBadges toyTypes={item.toyTypes} />
                </div>
              </div>
              <ContactButtons phone={item.phone} whatsapp={item.whatsapp} />
            </div>
            <BookingForm
              toikhanaId={item.id}
              onSubmit={async (payload) => {
                await bookingMutation.mutateAsync(payload);
              }}
            />
          </div>
          {similarQuery.data ? <SimilarToikhanas items={similarQuery.data} /> : null}
          <MobileContactBar phone={item.phone} whatsapp={item.whatsapp} />
        </>
      ) : null}
    </main>
  );
}
