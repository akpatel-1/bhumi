import { useMemo, useState } from 'react';

import { chhattisgarhLocations } from '@/data/chhattisgarh.locations';
import { useLandSearchStore } from '@/store/shared/land.search.store';

export default function LandSearch() {
  const locationMap = chhattisgarhLocations;
  const districts = useMemo(
    () => Object.keys(locationMap).sort((a, b) => a.localeCompare(b)),
    [locationMap]
  );

  const [district, setDistrict] = useState('');
  const [tehsil, setTehsil] = useState('');
  const [village, setVillage] = useState('');

  // Get Tehsils based on District
  const tehsils = useMemo(
    () => (district ? Object.keys(locationMap[district] ?? {}).sort() : []),
    [district, locationMap]
  );

  // Get Villages based on BOTH District AND Tehsil
  const villages = useMemo(
    () => (district && tehsil ? (locationMap[district][tehsil] ?? []) : []),
    [district, tehsil, locationMap]
  );

  const isLoading = useLandSearchStore((s) => s.isLoading);
  const error = useLandSearchStore((s) => s.error);
  const results = useLandSearchStore((s) => s.results);
  const searchByFilters = useLandSearchStore((s) => s.searchByFilters);

  const canSubmit = Boolean(district && tehsil && village) && !isLoading;

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    setTehsil('');
    setVillage('');
  };

  const handleTehsilChange = (value: string) => {
    setTehsil(value);
    setVillage('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!district || !tehsil || !village) return;
    await searchByFilters({ district, tehsil, village });
  };

  return (
    <section className="space-y-5">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {/* State Input */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              State
            </span>
            <input
              type="text"
              value="Chhattisgarh"
              disabled
              className="h-10 rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-700"
            />
          </label>

          {/* District Select */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              District
            </span>
            <select
              value={district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-emerald-500 focus:ring-2"
            >
              <option value="">Select district</option>
              {districts.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {/* Tehsil Select */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tehsil
            </span>
            <select
              value={tehsil}
              onChange={(e) => handleTehsilChange(e.target.value)}
              disabled={!district}
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100 focus:ring-2"
            >
              <option value="">Select tehsil</option>
              {tehsils.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {/* Village Select */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Village
            </span>
            <select
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              disabled={!tehsil}
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100 focus:ring-2"
            >
              <option value="">Select village</option>
              {villages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={!canSubmit}
              className="h-10 w-full rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isLoading ? 'Searching...' : 'Search Land'}
            </button>
          </div>
        </div>
      </form>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && results.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {results.map((land, index) => (
            <article
              key={`${land.plot_no}-${index}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-16/10 w-full bg-slate-100 p-2">
                {land.image_url ? (
                  <img
                    src={land.image_url}
                    alt={`Land plot ${land.plot_no}`}
                    loading="lazy"
                    className="h-full w-full rounded-lg border border-slate-200 bg-white object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    No image available
                  </div>
                )}
              </div>

              <div className="space-y-2 p-4 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-semibold text-slate-900">
                    Plot {land.plot_no}
                  </h3>
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium capitalize text-white">
                    {land.land_type}
                  </span>
                </div>

                <p>
                  <span className="text-slate-500">District:</span>{' '}
                  {land.district}
                </p>
                <p>
                  <span className="text-slate-500">Tehsil:</span> {land.tehsil}
                </p>
                <p>
                  <span className="text-slate-500">Village:</span>{' '}
                  {land.village}
                </p>
                <p>
                  <span className="text-slate-500">Area:</span> {land.area_sqm}{' '}
                  sqm
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {!isLoading && !error && results.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Select district, tehsil and village to search land records.
        </div>
      ) : null}
    </section>
  );
}
