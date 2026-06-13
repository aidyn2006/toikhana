import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from './i18n';
import { AuthProvider } from './auth';

/**
 * Shared provider tree used by both the browser entry (main.tsx) and the
 * static-site-generation entry (entry-server.tsx). The router is passed as
 * children so each entry can supply BrowserRouter / StaticRouter.
 */
export function Providers({
  children,
  queryClient,
  helmetContext
}: {
  children: ReactNode;
  queryClient: QueryClient;
  helmetContext?: object;
}) {
  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <AuthProvider>{children}</AuthProvider>
        </I18nProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
