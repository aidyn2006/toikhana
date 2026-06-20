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

/** Query data to pre-seed so a route can render real content/meta during SSG. */
export interface RenderSeed {
  key: unknown[];
  data: unknown;
}

/** Render a single route to a static HTML string + extracted <head> tags. */
export function render(url: string, seeds: RenderSeed[] = []): { html: string; helmetContext: HelmetState } {
  const helmetContext: HelmetState = {};
  // A fresh, never-refetching client so SSG renders the loading shell only.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, enabled: false } }
  });
  // Seed any provided query data so route components (e.g. the city page) can
  // produce their real <title>/<meta>/JSON-LD even though fetching is disabled.
  for (const seed of seeds) {
    queryClient.setQueryData(seed.key as readonly unknown[], seed.data);
  }
  const html = renderToString(
    <Providers queryClient={queryClient} helmetContext={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </Providers>
  );
  return { html, helmetContext };
}
