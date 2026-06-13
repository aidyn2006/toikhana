import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { App } from './App';
import { Providers } from './providers';
import './index.css';

const queryClient = new QueryClient();
const container = document.getElementById('root') as HTMLElement;

const app = (
  <React.StrictMode>
    <Providers queryClient={queryClient} helmetContext={{}}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Providers>
  </React.StrictMode>
);

// Prerendered routes ship real markup in #root — hydrate it; otherwise mount fresh.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
