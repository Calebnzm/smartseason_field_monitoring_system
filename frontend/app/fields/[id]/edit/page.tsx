'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useSWR from 'swr';
import { api, Field } from '@/lib/api';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { updateFieldSchema, type UpdateFieldInput } from '@/lib/schemas';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function EditFieldPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayError, setDisplayError] = useState<string | null>(null);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  const fieldId = (params?.id || '') as string;

  const { data: field, isLoading: fieldLoading } = useSWR<Field>(
    fieldId ? `/fields/${fieldId}/` : null,
    fetcher
  );

  const { data: agents } = useSWR(
    user?.role === 'admin' ? '/users/?role=agent' : null,
    fetcher
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateFieldInput>({
    resolver: zodResolver(updateFieldSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  // Populate form with field data
  useEffect(() => {
    if (field) {
      reset({
        name: field.name,
        crop_type: field.crop_type,
        location_latitude: field.location.latitude.toString(),
        location_longitude: field.location.longitude.toString(),
        size_hectares: field.size_hectares.toString(),
        planting_date: field.planting_date,
        assigned_agent: field.assigned_agent?.toString(),
      });
    }
  }, [field, reset]);

  const onSubmit = async (data: UpdateFieldInput) => {
    if (!fieldId) return;

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

      await api.patch(`/fields/${fieldId}/`, payload);
      setDisplaySuccess(true);
      setTimeout(() => {
        router.push(`/fields/${fieldId}`);
      }, 1500);
    } catch (err: any) {
      setDisplayError(
        err.response?.data?.detail || 'Failed to update field. Please try again.'
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

  if (fieldLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!field) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/fields" className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mb-6">
          <ArrowLeft size={18} />
          Back to Fields
        </Link>
        <Alert type="error" title="Field not found" message="The field you are looking for does not exist." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back Button */}
      <Link href={`/fields/${fieldId}`} className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mb-6 transition">
        <ArrowLeft size={18} />
        Back to Field
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-text)]">
          Edit {field.name}
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-2">
          Update field information
        </p>
      </div>

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {displaySuccess && (
            <Alert
              type="success"
              title="Success!"
              message="Field updated successfully. Redirecting..."
              onClose={() => setDisplaySuccess(false)}
            />
          )}

          {displayError && (
            <Alert
              type="error"
              title="Failed to update field"
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
            <Link href={`/fields/${fieldId}`} className="flex-1">
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
              Update Field
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
