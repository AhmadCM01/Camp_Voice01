'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useComplaints } from '@/hooks/useComplaints';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const complaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Please provide more details (min 20 characters)'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().optional(),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export default function NewComplaintPage() {
  const router = useRouter();
  const { createComplaint } = useComplaints();
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      location: '',
    },
  });

  const onSubmit = async (data: ComplaintFormValues) => {
    setSubmitting(true);
    try {
      // In a real app we'd upload images to Supabase Storage first, then pass URLs.
      // For MVP, we submit text data.
      await createComplaint.mutateAsync(data);
      toast.success('Complaint submitted successfully');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit complaint';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sign a New Complaint</h1>
          <p className="text-gray-500">Provide details about the issue you are facing.</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="pt-6 space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input 
                id="title" 
                placeholder="E.g., Broken pipe in Block A" 
                {...register('title')} 
                className={errors.title ? 'border-danger focus-visible:ring-danger' : 'focus-visible:ring-olive-500'} 
              />
              {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select onValueChange={(val: string | null) => val && setValue('category', val, { shouldValidate: true })}>
                  <SelectTrigger className={errors.category ? 'border-danger focus-visible:ring-danger' : 'focus-visible:ring-olive-500'}>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Hostel">Hostel/Accommodation</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-danger">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input 
                  id="location" 
                  placeholder="E.g., Ribadu Hostel, Room 102" 
                  {...register('location')} 
                  className="focus-visible:ring-olive-500" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea 
                id="description" 
                placeholder="Explain the issue in detail..." 
                rows={6}
                {...register('description')} 
                className={`resize-none ${errors.description ? 'border-danger focus-visible:ring-danger' : 'focus-visible:ring-olive-500'}`} 
              />
              {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={(e) => setImages(e.target.files)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">Click or drag images here</p>
                <p className="text-xs text-gray-500 mt-1">
                  {images && images.length > 0 ? `${images.length} file(s) selected` : 'PNG, JPG up to 5MB'}
                </p>
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t bg-gray-50/50 p-6">
            <Link href="/dashboard">
              <Button type="button" variant="outline" disabled={submitting}>Cancel</Button>
            </Link>
            <Button type="submit" className="bg-olive-600 hover:bg-olive-700 text-white" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                'Submit Complaint'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
