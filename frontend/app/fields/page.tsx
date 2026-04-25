'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { api, Field } from '@/lib/api';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function FieldsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const { data: fields, error: fieldsError, isLoading: fieldsLoading } = useSWR<Field[]>(
    '/fields/',
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (!mounted || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Filter fields
  let filteredFields = fields || [];
  if (searchTerm) {
    filteredFields = filteredFields.filter(
      (f) =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.crop_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (filterStatus) {
    filteredFields = filteredFields.filter((f) => f.health_status === filterStatus);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-text)]">
            Fields Management
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Browse and manage all fields in your system
          </p>
        </div>
        {user.role === 'admin' && (
          <Link href="/fields/create">
            <Button variant="primary" size="lg" icon={<Plus size={20} />}>
              Create Field
            </Button>
          </Link>
        )}
      </div>

      {/* Error Alert */}
      {fieldsError && (
        <Alert
          type="error"
          title="Failed to load fields"
          message="Unable to fetch field data. Please try again."
        />
      )}

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="form-label">Search Fields</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
              <input
                type="text"
                placeholder="Search by name or crop type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          <div className="md:w-48">
            <label className="form-label">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="at_risk">At Risk</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('');
            }}
            icon={<Filter size={18} />}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Fields Grid */}
      {fieldsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : filteredFields.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field) => (
            <Link key={field.id} href={`/fields/${field.id}`}>
              <div className="card card-hover h-full">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[var(--color-text)]">
                      {field.name}
                    </h3>
                    <span
                      className={`badge badge-${field.health_status === 'active' ? 'active' : field.health_status === 'at_risk' ? 'at-risk' : field.health_status === 'completed' ? 'completed' : 'pending'}`}
                    >
                      {field.health_status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {field.crop_type}
                  </p>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b border-[var(--color-border)]">
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--color-text-secondary)]">Size</span>
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {field.size_hectares} ha
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--color-text-secondary)]">Current Stage</span>
                    <span className="stage-badge">{field.current_stage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--color-text-secondary)]">Planted</span>
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {new Date(field.planting_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="w-full">
                  View Details →
                </Button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-[var(--color-text-secondary)] mb-4">
            {fields?.length === 0 ? 'No fields created yet' : 'No fields match your search'}
          </p>
          {user.role === 'admin' && fields?.length === 0 && (
            <Link href="/fields/create">
              <Button variant="primary">Create Your First Field</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
