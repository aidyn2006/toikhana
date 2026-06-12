import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import { LoginForm } from '../components';
import { adminLogin } from '../api/client';

export function LoginPage() {
  const mutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) => adminLogin(username, password)
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <Helmet>
        <title>Войти в админку | toikhana.kz</title>
      </Helmet>
      <LoginForm
        onSubmit={async (username, password) => {
          await mutation.mutateAsync({ username, password });
        }}
      />
      {mutation.isError ? (
        <div className="mt-4 rounded-2xl bg-red-50 p-4 text-red-800">Не удалось войти. Проверьте логин и пароль.</div>
      ) : null}
      {mutation.isSuccess ? (
        <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-emerald-900">Доступ к админке открыт.</div>
      ) : null}
    </main>
  );
}
