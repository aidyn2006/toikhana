import type { Booking, City, Toikhana, ToikhanaCard } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
      ...(getAdminAuthHeader())
    },
    ...init
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function getAdminAuthHeader() {
  const auth = localStorage.getItem('toikhana.adminAuth');
  return auth ? { Authorization: `Basic ${auth}` } : {};
}

export function setAdminAuth(username: string, password: string) {
  localStorage.setItem('toikhana.adminAuth', btoa(`${username}:${password}`));
}

export function clearAdminAuth() {
  localStorage.removeItem('toikhana.adminAuth');
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

export function submitBooking(payload: Booking) {
  return request<{ booking: Booking; success: boolean }>('/api/bookings', {
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

export function updateBookingStatus(id: number, status: string) {
  return request<Booking>(`/api/admin/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}
