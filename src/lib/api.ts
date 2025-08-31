import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiFetch(path: string, options: ApiOptions = {}) {
  const { requireAuth = true, ...fetchOptions } = options;
  
  const url = `${API_BASE_URL}${path}`;
  
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
