import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BookingList, Import2gisForm, LoginForm, PhotoUpload, ToikhanaForm } from '../components';
import {
  adminLogin,
  clearAdminAuth,
  createAdminToikhana,
  getAdminBookings,
  getAdminOwnerApplications,
  getAdminToikhanas,
  getCities,
  importFrom2gis,
  updateOwnerApplicationStatus,
  uploadAdminToikhanaPhoto
} from '../api/client';

export function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('toikhana.adminAuth')));
  const citiesQuery = useQuery({ queryKey: ['admin', 'cities'], queryFn: getCities, enabled: loggedIn });
  const toikhanasQuery = useQuery({ queryKey: ['admin', 'toikhanas'], queryFn: getAdminToikhanas, enabled: loggedIn });
  const bookingsQuery = useQuery({ queryKey: ['admin', 'bookings'], queryFn: getAdminBookings, enabled: loggedIn });
  const ownerApplicationsQuery = useQuery({
    queryKey: ['admin', 'owner-applications'],
    queryFn: getAdminOwnerApplications,
    enabled: loggedIn
  });
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
  const import2gisMutation = useMutation({
    mutationFn: importFrom2gis,
    onSuccess: () => {
      toikhanasQuery.refetch();
      citiesQuery.refetch();
    }
  });
  const ownerStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateOwnerApplicationStatus(id, status),
    onSuccess: () => ownerApplicationsQuery.refetch()
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
              <h2 className="font-serif text-3xl">Тойханы</h2>
              <Import2gisForm
                cities={citiesQuery.data ?? []}
                pending={import2gisMutation.isPending}
                result={import2gisMutation.data ?? null}
                error={import2gisMutation.error ? (import2gisMutation.error as Error).message : null}
                onSubmit={async (payload) => {
                  await import2gisMutation.mutateAsync(payload);
                }}
              />
              <ToikhanaForm
                onSubmit={async (payload) => {
                  await createMutation.mutateAsync(payload);
                }}
              />
              <PhotoUpload
                onSubmit={async ({ toikhanaId, file, isMain, sortOrder }) => {
                  await uploadMutation.mutateAsync({ toikhanaId, file, isMain, sortOrder });
                }}
              />
              <div className="rounded-[1.75rem] bg-card p-6 shadow-soft">
                <h3 className="font-serif text-2xl">Cities</h3>
                <pre className="overflow-auto text-xs">{JSON.stringify(citiesQuery.data ?? [], null, 2)}</pre>
              </div>
              <div className="rounded-[1.75rem] bg-card p-6 shadow-soft">
                <pre className="overflow-auto text-xs">{JSON.stringify(toikhanasQuery.data ?? [], null, 2)}</pre>
              </div>
              <div className="rounded-[1.75rem] bg-card p-6 shadow-soft">
                <h3 className="font-serif text-2xl">Заявки владельцев</h3>
                <div className="mt-4 space-y-4">
                  {(ownerApplicationsQuery.data ?? []).map((application) => (
                    <div key={application.id} className="rounded-2xl border border-slate-100 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold">{application.name}</div>
                          <div className="text-sm text-slate-500">
                            {application.city}
                            {application.hallName ? ` · ${application.hallName}` : ''}
                          </div>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                          {application.status}
                        </span>
                      </div>
                      <div className="mt-3 text-sm text-slate-600">
                        <div>{application.phone}</div>
                        {application.whatsapp ? <div>{application.whatsapp}</div> : null}
                        {application.message ? <div className="mt-2 whitespace-pre-line">{application.message}</div> : null}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {['reviewed', 'contacted', 'approved', 'rejected'].map((status) => (
                          <button
                            key={status}
                            type="button"
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]"
                            onClick={() => ownerStatusMutation.mutate({ id: application.id ?? 0, status })}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!ownerApplicationsQuery.data?.length ? (
                    <p className="text-sm text-slate-500">Пока нет заявок владельцев.</p>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="font-serif text-3xl">Заявки гостей</h2>
              <BookingList bookings={bookingsQuery.data ?? []} />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
