import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { QueryClient } from '@tanstack/react-query';
import { Providers } from './providers';
import { App } from './App';

export interface HelmetState {
  helmet?: {
    title: { toString(): string };
    meta: { toString(): string };
    link: { toString(): string };
    script: { toString(): string };
    htmlAttributes: { toString(): string };
  };
}

/** Render a single route to a static HTML string + extracted <head> tags. */
export function render(url: string): { html: string; helmetContext: HelmetState } {
  const helmetContext: HelmetState = {};
  // A fresh, never-refetching client so SSG renders the loading shell only.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, enabled: false } }
  });
  const html = renderToString(
    <Providers queryClient={queryClient} helmetContext={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </Providers>
  );
  return { html, helmetContext };
}
