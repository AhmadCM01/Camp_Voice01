import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useComplaints(page = 1, status?: string, category?: string) {
  const queryClient = useQueryClient();

  const complaintsQuery = useQuery({
    queryKey: ['complaints', { page, status, category }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString() });
      if (status && status !== 'All') params.append('status', status.toLowerCase());
      if (category && category !== 'All') params.append('category', category);
      
      const res = await api.get(`/complaints?${params.toString()}`);
      return res.data;
    },
    staleTime: 30000,
  });

  const createComplaint = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await api.post('/complaints', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });

  return {
    data: complaintsQuery.data,
    isLoading: complaintsQuery.isLoading,
    error: complaintsQuery.error,
    createComplaint,
    refetch: complaintsQuery.refetch,
  };
}

export function useComplaint(id: string) {
  const query = useQuery({
    queryKey: ['complaints', id],
    queryFn: async () => {
      const res = await api.get(`/complaints/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  return {
    complaint: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
