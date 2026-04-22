import { Outlet } from 'react-router-dom';

import Layout from '@/components/dashboard/Layout';
import type { NavTab } from '@/components/dashboard/Sidebar';

import { BadgeCheck, CircleUserRound, Landmark, Search } from 'lucide-react';

const tabs: NavTab[] = [
  {
    label: 'Profile',
    icon: CircleUserRound,
    path: '/user/profile',
  },
  {
    label: 'User KYC',
    icon: BadgeCheck,
    path: '/user/kyc',
  },
  {
    label: 'My Property',
    icon: Landmark,
    path: '/user/land',
  },
  {
    label: 'Search Property',
    icon: Search,
    path: '/user/search-land',
  },
];

export default function UserDashboard() {
  return (
    <Layout tabs={tabs} role="user" userName="User" userEmail="">
      <Outlet />
    </Layout>
  );
}
