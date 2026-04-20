import { useEffect } from 'react';

import { LoadingSpinner } from '@/router/LoadingSpinner';
import { useAdminRegistrarListStore } from '@/store/admin/admin.registrar.profile';

const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const capitalize = (value: string) => {
  const cleaned = value.trim();
  if (!cleaned) return cleaned;
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

function RegistrarCard({
  district,
  created_at,
}: {
  district: string;
  created_at: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900">
            {capitalize(district) || 'Unknown district'}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Created {formatDateTime(created_at)}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      </div>
    </div>
  );
}

export default function AdminActiveRegistrarPage() {
  const isLoading = useAdminRegistrarListStore((s) => s.isLoading);
  const error = useAdminRegistrarListStore((s) => s.error);
  const registrars = useAdminRegistrarListStore((s) => s.registrars);
  const fetchRegistrars = useAdminRegistrarListStore((s) => s.fetchRegistrars);

  useEffect(() => {
    void fetchRegistrars().catch(() => {});
  }, [fetchRegistrars]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          Active Registrars
        </h1>
        <p className="text-slate-600">
          All currently active registrar accounts.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <LoadingSpinner label="Fetching active registrars..." />
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-red-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Couldn’t load registrars
              </h2>
              <p className="mt-1 text-sm text-slate-600">{error}</p>
            </div>
            <button
              type="button"
              onClick={() =>
                void fetchRegistrars({ force: true }).catch(() => {
                  // handled via store error state
                })
              }
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!isLoading && !error && registrars.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-600">No active registrars found.</p>
        </div>
      )}

      {!isLoading && !error && registrars.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {registrars.map((r, idx) => (
            <RegistrarCard
              key={`${r.district}-${r.created_at}-${idx}`}
              district={r.district}
              created_at={r.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
