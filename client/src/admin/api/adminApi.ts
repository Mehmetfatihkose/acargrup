const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem('acar_admin_token');
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  try {
    localStorage.setItem('acar_admin_token', token);
  } catch {
    // LocalStorage fallback
  }
}

export function clearAdminToken(): void {
  try {
    localStorage.removeItem('acar_admin_token');
  } catch {
    // LocalStorage fallback
  }
}

async function safeParseJson(res: Response): Promise<any> {
  const text = await res.text();
  if (!text || !text.trim()) {
    if (!res.ok) {
      throw new Error(`Sunucu bağlantı hatası: HTTP ${res.status} ${res.statusText || ''}`.trim());
    }
    return { success: true, data: null };
  }
  try {
    return JSON.parse(text);
  } catch {
    if (!res.ok) {
      throw new Error(`Sunucu hatası (${res.status}): ${text.slice(0, 120)}`);
    }
    throw new Error(`Sunucudan beklenmeyen yanıt formatı alındı.`);
  }
}

async function adminFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'AcarAdminPanel',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const payload = await safeParseJson(res);
  if (!res.ok || !payload.success) {
    if (res.status === 401 && endpoint !== '/admin/login') {
      clearAdminToken();
      window.location.href = '/admin/login';
    }
    throw new Error(payload.message || 'İşlem sırasında bir hata oluştu.');
  }

  return payload.data;
}

// Auth API
export async function loginAdminApi(username: string, password: string) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Requested-With': 'AcarAdminPanel' },
    body: JSON.stringify({ username, password }),
  });
  const data = await safeParseJson(res);
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Giriş yapılamadı.');
  }
  setAdminToken(data.data.token);
  return data.data;
}

export async function logoutAdminApi() {
  try {
    await adminFetch('/admin/logout', { method: 'POST' });
  } finally {
    clearAdminToken();
  }
}

export async function getAdminMeApi() {
  return adminFetch<{ id: number; username: string; name: string; role: string }>('/admin/me');
}

export interface UpdateProfilePayload {
  name: string;
  username: string;
  currentPassword?: string;
  newPassword?: string;
}

