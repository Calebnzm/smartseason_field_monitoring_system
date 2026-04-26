'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { api, Field } from '@/lib/api';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { SkeletonCard, SkeletonTable } from '@/components/Skeleton';
import { useError } from '@/lib/useError';
import { formatValidationErrors } from '@/lib/error-handler';
import Link from 'next/link';
import { BarChart3, Leaf, AlertTriangle, CheckCircle2, Plus, RefreshCw } from 'lucide-react';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { error: displayError, handleError, clearError } = useError();
  const [mounted, setMounted] = useState(false);

  // Fetch fields
  const { 
    data: fields, 
    error: fieldsError, 
    isLoading: fieldsLoading,
    mutate: refetchFields 
  } = useSWR<Field[]>(
    '/fields/',
    fetcher,
    { 
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Handle field fetch errors
  useEffect(() => {
    if (fieldsError) {
      handleError(fieldsError);
    }
  }, [fieldsError, handleError]);

  if (!mounted || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-10 w-1/3 bg-gradient-to-r from-var(--color-surface-secondary) via-var(--color-surface-tertiary) to-var(--color-surface-secondary) rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
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

  // Calculate stats
  const totalFields = fields?.length || 0;
  const activeFields = fields?.filter((f) => f.health_status === 'active').length || 0;
  const atRiskFields = fields?.filter((f) => f.health_status === 'at_risk').length || 0;
  const completedFields = fields?.filter((f) => f.health_status === 'completed').length || 0;

  const stats = [
    {
      label: 'Total Fields',
      value: totalFields,
      icon: Leaf,
      color: 'from-[var(--color-primary)] to-[var(--color-secondary)]',
    },
    {
      label: 'Active Fields',
      value: activeFields,
      icon: BarChart3,
      color: 'from-green-400 to-green-600',
    },
    {
      label: 'At Risk',
      value: atRiskFields,
      icon: AlertTriangle,
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      label: 'Completed',
      value: completedFields,
      icon: CheckCircle2,
      color: 'from-gray-400 to-gray-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-text)]">
            Welcome back, {user.first_name}
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Here&apos;s an overview of your field monitoring system
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {user.role === 'admin' && (
            <Link href="/fields/create" className="flex-1 md:flex-initial">
              <Button variant="primary" size="lg" icon={<Plus size={20} />} fullWidth>
                Create Field
              </Button>
            </Link>
          )}
          <Button 
            variant="outline" 
            size="lg" 
            icon={<RefreshCw size={20} />}
            onClick={() => refetchFields()}
            disabled={fieldsLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {displayError && (
        <Alert
          type="error"
          title={displayError.type === 'validation' ? 'Invalid Input' : 'Failed to Load Fields'}
          message={displayError.userMessage}
          details={displayError.details ? formatValidationErrors(displayError.details) : undefined}
          onClose={clearError}
          dismissible
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {fieldsLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))
        ) : (
          stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--color-text-secondary)] text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-bold text-[var(--color-text)] mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Fields Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            Fields Overview
          </h2>
          {user.role === 'admin' && (
            <Link href="/fields">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          )}
        </div>

        {fieldsLoading ? (
          <SkeletonTable rows={5} columns={6} />
        ) : fields && fields.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Crop Type</th>
                  <th>Size</th>
                  <th>Stage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.slice(0, 5).map((field) => (
                  <tr key={field.id}>
                    <td className="font-medium">{field.name}</td>
                    <td>{field.crop_type}</td>
                    <td>{field.size_hectares} ha</td>
                    <td>
                      <span className="stage-badge">{field.current_stage}</span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-${field.health_status === 'active' ? 'active' : field.health_status === 'at_risk' ? 'at-risk' : field.health_status === 'completed' ? 'completed' : 'unknown'}`}
                      >
                        {field.health_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <Link href={`/fields/${field.id}`}>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Leaf className="w-16 h-16 text-[var(--color-border)] mx-auto mb-4" />
            <p className="text-[var(--color-text-secondary)] mb-4">
              No fields created yet
            </p>
            {user.role === 'admin' && (
              <Link href="/fields/create">
                <Button variant="primary">Create Your First Field</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
