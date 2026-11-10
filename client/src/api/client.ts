import type { ApiResponse, MutationResponse } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

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
    throw new Error(`Sunucudan geçerli bir JSON yanıtı alınamadı.`);
  }
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  const payload = (await safeParseJson(response)) as ApiResponse<T> & { message?: string };

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Veriler alınırken bir hata oluştu.');
  }

  return payload.data;
}

export async function apiPost<TPayload>(
  endpoint: string,
  body: TPayload
): Promise<MutationResponse> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = (await safeParseJson(response)) as MutationResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'İşlem sırasında bir hata oluştu.');
  }

  return payload;
}

