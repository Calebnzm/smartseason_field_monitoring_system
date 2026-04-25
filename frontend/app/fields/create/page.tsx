'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { createFieldSchema, type CreateFieldInput } from '@/lib/schemas';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function CreateFieldPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayError, setDisplayError] = useState<string | null>(null);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  // Fetch agents for assignment
  const { data: agents } = useSWR(
    user?.role === 'admin' ? '/users/?role=agent' : null,
    fetcher
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateFieldInput>({
    resolver: zodResolver(createFieldSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const onSubmit = async (data: CreateFieldInput) => {
    setIsSubmitting(true);
    setDisplayError(null);

    try {
      const payload = {
        name: data.name,
        crop_type: data.crop_type,
        location: {
          latitude: parseFloat(data.location_latitude),
          longitude: parseFloat(data.location_longitude),
        },
        size_hectares: parseFloat(data.size_hectares),
        planting_date: data.planting_date,
        assigned_agent: data.assigned_agent ? parseInt(data.assigned_agent) : null,
      };

      await api.post('/fields/', payload);
      setDisplaySuccess(true);
      reset();
      setTimeout(() => {
        router.push('/fields');
      }, 1500);
    } catch (err: any) {
      setDisplayError(
        err.response?.data?.detail || 'Failed to create field. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back Button */}
      <Link href="/fields" className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mb-6 transition">
        <ArrowLeft size={18} />
        Back to Fields
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-text)]">
          Create New Field
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-2">
          Add a new field to your monitoring system
        </p>
      </div>

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {displaySuccess && (
            <Alert
              type="success"
              title="Success!"
              message="Field created successfully. Redirecting..."
              onClose={() => setDisplaySuccess(false)}
            />
          )}

          {displayError && (
            <Alert
              type="error"
              title="Failed to create field"
              message={displayError}
              onClose={() => setDisplayError(null)}
            />
          )}

          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <FormInput
                label="Field Name"
                placeholder="e.g., North Field"
                required
                error={errors.name}
                {...register('name')}
              />

              <FormInput
                label="Crop Type"
                placeholder="e.g., Maize, Wheat, Rice"
                required
                error={errors.crop_type}
                {...register('crop_type')}
              />

              <FormInput
                label="Field Size (hectares)"
                type="number"
                step="0.01"
                placeholder="e.g., 5.5"
                required
                error={errors.size_hectares}
                {...register('size_hectares')}
              />

              <FormInput
                label="Planting Date"
                type="date"
                required
                error={errors.planting_date}
                {...register('planting_date')}
              />
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Location
            </h2>
            <div className="space-y-4">
              <FormInput
                label="Latitude"
                type="number"
                step="0.0001"
                placeholder="e.g., -1.2345"
                required
                error={errors.location_latitude}
                helperText="GPS coordinate"
                {...register('location_latitude')}
              />

              <FormInput
                label="Longitude"
                type="number"
                step="0.0001"
                placeholder="e.g., 36.7890"
                required
                error={errors.location_longitude}
                helperText="GPS coordinate"
                {...register('location_longitude')}
              />
            </div>
          </div>

          {/* Assignment */}
          {agents && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                Assignment
              </h2>
              <FormSelect
                label="Assign Agent"
                options={agents.map((agent: any) => ({
                  value: agent.id,
                  label: `${agent.first_name} ${agent.last_name}`,
                }))}
                error={errors.assigned_agent}
                {...register('assigned_agent')}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-[var(--color-border)]">
            <Link href="/fields" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="flex-1"
            >
              Create Field
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
