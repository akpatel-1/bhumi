import { useEffect } from 'react';

import { useUserProfileStore } from '@/store/user/user.profile.store';

function display(value: string | null) {
  return value && value.trim().length > 0 ? value : 'Not available';
}

export default function Profile() {
  const profile = useUserProfileStore((s) => s.profile);
  const hasFetched = useUserProfileStore((s) => s.hasFetched);
  const isLoading = useUserProfileStore((s) => s.isLoading);
  const error = useUserProfileStore((s) => s.error);
  const fetchProfile = useUserProfileStore((s) => s.fetchProfile);

  useEffect(() => {
    if (hasFetched || isLoading) return;
    void fetchProfile();
  }, [fetchProfile, hasFetched, isLoading]);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-600">
          Personal details linked to your account.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
          Loading profile details...
        </div>
      ) : null}

      {!isLoading && error ? (
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-900">Email:</span>{' '}
              {display(profile.email)}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-900">Full Name:</span>{' '}
              {display(profile.pan_name)}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-900">Phone:</span>{' '}
              {display(profile.phone)}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-900">District:</span>{' '}
              {display(profile.district)}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-900">Role:</span>{' '}
              {profile.role}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-900">Status:</span>{' '}
              {profile.is_suspended ? 'Suspended' : 'Active'}
            </p>
          </div>

          {profile.is_suspended && profile.suspension_reason ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <span className="font-medium">Suspension reason:</span>{' '}
              {profile.suspension_reason}
            </div>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
