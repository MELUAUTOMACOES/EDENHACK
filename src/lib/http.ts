// Cliente HTTP centralizado para comunicação com o backend
const baseURL = (import.meta as any).env?.VITE_API_URL?.replace(/\/+$/, "") ?? "";

async function req<T>(path: string, init?: RequestInit) {
  const res = await fetch(baseURL + path, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

export const get = <T = any>(p: string, params?: Record<string, any>) =>
  req<T>(p + (params ? "?" + new URLSearchParams(params).toString() : ""));

export const post = <T = any>(p: string, data?: any) =>
  req<T>(p, { method: "POST", body: JSON.stringify(data ?? {}) });

export const put = <T = any>(p: string, data?: any) =>
  req<T>(p, { method: "PUT", body: JSON.stringify(data ?? {}) });

export const del = <T = any>(p: string) =>
  req<T>(p, { method: "DELETE" });

// Versão com autenticação (para manter compatibilidade com o sistema atual)
import { supabase } from './supabaseClient';

interface AuthenticatedRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function authenticatedRequest<T>(path: string, options: AuthenticatedRequestOptions = {}): Promise<T> {
  const { requireAuth = true, ...fetchOptions } = options;
  
  const url = `${baseURL}${path}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (requireAuth) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
