import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user, token) => set({ user, token, isAuthenticated: true, isLoading: false }),
      clearUser: () => set({ user: null, token: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
      
      logout: async () => {
        try {
          // If token exists, tell server to invalidate. But error doesn't matter.
          const { default: api } = await import('../lib/api');
          await api.post('/auth/logout');
        } catch (e) {
          // ignore error
        } finally {
          get().clearUser();
        }
      },
    }),
    {
      name: 'campvoice-auth-mobile',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ token: state.token, user: state.user }), // Persist token and user
    }
  )
);
