import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export type NotificationItem = {
  id: string;
  user_id: string;
  complaint_id?: string | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export function useNotifications() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data as { items: NotificationItem[] };
    },
    staleTime: 15000,
    refetchInterval: 30000,
    enabled: Boolean(token) && isAuthenticated,
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/notifications/${id}/read`);
      return res.data as { item: NotificationItem };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      const res = await api.patch('/notifications/read-all');
      return res.data as { message: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const items = notificationsQuery.data?.items || [];
  const unreadCount = items.filter((n) => !n.is_read).length;

  return {
    items,
    unreadCount,
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    refetch: notificationsQuery.refetch,
    markRead,
    markAllRead,
  };
}
