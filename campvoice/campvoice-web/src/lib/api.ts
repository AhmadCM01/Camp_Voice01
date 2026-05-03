import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

function normalizeToken(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const t = raw.trim();
  if (!t) return null;
  return t.toLowerCase().startsWith('bearer ') ? t.slice(7).trim() : t;
}

const envBaseUrl = process.env.NEXT_PUBLIC_API_URL;
const apiBaseUrl = envBaseUrl && envBaseUrl.startsWith('/') ? envBaseUrl : '/api/v1';

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Note: The HTTPOnly cookie is used natively for the request via withCredentials=true.
    // If the frontend maintains an access_token in the Zustand store, we append it.
    let token = normalizeToken(useAuthStore.getState().token);
    if (!token && typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('campvoice-auth');
        if (raw) {
          const parsed = JSON.parse(raw);
          const persistedToken = parsed?.state?.token;
          token = normalizeToken(persistedToken);
        }
      } catch {
      }
    }
    config.headers = config.headers ?? {};
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const requestUrl: string = error.config?.url || '';
    const isAuthRoute =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh') ||
      requestUrl.includes('/auth/logout');

    const customMessage = error.response?.data?.detail;
    if (customMessage) {
      return Promise.reject(new Error(customMessage));
    }

    if (status === 401 && !isAuthRoute) {
      return Promise.reject(new Error('Not authenticated'));
    }
    
    if (!error.response) {
      return Promise.reject(
        new Error('Network Error: API server is unreachable. Start the backend on http://127.0.0.1:8000.')
      );
    }
    return Promise.reject(error);
  }
);

export default api;
