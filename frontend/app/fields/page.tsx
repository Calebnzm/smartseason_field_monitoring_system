'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Header from '@/components/Header';
import FieldCard from '@/components/FieldCard';
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

const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data;
};

export default function FieldsPage() {
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

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">
            All Fields
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            View and manage all fields
          </p>
        </div>

        {fieldsList.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-[var(--color-text-secondary)]">
              No fields found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fieldsList.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
