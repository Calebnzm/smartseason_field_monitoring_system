'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Field {
  id: number;
  name: string;
  crop_type: string;
  stage: string;
  status: string;
  planting_date: string;
  latitude: number;
  longitude: number;
  assigned_agent?: { id: number; username: string } | null;
  created_at: string;
  updated_at: string;
}

interface FieldUpdate {
  id: number;
  stage?: string;
  note: string;
  author: { id: number; username: string };
  created_at: string;
}

interface SatelliteData {
  ndvi?: number;
  ndwi?: number;
  ndbi?: number;
  lai?: number;
  biomass?: number;
  fetched_at: string;
}

const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data;
};

export default function FieldDetailPage() {
  const router = useRouter();
  const params = useParams();
  const fieldId = params?.id;
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  const { data: field, isLoading: fieldLoading, error: fieldError } = useSWR<Field>(
    isAuthed && fieldId ? `/fields/${fieldId}/` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: updates } = useSWR<FieldUpdate[]>(
    isAuthed && fieldId ? `/fields/${fieldId}/updates/` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (!isAuthed) return <LoadingSpinner />;
  if (fieldLoading) return <LoadingSpinner />;
  if (fieldError || !field)
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-red-600">Failed to load field</p>
        </div>
      </div>
    );

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'AT_RISK':
        return 'status-at-risk';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return 'status-unknown';
    }
  };

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      PLANTED: 'bg-blue-100 text-blue-700',
      GROWING: 'bg-green-100 text-green-700',
      READY: 'bg-yellow-100 text-yellow-700',
      HARVESTED: 'bg-gray-100 text-gray-700',
    };
    return colors[stage] || 'bg-slate-100 text-slate-700';
  };

  const daysSincePlanting = Math.floor(
    (new Date().getTime() - new Date(field.planting_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/fields" className="text-[var(--color-primary)] hover:underline mb-6 block">
          ← Back to Fields
        </Link>

        {/* Field Header */}
        <div className="card mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text)]">
                {field.name}
              </h1>
              <p className="text-[var(--color-text-secondary)] mt-1">
                {field.crop_type}
              </p>
            </div>
            <div className={getStatusClass(field.status)}>
              {field.status.replace('_', ' ')}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                Current Stage
              </p>
              <p className={`stage-badge ${getStageColor(field.stage)}`}>
                {field.stage}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                Planted
              </p>
              <p className="font-medium text-[var(--color-text)]">
                {new Date(field.planting_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                Days Since Planting
              </p>
              <p className="font-medium text-[var(--color-text)]">
                {daysSincePlanting} days
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                Assigned Agent
              </p>
              <p className="font-medium text-[var(--color-text)]">
                {field.assigned_agent?.username || 'Unassigned'}
              </p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            Location
          </h2>
          <p className="text-[var(--color-text-secondary)]">
            Latitude: {field.latitude.toFixed(4)}°
          </p>
          <p className="text-[var(--color-text-secondary)]">
            Longitude: {field.longitude.toFixed(4)}°
          </p>
        </div>

        {/* Updates */}
        <div className="card">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            Field Updates
          </h2>

          {!updates || updates.length === 0 ? (
            <p className="text-[var(--color-text-secondary)] text-center py-8">
              No updates yet
            </p>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <div
                  key={update.id}
                  className="border-l-4 border-[var(--color-secondary)] pl-4 py-2"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-[var(--color-text)]">
                        {update.author.username}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {new Date(update.created_at).toLocaleString()}
                      </p>
                    </div>
                    {update.stage && (
                      <span className={`stage-badge ${getStageColor(update.stage)}`}>
                        {update.stage}
                      </span>
                    )}
                  </div>
                  {update.note && (
                    <p className="text-[var(--color-text-secondary)]">
                      {update.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
