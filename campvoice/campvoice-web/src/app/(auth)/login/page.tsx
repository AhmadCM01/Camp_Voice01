'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or matric number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await login(data.identifier, data.password);
      if (res.user.role === 'student') {
        router.push('/dashboard');
      } else {
        router.push('/admin');
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Login failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-[#2A7A2A] flex-col items-center justify-center p-12 text-primary-foreground">
        <h1 className="text-5xl font-bold mb-4">CampVoice</h1>
        <p className="text-xl text-primary-foreground/90 mb-8 max-w-md text-center">Your Voice. Your Campus. Real Solutions.</p>
        <p className="text-sm text-primary-foreground/80 mt-auto">Ahmadu Bello University</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md shadow-lg border border-border bg-card rounded-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMsg && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm animate-in slide-in-from-top-2">
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-semibold text-foreground">Email or Matric Number</Label>
                <Input
                  id="identifier"
                  placeholder="name@example.com or U12XX..."
                  {...register('identifier')}
                  className={errors.identifier ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-[#1A531A]'}
                />
                {errors.identifier && <p className="text-xs text-red-500">{errors.identifier.message}</p>}
              </div>
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-[#1A531A]'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full font-bold py-6 text-lg rounded-xl mt-4" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border p-6 mt-2">
            <div className="text-sm text-muted-foreground text-center space-y-2">
              <div>
                New student?{' '}
                <Link href="/register" className="text-primary font-bold hover:underline">
                  Register here
                </Link>
              </div>
              <div>
                Admin?{' '}
                <Link href="/admin/login" className="text-primary font-bold hover:underline">
                  Sign in here
                </Link>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
