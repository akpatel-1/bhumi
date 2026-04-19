import { useState } from 'react';

import {
  adminRegistrarCreateStore,
  useAdminRegistrarCreateStore,
} from '@/store/admin/admin.registrar.create.store';
import type {
  CreateRegistrarPayload,
  CreateRegistrarResponse,
} from '@/types/admin/admin.registrar.create.types';

const STATES = [
  'Chhattisgarh',
  'Madhya Pradesh',
  'Maharashtra',
  'Uttar Pradesh',
  'Rajasthan',
];

const EMPTY_FORM: CreateRegistrarPayload = {
  email: '',
  password: '',
  district: '',
  state: '',
};

export default function AdminCreateRegistrarPage() {
  const isLoading = useAdminRegistrarCreateStore((s) => s.isLoading);
  const error = useAdminRegistrarCreateStore((s) => s.error);
  const registrar = useAdminRegistrarCreateStore((s) => s.registrar);
  const responses = useAdminRegistrarCreateStore((s) => s.responses);

  const [formData, setFormData] = useState<CreateRegistrarPayload>(EMPTY_FORM);
  const [emailError, setEmailError] = useState<string | null>(null);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmailError(
        value && !value.endsWith('@gov.in')
          ? 'Email must end with @gov.in'
          : null
      );
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.endsWith('@gov.in')) {
      setEmailError('Email must end with @gov.in');
      return;
    }

    adminRegistrarCreateStore.clearError();
    try {
      await adminRegistrarCreateStore.createRegistrar(formData);
    } catch {
      // error state is already stored/displayed
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          Create Registrar
        </h1>
        <p className="text-slate-600">
          Add a new registrar account to onboard land verification workflows.
        </p>
      </div>

      {/* ── Form — full width ── */}
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Email */}
          <div className="space-y-1.5 sm:col-span-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold tracking-tight text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              placeholder="district@gov.in"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              autoComplete="off"
            />
            {emailError ? (
              <p className="text-xs text-red-600">{emailError}</p>
            ) : (
              <p className="text-xs text-slate-500">
                Must be a government email ending in @gov.in
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5 sm:col-span-2">
            <label
              htmlFor="password"
              className="text-xs font-semibold tracking-tight text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Min. 12 characters"
              required
              minLength={12}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              autoComplete="new-password"
            />
            <p className="text-xs text-slate-500">
              Must be at least 12 characters.
            </p>
          </div>

          {/* District */}
          <div className="space-y-1.5">
            <label
              htmlFor="district"
              className="text-xs font-semibold tracking-tight text-slate-700"
            >
              District
            </label>
            <input
              id="district"
              name="district"
              type="text"
              value={formData.district}
              onChange={onChange}
              placeholder="e.g. Durg"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* State */}
          <div className="space-y-1.5">
            <label
              htmlFor="state"
              className="text-xs font-semibold tracking-tight text-slate-700"
            >
              State
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            >
              <option value="" disabled>
                Select a state
              </option>
              {STATES.map((s) => (
                <option key={s} value={s.toLowerCase()}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading || !!emailError}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Creating…' : 'Create registrar'}
          </button>

          <button
            type="button"
            onClick={() => {
              adminRegistrarCreateStore.clearResult();
              setFormData(EMPTY_FORM);
              setEmailError(null);
            }}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Reset
          </button>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {registrar ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800">
            Created: <span className="font-semibold">{registrar.email}</span>
          </div>
        ) : null}
      </form>

      {/* ── Response cards — only rendered after first submission ── */}
      {responses.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">
            Created Registrars{' '}
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
              {responses.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {responses.map((res, i) => (
              <RegistrarResponseCard
                key={`${res.data?.id ?? i}-${res.data?.createdAt ?? i}`}
                response={res}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ── Structured response card ── */

function RegistrarResponseCard({
  response,
}: {
  response: CreateRegistrarResponse;
}) {
  const { success, message, data } = response;

  const formattedDate = new Date(data.createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{data.email}</h3>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            success
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${success ? 'bg-emerald-500' : 'bg-red-500'}`}
          />
          {message}
        </span>
      </div>

      <dl className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
        <Field label="Success" value={success ? 'true' : 'false'} mono />
        <Field label="ID" value={data.id} mono />
        <Field label="District" value={capitalize(data.district)} />
        <Field label="State" value={capitalize(data.state)} />
        <Field label="Created at" value={formattedDate} />
        <Field label="Created at (raw)" value={data.createdAt} mono />
      </dl>
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="shrink-0 text-xs font-semibold text-slate-500">{label}</dt>
      <dd
        className={`text-right text-xs text-slate-800 ${mono ? 'font-mono' : 'font-medium'}`}
      >
        {value}
      </dd>
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
