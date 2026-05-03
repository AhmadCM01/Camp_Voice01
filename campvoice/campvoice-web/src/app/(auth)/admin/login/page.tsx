'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const adminLoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await api.post('/admin/auth/login', { identifier: data.email, password: data.password });
      useAuthStore.getState().setUser(res.data.user, res.data.access_token);
      router.push('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Admin login failed. Try again.';
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-[#2A7A2A] flex-col items-center justify-center p-12 text-primary-foreground">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-10 w-10" />
          <h1 className="text-4xl font-bold">Admin Portal</h1>
        </div>
        <p className="text-lg text-primary-foreground/90 mb-8 max-w-md text-center">
          Department admins manage and resolve complaints for their unit.
        </p>
        <p className="text-sm text-primary-foreground/80 mt-auto">CampVoice</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md shadow-lg border border-border bg-card rounded-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Admin sign in</CardTitle>
            <CardDescription className="text-muted-foreground">
              Use your admin email and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMsg ? (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
                {errorMsg}
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  {...register('email')}
                  className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.email ? <p className="text-xs text-red-500">{errors.email.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password ? <p className="text-xs text-red-500">{errors.password.message}</p> : null}
              </div>

              <Button type="submit" className="w-full font-bold py-6 text-lg rounded-xl mt-4" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border p-6 mt-2">
            <p className="text-sm text-muted-foreground">
              Student?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
