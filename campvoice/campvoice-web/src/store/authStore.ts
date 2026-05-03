import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  matric_no?: string;
  department?: string;
  faculty?: string;
  level?: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  logout: (redirect?: boolean) => Promise<void>;
  validateSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // initial state
      
      setUser: (user, token) => {
        const t = (token || '').trim();
        const normalized = t.toLowerCase().startsWith('bearer ') ? t.slice(7).trim() : t;
        set({ user, token: normalized, isAuthenticated: true, isLoading: false });
      },
      clearUser: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      setLoading: (isLoading) => set({ isLoading }),
      
      logout: async (redirect = true) => {
        try {
          const { default: api } = await import('@/lib/api');
          await api.post('/auth/logout');
        } catch {
          // ignore logout error
        } finally {
          get().clearUser();
          if (redirect && typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      },
      
      validateSession: async () => {
        set({ isLoading: true });
        try {
          const { default: api } = await import('@/lib/api');
          const t = get().token;
          const res = await api.get('/auth/me', {
            headers: t ? { Authorization: `Bearer ${t}` } : undefined,
          });
          if (res.data) {
            set({ user: res.data, isAuthenticated: true });
          }
        } catch {
          get().clearUser();
          if (typeof window !== 'undefined') {
            const p = window.location.pathname;
            const protectedPath =
              p.startsWith('/dashboard') ||
              p.startsWith('/admin') ||
              p.startsWith('/complaints') ||
              p.startsWith('/notifications');
            if (protectedPath) window.location.href = '/login';
          }
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'campvoice-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false);
      },
    }
  )
);
