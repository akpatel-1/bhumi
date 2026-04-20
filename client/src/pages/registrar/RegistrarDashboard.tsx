import { Outlet } from 'react-router-dom';

import Layout from '@/components/dashboard/Layout';
import type { NavTab } from '@/components/dashboard/Sidebar';
import { useRegistrarAuthStore } from '@/store/registrar/registrar.auth.store';

import { FileCheck2, UserCheck } from 'lucide-react';

const getNameFromEmail = (email: string) => {
  const local = email.split('@')[0] ?? '';
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'Registrar';

  return cleaned
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const tabs: NavTab[] = [
  {
    label: 'User KYC',
    icon: UserCheck,
    path: '/registrar/user-kyc?status=pending',
    children: [
      { label: 'Pending', path: '/registrar/user-kyc?status=pending' },
      { label: 'Approved', path: '/registrar/user-kyc?status=approved' },
      { label: 'Rejected', path: '/registrar/user-kyc?status=rejected' },
    ],
  },
  {
    label: 'Land Verification',
    icon: FileCheck2,
    path: '/registrar/land-kyc',
  },
];

export default function RegistrarDashboard() {
  const email = useRegistrarAuthStore(
    (state) => state.cache.registrar?.email ?? ''
  );

  return (
    <Layout
      tabs={tabs}
      role="registrar"
      userName={getNameFromEmail(email)}
      userEmail={email}
    >
      <Outlet />
    </Layout>
  );
}
