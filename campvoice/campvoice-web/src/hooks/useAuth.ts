import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  const handleLogin = async (identifier: string, pass: string) => {
    const res = await api.post('/auth/login', { identifier, password: pass });
    useAuthStore.getState().setUser(res.data.user, res.data.access_token);
    return res.data;
  };

  const handleRegister = async (data: Record<string, unknown>) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  };

  const handleLogout = async () => {
    await useAuthStore.getState().logout(true);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };
}