export async function updateAdminProfileApi(payload: UpdateProfilePayload) {
  return adminFetch<{ id: number; username: string; name: string; role: string }>('/admin/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// Dashboard API
export interface DashboardMetrics {
  projects: number;
  products: number;
  totalQuotes: number;
  pendingQuotes: number;
  totalMessages: number;
  unreadMessages: number;
  news: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentQuotes: any[];
  recentMessages: any[];
}

export async function getAdminDashboardApi(): Promise<DashboardData> {
  return adminFetch<DashboardData>('/admin/dashboard');
}

// Quotes API
export async function getAdminQuotesApi() {
  return adminFetch<any[]>('/admin/quotes');
}

export async function updateAdminQuoteStatusApi(id: number, status: string) {
  return adminFetch(`/admin/quotes/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteAdminQuoteApi(id: number) {
  return adminFetch(`/admin/quotes/${id}`, { method: 'DELETE' });
}

// Messages API
export async function getAdminMessagesApi() {
  return adminFetch<any[]>('/admin/messages');
}

export async function toggleAdminMessageReadApi(id: number, is_read: boolean) {
  return adminFetch(`/admin/messages/${id}/read`, {
    method: 'PATCH',
    body: JSON.stringify({ is_read }),
  });
}

export async function deleteAdminMessageApi(id: number) {
  return adminFetch(`/admin/messages/${id}`, { method: 'DELETE' });
}

// Projects API
export async function getAdminProjectsApi() {
  return adminFetch<any[]>('/admin/projects');
}

export async function createAdminProjectApi(data: any) {
  return adminFetch('/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminProjectApi(id: number, data: any) {
  return adminFetch(`/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminProjectApi(id: number) {
  return adminFetch(`/admin/projects/${id}`, { method: 'DELETE' });
}

// Products API
export async function getAdminProductsApi() {
  return adminFetch<any[]>('/admin/products');
}

export async function createAdminProductApi(data: any) {
  return adminFetch('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminProductApi(id: number, data: any) {
  return adminFetch(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminProductApi(id: number) {
  return adminFetch(`/admin/products/${id}`, { method: 'DELETE' });
}

// News API
export async function getAdminNewsApi() {
  return adminFetch<any[]>('/admin/news');
}

export async function createAdminNewsApi(data: any) {
  return adminFetch('/admin/news', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminNewsApi(id: number, data: any) {
  return adminFetch(`/admin/news/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminNewsApi(id: number) {
  return adminFetch(`/admin/news/${id}`, { method: 'DELETE' });
}

// Milestones API
export interface MilestoneData {
  id: number;
  year: number;
  title: string;
  description: string;
}

export async function getAdminMilestonesApi() {
  return adminFetch<MilestoneData[]>('/admin/milestones');
}

export async function createAdminMilestoneApi(data: Omit<MilestoneData, 'id'>) {
  return adminFetch('/admin/milestones', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminMilestoneApi(id: number, data: Omit<MilestoneData, 'id'>) {
  return adminFetch(`/admin/milestones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminMilestoneApi(id: number) {
  return adminFetch(`/admin/milestones/${id}`, { method: 'DELETE' });
}

// Certificates API
export interface CertificateData {
  id: number;
  name: string;
  image: string;
  description: string;
}

export async function getAdminCertificatesApi() {
  return adminFetch<CertificateData[]>('/admin/certificates');
}

export async function createAdminCertificateApi(data: Omit<CertificateData, 'id'>) {
  return adminFetch('/admin/certificates', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminCertificateApi(id: number, data: Omit<CertificateData, 'id'>) {
  return adminFetch(`/admin/certificates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminCertificateApi(id: number) {
  return adminFetch(`/admin/certificates/${id}`, { method: 'DELETE' });
}

// Stats API
export interface StatData {
  id: number;
  label: string;
  value: number;
  suffix: string;
  sort_order: number;
}

export async function getAdminStatsApi() {
  return adminFetch<StatData[]>('/admin/stats');
}

export async function createAdminStatApi(data: Omit<StatData, 'id'>) {
  return adminFetch('/admin/stats', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminStatApi(id: number, data: Omit<StatData, 'id'>) {
  return adminFetch(`/admin/stats/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminStatApi(id: number) {
  return adminFetch(`/admin/stats/${id}`, { method: 'DELETE' });
}

// Settings API (CMS)
export interface SettingItem {
  key: string;
  value: string;
  group_name: string;
  label: string;
  type: 'text' | 'textarea' | 'image';
}

export async function getAdminSettingsApi() {
  return adminFetch<SettingItem[]>('/admin/settings');
}

export async function updateAdminSettingsApi(data: Record<string, string>) {
  return adminFetch('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Media API
export interface SettingHistoryItem {
  id: number;
  setting_key: string;
  old_value: string;
  new_value: string;
  changed_by: string;
  changed_at: string;
}

export async function getSettingHistoryApi(key: string) {
  return adminFetch<SettingHistoryItem[]>(`/admin/settings/history?key=${encodeURIComponent(key)}`);
}

export async function restoreSettingApi(historyId: number) {
  return adminFetch<{ key: string; value: string }>('/admin/settings/restore', {
    method: 'POST',
    body: JSON.stringify({ historyId }),
  });
}

// Media API
export interface MediaItem {
  filename: string;
  url: string;
  size: number;
  isUpload: boolean;
  modifiedAt: string;
}

export async function getAdminMediaApi() {
  return adminFetch<MediaItem[]>('/admin/media');
}

export async function uploadAdminMediaApi(file: File) {
  const token = getAdminToken();
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'AcarAdminPanel',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/admin/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const payload = await safeParseJson(res);
  if (!res.ok || !payload.success) {
    throw new Error(payload.message || 'Dosya yüklenirken hata oluştu.');
  }
  return payload.data as { url: string; filename: string; size: number };
}

