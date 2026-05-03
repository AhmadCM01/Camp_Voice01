'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const matricPattern = /^U(\d{2})(CO|C0)(\d{4})$/i;

const requiredLevelForYear: Record<string, string> = {
  '19': '500',
  '21': '400',
  '23': '300',
  '24': '200',
  '26': '100',
};

const normalizeLevel = (level: string) => {
  const v = (level || '').trim();
  return v.endsWith('L') ? v.slice(0, -1) : v;
};

const personalInfoSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  matric_no: z.string().min(1, 'Matric number is required'),
  department: z.string().min(2, 'Department is required'),
  faculty: z.string().min(2, 'Faculty is required'),
  level: z.string().min(1, 'Level is required'),
}).superRefine((data, ctx) => {
  const deptOk = data.department.trim().toLowerCase().includes('computer engineering');
  const facultyOk = data.faculty.trim().toLowerCase().includes('engineering');
  if (!deptOk || !facultyOk) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Access is restricted to Computer Engineering students for this phase.',
      path: ['department'],
    });
  }

  const m = matricPattern.exec(data.matric_no.trim());
  if (!m) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid matric number format. Expected UYYCO#### (e.g., U21CO1234).',
      path: ['matric_no'],
    });
    return;
  }

  const year = m[1];
  const num = Number(m[3]);
  const requiredLevel = requiredLevelForYear[year];
  if (!requiredLevel) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'This matric year is not eligible for this phase.',
      path: ['matric_no'],
    });
    return;
  }

  if (normalizeLevel(data.level) !== requiredLevel) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid level for matric year U${year}. Expected ${requiredLevel} level.`,
      path: ['level'],
    });
  }

  if (year === '19' && (Number.isNaN(num) || num < 1000 || num > 2099)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'U19CO matric numbers must be within U19CO1000 to U19CO20xx for this phase.',
      path: ['matric_no'],
    });
  }
});

const securitySchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
type SecurityValues = z.infer<typeof securitySchema>;

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [personalData, setPersonalData] = useState<PersonalInfoValues | null>(null);
  const { register: registerAction } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [abuDirectory, setAbuDirectory] = useState<Array<{ faculty: string; departments: string[] }>>([]);
  const [facultyOther, setFacultyOther] = useState(false);
  const [departmentOther, setDepartmentOther] = useState(false);
  const router = useRouter();

  const form1 = useForm<PersonalInfoValues>({ 
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      full_name: '',
      email: '',
      matric_no: '',
      department: '',
      faculty: '',
      level: '',
    }
  });
  const form2 = useForm<SecurityValues>({ 
    resolver: zodResolver(securitySchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/v1/meta/abu-directory', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setAbuDirectory(Array.isArray(data?.items) ? data.items : []);
      } catch {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedFaculty = form1.watch('faculty');

  const departmentsForSelectedFaculty = useMemo(() => {
    const entry = abuDirectory.find((x) => x.faculty === selectedFaculty);
    return entry?.departments || [];
  }, [abuDirectory, selectedFaculty]);

  const onStep1Submit = (data: PersonalInfoValues) => {
    setPersonalData(data);
    setStep(2);
  };

  const onStep2Submit = async (data: SecurityValues) => {
    if (!personalData) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      await registerAction({ ...personalData, password: data.password });
      toast.success('Registration successful! Please log in.');
      router.push('/login');
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Registration failed. Check details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background items-center justify-center p-6">
      <Card className="w-full max-w-xl shadow-lg border border-border bg-card rounded-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Create an Account</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {step === 1 ? 'Step 1: Personal Information' : 'Step 2: Security'}
          </CardDescription>
          <div className="w-full bg-border h-2 rounded-full overflow-hidden mt-4">
            <div className={`bg-primary h-full transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
          </div>
        </CardHeader>

        <CardContent>
          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
              {errorMsg}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-semibold text-foreground">Full Name *</Label>
                  <Input id="full_name" {...form1.register('full_name')} className={form1.formState.errors.full_name ? 'border-red-500 focus-visible:ring-red-500' : ''} />
                  {form1.formState.errors.full_name && <p className="text-xs text-red-500">{form1.formState.errors.full_name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email *</Label>
                  <Input id="email" type="email" placeholder="name@example.com" {...form1.register('email')} className={form1.formState.errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''} />
                  {form1.formState.errors.email && <p className="text-xs text-red-500">{form1.formState.errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matric_no" className="text-sm font-semibold text-foreground">Matric Number *</Label>
                  <Input id="matric_no" {...form1.register('matric_no')} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">Level *</Label>
                  <Select 
                    value={form1.watch('level')}
                    onValueChange={(val: string | null) => val && form1.setValue('level', val, { shouldValidate: true })}
                  >
                    <SelectTrigger className={form1.formState.errors.level ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-[#1A531A]'}>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 Level</SelectItem>
                      <SelectItem value="200">200 Level</SelectItem>
                      <SelectItem value="300">300 Level</SelectItem>
                      <SelectItem value="400">400 Level</SelectItem>
                      <SelectItem value="500">500 Level</SelectItem>
                      <SelectItem value="PG">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                  {form1.formState.errors.level && <p className="text-xs text-red-500">{form1.formState.errors.level.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty" className="text-sm font-semibold text-foreground">Faculty *</Label>
                  {abuDirectory.length > 0 && !facultyOther ? (
                    <Select
                      value={form1.watch('faculty')}
                      onValueChange={(val: string | null) => {
                        if (!val) return;
                        if (val === '__other__') {
                          setFacultyOther(true);
                          setDepartmentOther(true);
                          form1.setValue('faculty', '', { shouldValidate: true });
                          form1.setValue('department', '', { shouldValidate: true });
                          return;
                        }
                        setFacultyOther(false);
                        setDepartmentOther(false);
                        form1.setValue('faculty', val, { shouldValidate: true });
                        form1.setValue('department', '', { shouldValidate: true });
                      }}
                    >
                      <SelectTrigger className={form1.formState.errors.faculty ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                        <SelectValue placeholder="Select faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {abuDirectory.map((x) => (
                          <SelectItem key={x.faculty} value={x.faculty}>
                            {x.faculty}
                          </SelectItem>
                        ))}
                        <SelectItem value="__other__">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="faculty"
                      placeholder={abuDirectory.length > 0 ? 'Enter faculty' : undefined}
                      {...form1.register('faculty')}
                      className={form1.formState.errors.faculty ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                  )}
                  {form1.formState.errors.faculty && <p className="text-xs text-red-500">{form1.formState.errors.faculty.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-semibold text-foreground">Department *</Label>
                  {abuDirectory.length > 0 && !departmentOther && !facultyOther ? (
                    <Select
                      value={form1.watch('department')}
                      onValueChange={(val: string | null) => {
                        if (!val) return;
                        if (val === '__other__') {
                          setDepartmentOther(true);
                          form1.setValue('department', '', { shouldValidate: true });
                          return;
                        }
                        setDepartmentOther(false);
                        form1.setValue('department', val, { shouldValidate: true });
                      }}
                      disabled={!form1.watch('faculty')}
                    >
                      <SelectTrigger className={form1.formState.errors.department ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                        <SelectValue placeholder={form1.watch('faculty') ? 'Select department' : 'Select faculty first'} />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentsForSelectedFaculty.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                        <SelectItem value="__other__">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="department"
                      placeholder={abuDirectory.length > 0 ? 'Enter department' : undefined}
                      {...form1.register('department')}
                      className={form1.formState.errors.department ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                  )}
                  {form1.formState.errors.department && <p className="text-xs text-red-500">{form1.formState.errors.department.message}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full mt-6 py-6 text-lg rounded-xl font-bold">
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="space-y-2 relative">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...form2.register('password')}
                    className={`pr-10 ${form2.formState.errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form2.formState.errors.password && <p className="text-xs text-red-500">{form2.formState.errors.password.message}</p>}
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...form2.register('confirmPassword')}
                    className={`pr-10 ${form2.formState.errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form2.formState.errors.confirmPassword && <p className="text-xs text-red-500">{form2.formState.errors.confirmPassword.message}</p>}
              </div>

              <div className="flex gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={submitting} className="flex-1 py-6 rounded-xl font-bold border-[#E6EBE6]">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button type="submit" className="flex-1 py-6 rounded-xl font-bold" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t border-[#E6EBE6] p-6 mt-2">
          <p className="text-sm text-[#525252]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1A531A] font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
