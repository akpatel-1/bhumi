import { useEffect } from 'react';

import { useUserKycStore } from '@/store/user/user.kyc.store';

import { BadgeCheck } from 'lucide-react';

import ApprovedKycStatus from '../../components/kyc/ApprovedKycStatus';
import KycForm from '../../components/kyc/KycForm';
import PendingKycStatus from '../../components/kyc/PendingKycStatus';
import RejectedKycStatus from '../../components/kyc/RejectedKycStatus';

export default function UserKycPage() {
  const kyc = useUserKycStore((s) => s.kyc);
  const hasFetched = useUserKycStore((s) => s.hasFetched);
  const isLoading = useUserKycStore((s) => s.isLoading);
  const fetchStatus = useUserKycStore((s) => s.fetchStatus);
  const clearForReapply = useUserKycStore((s) => s.clearForReapply);

  useEffect(() => {
    if (hasFetched || isLoading) return;
    void fetchStatus();
  }, [fetchStatus, hasFetched, isLoading]);

  let content = <KycForm />;

  if (kyc?.status === 'pending') {
    content = <PendingKycStatus submittedAt={kyc.submitted_at} />;
  } else if (kyc?.status === 'approved') {
    content = <ApprovedKycStatus submittedAt={kyc.submitted_at} />;
  } else if (kyc?.status === 'rejected') {
    content = (
      <RejectedKycStatus
        status={kyc.status}
        reason={kyc.rejection_reason}
        submittedAt={kyc.submitted_at}
        onReapply={clearForReapply}
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 via-teal-50 to-slate-50 p-5 shadow-sm md:p-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-4 py-1.5 text-sm font-semibold text-emerald-700">
          <BadgeCheck className="h-4 w-4" />
          KYC Verification
        </span>
        <p className="mt-3 text-sm text-slate-600">
          Keep your account verified to access registration and property
          transfer services without delays.
        </p>
      </div>

      {content}
    </section>
  );
}
