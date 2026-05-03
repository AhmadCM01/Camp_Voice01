'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const createAdminSchema = z.object({
  email: z.string().email('Valid email is required'),
  full_name: z.string().min(2, 'Full name is required'),
  department: z.string().min(2, 'Department is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type CreateAdminValues = z.infer<typeof createAdminSchema>;

type AdminUser = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department?: string | null;
  is_active: boolean;
};

export default function AdminUsersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<CreateAdminValues>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      email: '',
      full_name: '',
      department: '',
      password: '',
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/admins');
      return res.data as { items: AdminUser[] };
    },
    enabled: user?.role === 'super_admin',
  });

  const createAdmin = useMutation({
    mutationFn: async (payload: CreateAdminValues) => {
      const res = await api.post('/admin/admins', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Admin created');
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to create admin';
      toast.error(message);
    },
  });

  if (user?.role !== 'super_admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
          <CardDescription>Super admin access required.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Management</h1>
        <p className="text-sm text-muted-foreground">
          Create department admins. Set the department exactly as students use it (matching is case-insensitive).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Department Admin</CardTitle>
          <CardDescription>Admins sign in only via the admin portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit((v) => createAdmin.mutate(v))}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register('email')} />
              {form.formState.errors.email ? (
                <p className="text-xs text-danger">{form.formState.errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" {...form.register('full_name')} />
              {form.formState.errors.full_name ? (
                <p className="text-xs text-danger">{form.formState.errors.full_name.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="Computer Engineering" {...form.register('department')} />
              {form.formState.errors.department ? (
                <p className="text-xs text-danger">{form.formState.errors.department.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Temporary password</Label>
              <Input id="password" type="password" {...form.register('password')} />
              {form.formState.errors.password ? (
                <p className="text-xs text-danger">{form.formState.errors.password.message}</p>
              ) : null}
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={createAdmin.isPending}>
                {createAdmin.isPending ? 'Creating…' : 'Create Admin'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admins</CardTitle>
          <CardDescription>All admin and super admin accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : isError ? (
            <div className="text-sm text-danger">Failed to load admins</div>
          ) : (
            <div className="space-y-2">
              {(data?.items || []).map((a: AdminUser) => (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-border p-3">
                  <div>
                    <div className="font-semibold text-foreground">{a.full_name} <span className="text-xs text-muted-foreground">({a.role})</span></div>
                    <div className="text-xs text-muted-foreground">{a.email}</div>
                    <div className="text-xs text-muted-foreground">Department: {a.department || '—'}</div>
                  </div>
                  <div className="text-xs">{a.is_active ? 'Active' : 'Disabled'}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
