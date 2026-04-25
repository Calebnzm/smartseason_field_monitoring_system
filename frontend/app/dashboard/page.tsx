'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import { api } from '@/lib/api';

interface Field {
  id: number;
  name: string;
  crop_type: string;
  stage: string;
  status: string;
  planting_date: string;
  assigned_agent?: { id: number; username: string } | null;
}

interface DashboardStats {
  total: number;
  active: number;
  at_risk: number;
  completed: number;
}

const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data;
};

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  const { data: fields, isLoading, error } = useSWR<Field[]>(
    isAuthed ? '/fields/' : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (!isAuthed) return <LoadingSpinner />;
  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-red-600">Failed to load fields</p>
        </div>
      </div>
    );

  const fieldsList = fields || [];
  const stats: DashboardStats = {
    total: fieldsList.length,
    active: fieldsList.filter((f) => f.status === 'ACTIVE').length,
    at_risk: fieldsList.filter((f) => f.status === 'AT_RISK').length,
    completed: fieldsList.filter((f) => f.status === 'COMPLETED').length,
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
            Admin Dashboard
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Monitor all fields across your operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              Total Fields
            </p>
            <p className="text-3xl font-bold text-[var(--color-primary)]">
              {stats.total}
            </p>
          </div>
          <div className="card">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              Active
            </p>
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="card">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              At Risk
            </p>
            <p className="text-3xl font-bold text-yellow-600">{stats.at_risk}</p>
          </div>
          <div className="card">
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              Completed
            </p>
            <p className="text-3xl font-bold text-gray-600">{stats.completed}</p>
          </div>
        </div>

        {/* Fields List */}
        <div className="card">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">
            All Fields
          </h2>

          {fieldsList.length === 0 ? (
            <p className="text-[var(--color-text-secondary)] text-center py-8">
              No fields found. Start by creating a new field.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-3 px-4 font-semibold text-[var(--color-text)]">
                      Field Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--color-text)]">
                      Crop Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--color-text)]">
                      Stage
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--color-text)]">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--color-text)]">
                      Agent
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-[var(--color-text)]">
                      Planted
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fieldsList.map((field) => (
                    <tr
                      key={field.id}
                      className="border-b border-[var(--color-border)] hover:bg-[var(--color-background)] transition cursor-pointer"
                      onClick={() => {}}
                    >
                      <td className="py-3 px-4 font-medium text-[var(--color-text)]">
                        {field.name}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                        {field.crop_type}
                      </td>
                      <td className="py-3 px-4">
                        <span className="stage-badge">
                          {field.stage}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`status-${field.status.toLowerCase()}`}>
                          {field.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                        {field.assigned_agent?.username || 'Unassigned'}
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                        {new Date(field.planting_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
