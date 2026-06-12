import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BookingList, LoginForm, PhotoUpload, ToikhanaForm } from '../components';
import {
  adminLogin,
  clearAdminAuth,
  createAdminToikhana,
  getAdminBookings,
  getAdminToikhanas,
  getCities,
  uploadAdminToikhanaPhoto
} from '../api/client';

export function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('toikhana.adminAuth')));
  const citiesQuery = useQuery({ queryKey: ['admin', 'cities'], queryFn: getCities, enabled: loggedIn });
  const toikhanasQuery = useQuery({ queryKey: ['admin', 'toikhanas'], queryFn: getAdminToikhanas, enabled: loggedIn });
  const bookingsQuery = useQuery({ queryKey: ['admin', 'bookings'], queryFn: getAdminBookings, enabled: loggedIn });
  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) => adminLogin(username, password),
    onSuccess: () => setLoggedIn(true)
  });
  const createMutation = useMutation({
    mutationFn: createAdminToikhana,
    onSuccess: () => {
      toikhanasQuery.refetch();
      citiesQuery.refetch();
    }
  });
  const uploadMutation = useMutation({
    mutationFn: ({
      toikhanaId,
      file,
      isMain,
      sortOrder
    }: {
      toikhanaId: number;
      file: File;
      isMain: boolean;
      sortOrder?: number;
    }) => uploadAdminToikhanaPhoto(toikhanaId, file, isMain, sortOrder),
    onSuccess: () => toikhanasQuery.refetch()
  });

  return (
    <main className="space-y-8 p-4 md:p-8">
      <Helmet>
        <title>Admin | toikhana.kz</title>
      </Helmet>
      {!loggedIn ? (
        <LoginForm
          onSubmit={async (username, password) => {
            await loginMutation.mutateAsync({ username, password });
          }}
        />
      ) : (
        <div className="space-y-8">
          <button
            type="button"
            className="rounded-full bg-slate-200 px-4 py-2 text-sm"
            onClick={() => {
              clearAdminAuth();
              setLoggedIn(false);
            }}
          >
            Выйти
          </button>
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl">Тойханалар</h2>
              <ToikhanaForm onSubmit={async (payload) => createMutation.mutateAsync(payload)} />
              <PhotoUpload
                onSubmit={async ({ toikhanaId, file, isMain, sortOrder }) =>
                  uploadMutation.mutateAsync({ toikhanaId, file, isMain, sortOrder })
                }
              />
              <div className="rounded-[1.75rem] bg-card p-6 shadow-soft">
                <h3 className="font-serif text-2xl">Cities</h3>
                <pre className="overflow-auto text-xs">{JSON.stringify(citiesQuery.data ?? [], null, 2)}</pre>
              </div>
              <div className="rounded-[1.75rem] bg-card p-6 shadow-soft">
                <pre className="overflow-auto text-xs">{JSON.stringify(toikhanasQuery.data ?? [], null, 2)}</pre>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="font-serif text-3xl">Заявки</h2>
              <BookingList bookings={bookingsQuery.data ?? []} />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
