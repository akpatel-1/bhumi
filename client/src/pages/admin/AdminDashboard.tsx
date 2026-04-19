import { Outlet } from 'react-router-dom';

import Layout from '@/components/dashboard/Layout';
import type { NavTab } from '@/components/dashboard/Sidebar';
import { useAdminAuthStore } from '@/store/admin/admin.auth.store';

import { LayoutDashboard, UserPlus } from 'lucide-react';

const getNameFromEmail = (email: string) => {
  const local = email.split('@')[0] ?? '';
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'Admin';

  return cleaned
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const tabs: NavTab[] = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    path: '/admin/overview',
  },
  {
    label: 'Create Registrar',
    icon: UserPlus,
    path: '/admin/registrars/create',
  },
];

export default function AdminDashboard() {
  const email = useAdminAuthStore((state) => state.cache.admin?.email ?? '');

  return (
    <Layout
      tabs={tabs}
      role="admin"
      userName={getNameFromEmail(email)}
      userEmail={email}
    >
      <Outlet />
    </Layout>
  );
}
