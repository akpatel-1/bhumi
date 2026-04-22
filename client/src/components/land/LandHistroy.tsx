import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useUserLandHistoryPageStore } from '@/store/user/user.land.history.store';

import {
  ArrowLeft,
  CalendarClock,
  CircleCheckBig,
  Clock,
  Fingerprint,
  Hash,
  Landmark,
  MapPin,
  MoveRight,
  Search,
  User,
} from 'lucide-react';

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getStatusConfig(status: string) {
  const normalized = status.trim().toLowerCase();
  if (normalized === 'approved') {
    return {
      className: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
      dot: 'bg-emerald-500',
    };
  }
  if (normalized === 'rejected') {
    return {
      className: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
      dot: 'bg-rose-500',
    };
  }
  return {
    className: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
    dot: 'bg-amber-500',
  };
}

function DetailCell({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        <Icon className="h-3 w-3" />
        {label}
      </span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}

export default function LandHistory() {
  const navigate = useNavigate();
  const { landId } = useParams<{ landId: string }>();
  const [preview, setPreview] = useState<{ src: string; title: string } | null>(
    null
  );

  const currentLandId = useUserLandHistoryPageStore((s) => s.currentLandId);
  const hasFetched = useUserLandHistoryPageStore((s) => s.hasFetched);
  const isLoading = useUserLandHistoryPageStore((s) => s.isLoading);
  const error = useUserLandHistoryPageStore((s) => s.error);
  const records = useUserLandHistoryPageStore((s) => s.records);
  const fetchLandHistory = useUserLandHistoryPageStore(
    (s) => s.fetchLandHistory
  );

  useEffect(() => {
    if (!landId) return;
    void fetchLandHistory(landId);
  }, [fetchLandHistory, landId]);

  const title = useMemo(() => {
    if (!records.length) return 'Land Ledger History';
    const latest = records[0];
    return `${latest.village}, ${latest.tehsil}`;
  }, [records]);

  const subtitle = useMemo(() => {
    if (!records.length) return null;
    return records[0].district;
  }, [records]);

  if (!landId) {
    return (
      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
        Invalid land ID. Please go back and try again.
      </section>
    );
  }

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-linear-to-br from-sky-50 via-white to-cyan-50 p-5 shadow-sm md:p-6">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="absolute -bottom-6 left-12 h-16 w-16 rounded-full bg-cyan-100/50 blur-2xl" />
        <div className="relative space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white/90 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm">
              <Fingerprint className="h-3.5 w-3.5" />
              Blockchain Record Trail
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1 font-mono text-xs font-medium text-slate-600 shadow-sm">
              <Hash className="h-3 w-3" />
              {landId}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-sm font-medium text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Chronological ownership and transaction history for this land
            parcel.
          </p>
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          onClick={() => navigate('/user/land')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Land
        </button>

        <Link
          to="/user/search-land"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          <Search className="h-3.5 w-3.5" />
          Search More Lands
        </Link>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
          Loading land history...
        </div>
      ) : null}

      {/* Error */}
      {!isLoading && error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {/* Empty */}
      {!isLoading &&
      !error &&
      hasFetched &&
      currentLandId === landId &&
      records.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No history entries were found for this land parcel.
        </div>
      ) : null}

      {/* Timeline */}
      {!isLoading && !error && records.length > 0 ? (
        <div className="relative space-y-4">
          {/* Vertical connector line */}
          <div className="absolute left-[1.1rem] top-10 hidden h-[calc(100%-2.5rem)] w-px bg-slate-200 md:block" />

          <ol className="space-y-4">
            {records.map((item, idx) => {
              const statusConfig = getStatusConfig(item.status);
              return (
                <li key={item.block_hash} className="relative md:pl-10">
                  {/* Step dot */}
                  <div className="absolute left-0 top-4 hidden h-5.5 w-5.5 items-center justify-center rounded-full border-2 border-white bg-sky-100 shadow-sm ring-1 ring-sky-200 md:flex">
                    <span className="text-[10px] font-bold text-sky-600">
                      {idx + 1}
                    </span>
                  </div>

                  <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    {/* Card header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <CircleCheckBig className="h-4 w-4 text-sky-600" />
                        <span className="text-sm font-semibold text-slate-900">
                          Block{' '}
                          <span className="font-mono">
                            #{item.block_number}
                          </span>
                        </span>
                        <span className="hidden h-4 w-px bg-slate-200 sm:block" />
                        <span className="hidden text-xs font-medium capitalize text-slate-500 sm:block">
                          {item.transaction_type}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusConfig.className}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}
                        />
                        {item.status}
                      </span>
                    </div>

                    <div className="space-y-4 p-4">
                      {/* Detail grid */}
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        <DetailCell
                          icon={Landmark}
                          label="Transaction"
                          value={
                            <span className="capitalize">
                              {item.transaction_type}
                            </span>
                          }
                        />
                        <DetailCell
                          icon={MapPin}
                          label="District"
                          value={item.district}
                        />
                        <DetailCell
                          icon={MapPin}
                          label="Tehsil"
                          value={item.tehsil}
                        />
                        <DetailCell
                          icon={MapPin}
                          label="Village"
                          value={item.village}
                        />
                        <DetailCell
                          icon={Landmark}
                          label="Area"
                          value={`${Number(item.area_sqm).toLocaleString('en-IN')} sqm`}
                        />
                        <DetailCell
                          icon={CalendarClock}
                          label="Acquired At"
                          value={formatDate(item.acquired_at)}
                        />
                        <DetailCell
                          icon={Clock}
                          label="Recorded On"
                          value={formatDate(item.timestamp)}
                        />
                      </div>

                      {/* Ownership transfer */}
                      <div className="flex flex-col items-stretch gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:flex-row sm:items-center">
                        <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
                          <User className="h-4 w-4 shrink-0 text-slate-400" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                              From
                            </p>
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {item.from.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-center">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-500">
                            <MoveRight className="h-3.5 w-3.5" />
                          </div>
                        </div>

                        <div className="flex flex-1 items-center gap-2 rounded-lg border border-sky-100 bg-sky-50/60 px-3 py-2 shadow-sm">
                          <User className="h-4 w-4 shrink-0 text-sky-400" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-400">
                              To
                            </p>
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {item.to.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Block hash */}
                      <div className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                        <Hash className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <div className="min-w-0">
                          <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Block Hash
                          </p>
                          <p className="break-all font-mono text-[11px] text-slate-500">
                            {item.block_hash}
                          </p>
                        </div>
                      </div>

                      {/* Plot image */}
                      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        {item.image_url ? (
                          <button
                            type="button"
                            onClick={() =>
                              setPreview({
                                src: item.image_url!,
                                title: `Block #${item.block_number} — Plot Image`,
                              })
                            }
                            className="group relative block w-full"
                          >
                            <div className="aspect-video w-full overflow-hidden">
                              <img
                                src={item.image_url}
                                alt={`Land history block ${item.block_number}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition-all duration-200 group-hover:bg-slate-900/25 group-hover:opacity-100">
                              <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow">
                                Click to Enlarge
                              </span>
                            </div>
                          </button>
                        ) : (
                          <div className="flex aspect-video items-center justify-center text-sm italic text-slate-400">
                            No plot image provided for this transaction
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      {/* Image Preview Modal */}
      {preview ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreview(null)}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-900">
                {preview.title}
              </h3>
              <button
                type="button"
                className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                onClick={() => setPreview(null)}
              >
                Close
              </button>
            </div>
            <div className="max-h-[78vh] overflow-auto bg-slate-50 p-4">
              <img
                src={preview.src}
                alt={preview.title}
                className="mx-auto h-auto max-h-[72vh] w-auto rounded-lg border border-slate-200 bg-white object-contain shadow-sm"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
