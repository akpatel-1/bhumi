import { useEffect, useState } from 'react';



import { useUserLandDetailsStore } from '@/store/user/user.land.details.store';

import { CheckCircle2 } from 'lucide-react';

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function LandDetails() {
  const [preview, setPreview] = useState<{ src: string; title: string } | null>(
    null
  );
  const landDetails = useUserLandDetailsStore((s) => s.landDetails);
  const hasFetched = useUserLandDetailsStore((s) => s.hasFetched);
  const isLoading = useUserLandDetailsStore((s) => s.isLoading);
  const error = useUserLandDetailsStore((s) => s.error);
  const fetchLandDetails = useUserLandDetailsStore((s) => s.fetchLandDetails);

  useEffect(() => {
    if (hasFetched || isLoading) return;
    void fetchLandDetails();
  }, [fetchLandDetails, hasFetched, isLoading]);

  return (
    <section className="space-y-4">
      <div>
        <div className="relative overflow-hidden rounded-2xl border border-emerald-100   bg-linear-to-r from-emerald-100 via-white to-violet-50 p-5 mb-5 md:p-6 shadow-sm">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/60 blur-2xl" />
          <div className="relative space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              My Property
            </span>

            <p className="max-w-2xl text-xs leading-relaxed text-slate-600 md:text-sm">
              Verified land parcels currently assigned to your account.
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
            Loading your land records...
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {!isLoading && !error && landDetails.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
            No property records found for your account.
          </div>
        ) : null}

        {!isLoading && !error && landDetails.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {landDetails.map((land) => (
              <article
                key={land.land_id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="group relative aspect-4/3 w-full bg-slate-100 p-2 sm:aspect-16/10">
                  {land.image_url ? (
                    <>
                      <img
                        src={land.image_url}
                        alt={`Land plot ${land.plot_no}`}
                        className="h-full w-full rounded-xl border border-slate-200 bg-white object-contain"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-2 hidden items-end justify-end rounded-xl bg-linear-to-t from-black/35 to-transparent p-3 group-hover:flex">
                        <button
                          type="button"
                          className="pointer-events-auto rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-900 shadow"
                          onClick={() =>
                            setPreview({
                              src: land.image_url!,
                              title: `Plot ${land.plot_no}`,
                            })
                          }
                        >
                          View Full
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                      No image available
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Plot {land.plot_no}
                    </h2>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white capitalize">
                      {land.land_type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-slate-700">
                    <p>
                      <span className="text-slate-500">District:</span>{' '}
                      {land.district}
                    </p>
                    <p>
                      <span className="text-slate-500">Tehsil:</span>{' '}
                      {land.tehsil}
                    </p>
                    <p>
                      <span className="text-slate-500">Village:</span>{' '}
                      {land.village}
                    </p>
                    <p>
                      <span className="text-slate-500">Area:</span>{' '}
                      {land.area_sqm} sqm
                    </p>
                    <p>
                      <span className="text-slate-500">Acquired:</span>{' '}
                      {formatDate(land.acquired_at)}
                    </p>
                    <p>
                      <span className="text-slate-500">Source:</span>{' '}
                      {land.transaction_type}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {preview ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  {preview.title}
                </h3>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                  onClick={() => setPreview(null)}
                >
                  Close
                </button>
              </div>
              <div className="max-h-[78vh] overflow-auto bg-slate-100 p-3">
                <img
                  src={preview.src}
                  alt={preview.title}
                  className="mx-auto h-auto max-h-[72vh] w-auto rounded-lg border border-slate-200 bg-white object-contain"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
