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
import { useError } from '@/lib/useError';
import { formatValidationErrors } from '@/lib/error-handler';
import { createFieldSchema, type CreateFieldInput } from '@/lib/schemas';
import { ArrowLeft, CheckCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function CreateFieldPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { error: displayError, handleError, clearError } = useError();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  // Fetch agents for assignment
  const { data: agents, isLoading: agentsLoading } = useSWR(
    user?.role === 'admin' ? '/users/?role=agent' : null,
    fetcher,
    { revalidateOnReconnect: true }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateFieldInput>({
    resolver: zodResolver(createFieldSchema),
    mode: 'onChange',
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
    clearError();

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
      }, 2000);
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <div className="h-10 w-1/3 bg-gradient-to-r from-var(--color-surface-secondary) via-var(--color-surface-tertiary) to-var(--color-surface-secondary) rounded animate-pulse"></div>
          <div className="card space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-12 bg-gradient-to-r from-var(--color-surface-secondary) via-var(--color-surface-tertiary) to-var(--color-surface-secondary) rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (displaySuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Field Created Successfully!</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Your new field has been added to the system. Redirecting to fields list...
          </p>
          <Button variant="primary" onClick={() => router.push('/fields')}>
            Go to Fields
          </Button>
        </div>
      </div>
    );
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
          {displayError && (
            <Alert
              type="error"
              title="Failed to Create Field"
              message={displayError.userMessage}
              details={displayError.details ? formatValidationErrors(displayError.details) : undefined}
              onClose={clearError}
              dismissible
            />
          )}

          {Object.keys(errors).length > 0 && (
            <Alert
              type="warning"
              title="Please review the errors below"
              message="Some fields have validation errors. Please correct them and try again."
              dismissible={false}
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
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <MapPin size={20} />
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
                helperText="GPS coordinate (decimal format)"
                {...register('location_latitude')}
              />

              <FormInput
                label="Longitude"
                type="number"
                step="0.0001"
                placeholder="e.g., 36.7890"
                required
                error={errors.location_longitude}
                helperText="GPS coordinate (decimal format)"
                {...register('location_longitude')}
              />
            </div>
          </div>

          {/* Assignment */}
          {user.role === 'admin' && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
                Assignment (Optional)
              </h2>
              {agentsLoading ? (
                <div className="p-4 bg-[var(--color-surface-secondary)] rounded text-[var(--color-text-secondary)]">
                  Loading available agents...
                </div>
              ) : agents && agents.length > 0 ? (
                <FormSelect
                  label="Assign to Agent"
                  options={[
                    { value: '', label: 'No assignment' },
                    ...agents.map((agent: any) => ({
                      value: agent.id.toString(),
                      label: `${agent.first_name} ${agent.last_name}`,
                    })),
                  ]}
                  error={errors.assigned_agent}
                  {...register('assigned_agent')}
                />
              ) : (
                <div className="p-4 bg-[var(--color-surface-secondary)] rounded text-[var(--color-text-secondary)]">
                  No agents available to assign
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-[var(--color-border)]">
            <Link href="/fields" className="flex-1">
              <Button variant="outline" size="lg" fullWidth>
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              fullWidth
              disabled={!isValid || isSubmitting}
            >
              Create Field
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
