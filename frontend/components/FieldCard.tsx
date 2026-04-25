'use client';

import Link from 'next/link';

interface Field {
  id: number;
  name: string;
  crop_type: string;
  stage: string;
  status: string;
  planting_date: string;
  assigned_agent?: { id: number; username: string } | null;
}

export default function FieldCard({ field }: { field: Field }) {
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

  return (
    <Link href={`/fields/${field.id}`}>
      <div className="card cursor-pointer hover:shadow-md transition">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              {field.name}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {field.crop_type}
            </p>
          </div>
          <div className={getStatusClass(field.status)}>
            {field.status.replace('_', ' ')}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--color-text-secondary)]">
              Stage:
            </span>
            <span className={`stage-badge ${getStageColor(field.stage)}`}>
              {field.stage}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--color-text-secondary)]">
              Planted:
            </span>
            <span className="text-sm font-medium">
              {new Date(field.planting_date).toLocaleDateString()}
            </span>
          </div>
          {field.assigned_agent && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-[var(--color-text-secondary)]">
                Agent:
              </span>
              <span className="text-sm font-medium">
                {field.assigned_agent.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
