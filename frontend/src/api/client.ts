import type { AuthResponse, BlogPost, Booking, City, OwnerApplication, Toikhana, ToikhanaCard } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

// Standalone 2GIS parser service (parser-2gis: `python -m parser_2gis.integrations.toikhana --serve`).
const PARSER_BASE = import.meta.env.VITE_PARSER_URL ?? 'http://localhost:8765';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init?.headers as Record<string, string>) ?? {}),
    ...getUserAuthHeader(),
    ...getAdminAuthHeader()
  };
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function getAdminAuthHeader(): Record<string, string> {
  const auth = localStorage.getItem('toikhana.adminAuth');
  return auth ? { Authorization: `Basic ${auth}` } : {};
}

export function setAdminAuth(username: string, password: string) {
  localStorage.setItem('toikhana.adminAuth', btoa(`${username}:${password}`));
}

export function clearAdminAuth() {
  localStorage.removeItem('toikhana.adminAuth');
}

const TOKEN_KEY = 'toikhana.token';

function getUserAuthHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setUserToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearUserToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function registerUser(payload: { name: string; email: string; phone?: string; password: string }) {
  return request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function loginUser(payload: { email: string; password: string }) {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getCities() {
  return request<City[]>('/api/cities');
}

export function getCity(slug: string) {
  return request<City>(`/api/cities/${slug}`);
}

export function getFeaturedToikhanas() {
  return request<ToikhanaCard[]>('/api/toikhanas/featured');
}

export function getToikhanas(params: { city?: string; type?: string; capacity?: number }) {
  const qs = new URLSearchParams();
  if (params.city) qs.set('city', params.city);
  if (params.type) qs.set('type', params.type);
  if (typeof params.capacity === 'number') qs.set('capacity', String(params.capacity));
  return request<{ items: ToikhanaCard[]; count: number }>(`/api/toikhanas${qs.toString() ? `?${qs}` : ''}`);
}

export function getToikhana(slug: string) {
  return request<Toikhana>(`/api/toikhanas/${slug}`);
}

export function getSimilarToikhanas(slug: string) {
  return request<ToikhanaCard[]>(`/api/toikhanas/${slug}/similar`);
}

export function getBlogPosts() {
  return request<BlogPost[]>('/api/blog');
}

export function getBlogPost(slug: string) {
  return request<BlogPost>(`/api/blog/${slug}`);
}

export function submitBooking(payload: Booking) {
  return request<{ booking: Booking; success: boolean }>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function submitOwnerApplication(payload: {
  name: string;
  city: string;
  phone: string;
  whatsapp?: string;
  hallName?: string;
  message?: string;
}) {
  return request<{ application: OwnerApplication; success: boolean }>('/api/owner-applications', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function adminLogin(username: string, password: string) {
  setAdminAuth(username, password);
  return request('/api/admin/toikhanas');
}

export function getAdminToikhanas() {
  return request<ToikhanaCard[]>('/api/admin/toikhanas');
}

export function getAdminBookings() {
  return request<Booking[]>('/api/admin/bookings');
}

export function getAdminOwnerApplications() {
  return request<OwnerApplication[]>('/api/admin/owner-applications');
}

export function createAdminToikhana(payload: Record<string, unknown>) {
  return request('/api/admin/toikhanas', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function uploadAdminToikhanaPhoto(
  id: number,
  file: File,
  isMain: boolean,
  sortOrder?: number
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('isMain', String(isMain));
  if (typeof sortOrder === 'number') {
    formData.append('sortOrder', String(sortOrder));
  }
  return fetch(`${API_BASE}/api/admin/toikhanas/${id}/photos`, {
    method: 'POST',
    body: formData,
    headers: {
      ...(getAdminAuthHeader())
    }
  }).then(async (response) => {
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error ?? `Request failed: ${response.status}`);
    }
    return response.json();
  });
}

export interface Import2gisResult {
  parsed: number;
  sent: number;
  toikhana: { created: number; skipped: number; photosDownloaded: number };
}

export function importFrom2gis(payload: {
  url: string;
  cityId: number;
  active?: boolean;
  withPhotos?: boolean;
  maxRecords?: number;
}): Promise<Import2gisResult> {
  const body: Record<string, unknown> = {
    url: payload.url,
    cityId: payload.cityId,
    active: payload.active ?? true,
    withPhotos: payload.withPhotos ?? true,
    toikhanaUrl: API_BASE || 'http://localhost:8080'
  };
  if (typeof payload.maxRecords === 'number') {
    body.maxRecords = payload.maxRecords;
  }
  // Let the parser authenticate to toikhana with the same admin credentials.
  const adminAuth = localStorage.getItem('toikhana.adminAuth');
  if (adminAuth) {
    body.auth = atob(adminAuth);
  }
  return fetch(`${PARSER_BASE}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(async (response) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error ?? `Import failed: ${response.status}`);
    }
    return response.json() as Promise<Import2gisResult>;
  });
}

export function updateBookingStatus(id: number, status: string) {
  return request<Booking>(`/api/admin/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}

export function updateOwnerApplicationStatus(id: number, status: string) {
  return request<OwnerApplication>(`/api/admin/owner-applications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}
