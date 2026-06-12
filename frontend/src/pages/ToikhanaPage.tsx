import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  BookingForm,
  ContactButtons,
  Description,
  PhotoGallery,
  SimilarToikhanas,
  ToyTypeBadges,
  ToikhanaInfo
} from '../components';
import { getSimilarToikhanas, getToikhana, submitBooking } from '../api/client';

export function ToikhanaPage() {
  const { slug = '' } = useParams();
  const queryClient = useQueryClient();
  const itemQuery = useQuery({ queryKey: ['toikhana', slug], queryFn: () => getToikhana(slug), enabled: Boolean(slug) });
  const similarQuery = useQuery({ queryKey: ['similar', slug], queryFn: () => getSimilarToikhanas(slug), enabled: Boolean(slug) });
  const bookingMutation = useMutation({ mutationFn: submitBooking, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }) });

  const item = itemQuery.data;

  return (
    <main className="space-y-8 p-4 md:p-8">
      <Helmet>
        <title>{item ? `${item.name} — Тойхана ${item.citySlug} | toikhana.kz` : 'Тойхана | toikhana.kz'}</title>
        <meta name="description" content={item?.descriptionRu ?? 'Тойхана туралы ақпарат'} />
      </Helmet>
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
        </>
      ) : null}
    </main>
  );
}
