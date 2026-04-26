'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { api, Field, FieldUpdate } from '@/lib/api';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { SkeletonCard, SkeletonLine } from '@/components/Skeleton';
import { useError } from '@/lib/useError';
import { formatValidationErrors } from '@/lib/error-handler';
import Link from 'next/link';
import { ArrowLeft, MapPin, Leaf, User, Zap, Edit, Trash2, RefreshCw } from 'lucide-react';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function FieldDetailPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { error: displayError, handleError, clearError } = useError();
  const [mounted, setMounted] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fieldId = (params?.id || '') as string;

  const { 
    data: field, 
    error: fieldError, 
    isLoading: fieldLoading,
    mutate: refetchField 
  } = useSWR<Field>(
    fieldId ? `/fields/${fieldId}/` : null,
    fetcher,
    { revalidateOnReconnect: true }
  );

  const { 
    data: updates, 
    error: updatesError, 
    isLoading: updatesLoading,
    mutate: refetchUpdates 
  } = useSWR<FieldUpdate[]>(
    fieldId ? `/fields/${fieldId}/updates/` : null,
    fetcher,
    { revalidateOnReconnect: true }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Handle errors
  useEffect(() => {
    if (fieldError) {
      handleError(fieldError);
    }
  }, [fieldError, handleError]);

  useEffect(() => {
    if (updatesError) {
      handleError(updatesError);
    }
  }, [updatesError, handleError]);

  const handleDelete = async () => {
    if (!fieldId) return;

    setIsDeleting(true);
    setDeleteError(null);
    try {
      await api.delete(`/fields/${fieldId}/`);
      router.push('/fields');
    } catch (err: any) {
      const errorInfo = handleError(err);
      setDeleteError(errorInfo?.userMessage || 'Failed to delete field');
      setDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const calculateDaysSincePlanting = () => {
    if (!field) return 0;
    const plantingDate = new Date(field.planting_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - plantingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!mounted || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-10 w-1/3 bg-gradient-to-r from-var(--color-surface-secondary) via-var(--color-surface-tertiary) to-var(--color-surface-secondary) rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (fieldLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-10 w-1/3 bg-gradient-to-r from-var(--color-surface-secondary) via-var(--color-surface-tertiary) to-var(--color-surface-secondary) rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
          <SkeletonCard />
        </div>
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
        <Alert 
          type="error" 
          title="Field not found" 
          message="The field you are looking for does not exist or you don't have access to it."
          dismissible={false}
        />
      </div>
    );
  }

  const daysSincePlanting = calculateDaysSincePlanting();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/fields" className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] mb-6 transition">
        <ArrowLeft size={18} />
        Back to Fields
      </Link>

      {/* Error Alerts */}
      {displayError && (
        <Alert 
          type="error"
          title={displayError.type === 'validation' ? 'Invalid Input' : 'Error Loading Field'}
          message={displayError.userMessage}
          details={displayError.details ? formatValidationErrors(displayError.details) : undefined}
          onClose={clearError}
          dismissible
        />
      )}

      {deleteError && (
        <Alert 
          type="error"
          title="Delete Failed"
          message={deleteError}
          onClose={() => setDeleteError(null)}
          dismissible
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-text)]">
            {field.name}
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            {field.crop_type} field
          </p>
        </div>

        {user.role === 'admin' && (
          <div className="flex gap-2 w-full md:w-auto">
            <Link href={`/fields/${field.id}/edit`} className="flex-1 md:flex-initial">
              <Button variant="outline" size="lg" icon={<Edit size={20} />} fullWidth>
                Edit
              </Button>
            </Link>
            <Button 
              variant="outline"
              size="lg"
              icon={<RefreshCw size={20} />}
              onClick={() => {
                refetchField();
                refetchUpdates();
              }}
              disabled={fieldLoading || updatesLoading}
            >
              Refresh
            </Button>
            {deleteConfirm ? (
              <Button
                variant="danger"
                size="lg"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Confirm Delete
              </Button>
            ) : (
              <Button
                variant="danger"
                size="lg"
                icon={<Trash2 size={20} />}
                onClick={() => setDeleteConfirm(true)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Status Card */}
      <div className="card mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              Health Status
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`badge badge-${field.health_status === 'active' ? 'active' : field.health_status === 'at_risk' ? 'at-risk' : field.health_status === 'completed' ? 'completed' : 'unknown'}`}
              >
                {field.health_status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              Current Stage
            </p>
            <span className="stage-badge text-lg">{field.current_stage}</span>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Field Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
            <Leaf size={20} />
            Field Information
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Size</span>
              <span className="font-medium text-[var(--color-text)]">
                {field.size_hectares} hectares
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Crop Type</span>
              <span className="font-medium text-[var(--color-text)]">
                {field.crop_type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Days Since Planting</span>
              <span className="font-medium text-[var(--color-text)]">
                {daysSincePlanting} days
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Created</span>
              <span className="font-medium text-[var(--color-text)]">
                {new Date(field.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Location & Assignment */}
        <div className="card">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
            <MapPin size={20} />
            Location & Assignment
          </h2>

          <div className="space-y-4">
            <div>
              <span className="text-[var(--color-text-secondary)] text-sm">Coordinates</span>
              <p className="font-medium text-[var(--color-text)]">
                {field.location.latitude}, {field.location.longitude}
              </p>
            </div>
            <div>
              <span className="text-[var(--color-text-secondary)] text-sm">Planting Date</span>
              <p className="font-medium text-[var(--color-text)]">
                {new Date(field.planting_date).toLocaleDateString()}
              </p>
            </div>
            {field.assigned_agent && (
              <div className="pt-4 border-t border-[var(--color-border)]">
                <span className="text-[var(--color-text-secondary)] text-sm flex items-center gap-2 mb-2">
                  <User size={16} />
                  Assigned Agent
                </span>
                <p className="font-medium text-[var(--color-text)]">
                  Agent ID: {field.assigned_agent}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Updates Timeline */}
      <div className="card">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
          <Zap size={20} />
          Field Updates
        </h2>

        {updatesLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonLine key={idx} count={2} />
            ))}
          </div>
        ) : updates && updates.length > 0 ? (
          <div className="space-y-4">
            {updates.map((update, index) => (
              <div
                key={update.id}
                className={`pb-4 ${index !== updates.length - 1 ? 'border-b border-[var(--color-border)]' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="text-white" size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[var(--color-text)]">
                        {update.stage}
                      </span>
                      <span className="stage-badge">{update.status}</span>
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-sm mb-2">
                      {update.notes}
                    </p>
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      {new Date(update.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--color-text-secondary)] text-center py-8">
            No updates yet
          </p>
        )}
      </div>
    </div>
  );
}
