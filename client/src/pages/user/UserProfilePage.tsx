import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

import { useUserProfileStore } from '@/store/user/user.profile.store';

function display(value: string | null) {
  return value && value.trim().length > 0 ? value : 'Not available';
}

export default function UserProfilePage() {
  const profile = useUserProfileStore((s) => s.profile);
  const hasFetched = useUserProfileStore((s) => s.hasFetched);
  const isLoading = useUserProfileStore((s) => s.isLoading);
  const error = useUserProfileStore((s) => s.error);
  const errorCode = useUserProfileStore((s) => s.errorCode);
  const fetchProfile = useUserProfileStore((s) => s.fetchProfile);

  const shouldCompleteKyc = errorCode === 'USER_PROFILE_NOT_FOUND';

  useEffect(() => {
    if (hasFetched || isLoading) return;
    void fetchProfile();
  }, [fetchProfile, hasFetched, isLoading]);

  return (
    <section className="space-y-4">
      <div>
         <div className="relative overflow-hidden rounded-2xl border border-emerald-100   bg-linear-to-r from-emerald-100 via-white to-violet-50 p-5 mb-5 md:p-6 shadow-sm">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/60 blur-2xl" />
        <div className="relative space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
           My Profile
          </span>

          <p className="max-w-2xl text-xs leading-relaxed text-slate-600 md:text-sm">
            Personal details linked to your account.
          </p>
          </div>
      </div>

          


      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
          Loading profile details...
        </div>
      ) : null}

      {!isLoading && shouldCompleteKyc ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Complete KYC to create your profile.
          <Link
            to="/user/kyc"
            className="ml-2 font-semibold text-amber-900 underline underline-offset-2"
          >
            Complete KYC
          </Link>
        </div>
      ) : null}

      {!isLoading && error && !shouldCompleteKyc ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!isLoading && !error && !profile ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
          Profile details are not available right now.
        </div>
      ) : null}

      {!isLoading && !error && profile ? (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-5 shadow-sm lg:col-span-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Profile Overview
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {display(profile.pan_name)}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                Account identity and contact information.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                {profile.role}
                </span>
                <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  profile.is_suspended
                  ? 'bg-rose-50 text-rose-700 ring-rose-200'
                  : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                }`}
                >
                {profile.is_suspended ? 'Suspended' : 'Active'}
                </span>
              </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Email
                </p>
                <p className="mt-2 break-all text-sm font-medium text-slate-900">
                {display(profile.email)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Phone
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                {display(profile.phone)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                District
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                {display(profile.district)}
                </p>
              </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Account Snapshot
              </p>

              <dl className="mt-4 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Full Name
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">
                {display(profile.pan_name)}
                </dd>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Role
                </dt>
                <dd className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                {profile.role}
                </dd>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
                </dt>
                <dd
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ${
                  profile.is_suspended
                  ? 'bg-rose-50 text-rose-700 ring-rose-200'
                  : 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                }`}
                >
                {profile.is_suspended ? 'Suspended' : 'Active'}
                </dd>
              </div>
              </dl>
            </div>
            </div>

          {profile.is_suspended && profile.suspension_reason ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <span className="font-medium">Suspension reason:</span>{' '}
              {profile.suspension_reason}
            </div>
          ) : null}
        </article>
      ) : null}
      </div>
    </section>

  );

}
