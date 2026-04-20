import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useRegistrarKycStore } from '@/store/registrar/registrar.kyc.store';
import type { RegistrarKycStatus } from '@/types/registrar/registrar.kyc.types';

function isKycStatus(value: string | null): value is RegistrarKycStatus {
  return value === 'pending' || value === 'approved' || value === 'rejected';
}

export default function RegistrarUserKycPage() {
  const [searchParams] = useSearchParams();
  const fetchUsers = useRegistrarKycStore((s) => s.fetchUsers);

  const statusParam = searchParams.get('status');
  const status: RegistrarKycStatus = isKycStatus(statusParam)
    ? statusParam
    : 'pending';

  useEffect(() => {
    void fetchUsers(status);
  }, [fetchUsers, status]);

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-slate-900">User KYC</h1>
      <p className="text-slate-600">
        Review and verify user identity submissions.
      </p>
    </div>
  );
}
