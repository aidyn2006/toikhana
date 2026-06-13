import { useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AdminPage } from './pages/AdminPage';
import { CityPage } from './pages/CityPage';
import { HomePage } from './pages/HomePage';
import { ToikhanaPage } from './pages/ToikhanaPage';
import { AboutPage } from './pages/AboutPage';
import { ContactsPage } from './pages/ContactsPage';
import { AddToikhanaPage } from './pages/AddToikhanaPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { getCities } from './api/client';
import { SiteFooter, SiteHeader } from './components';

/** GA4 page_view on client-side route changes (the initial load is sent by gtag config). */
function usePageViews() {
  const location = useLocation();
  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title
      });
    }
  }, [location.pathname, location.search]);
}

export function App() {
  usePageViews();
  const citiesQuery = useQuery({ queryKey: ['shell', 'cities'], queryFn: getCities });
  const cities = citiesQuery.data ?? [];
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader cities={cities} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/toikhana/:slug" element={<ToikhanaPage />} />
        <Route path="/city/:citySlug" element={<CityPage />} />
        <Route path="/:citySlug" element={<CityPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/add-toikhana" element={<AddToikhanaPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SiteFooter cities={cities} />
    </div>
  );
}
