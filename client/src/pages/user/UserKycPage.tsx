import { useEffect } from 'react';

import { useUserKycStore } from '@/store/user/user.kyc.store';

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

  if (!kyc) return <KycForm />;

  if (kyc.status === 'pending') {
    return <PendingKycStatus submittedAt={kyc.submitted_at} />;
  }

  if (kyc.status === 'approved') {
    return <ApprovedKycStatus submittedAt={kyc.submitted_at} />;
  }

  if (kyc.status === 'rejected') {
    return (
      <RejectedKycStatus
        status={kyc.status}
        reason={kyc.rejection_reason}
        submittedAt={kyc.submitted_at}
        onReapply={clearForReapply}
      />
    );
  }

  return <KycForm />;
}
