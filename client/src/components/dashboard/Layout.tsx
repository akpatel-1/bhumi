import { type ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Header from './Header';
import Sidebar, { type NavTab } from './Sidebar';

type Role = 'admin' | 'registrar' | 'user';

interface DashboardLayoutProps {
  tabs: NavTab[];
  role: Role;
  userName: string;
  userEmail: string;
  breadcrumb?: string[];
  children: ReactNode;
}

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'dashboard.sidebarCollapsed';

function getInitialSidebarCollapsedState() {
  if (typeof window === 'undefined') return false;

  const saved = window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY);
  if (saved !== null) {
    try {
      return JSON.parse(saved) as boolean;
    } catch {
      // ignore
    }
  }

  return window.innerWidth < 768;
}

export default function Layout({
  tabs,
  role,
  userName,
  userEmail,
  breadcrumb,
  children,
}: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    getInitialSidebarCollapsedState
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      SIDEBAR_COLLAPSED_STORAGE_KEY,
      JSON.stringify(isSidebarCollapsed)
    );
  }, [isSidebarCollapsed]);

  const isSidebarOpen = !isSidebarCollapsed;

  return (
    <div className="relative flex h-screen overflow-hidden bg-white text-slate-900">
      <Sidebar
        tabs={tabs}
        activeTab={location.pathname}
        role={role}
        userName={userName}
        userEmail={userEmail}
        onTabChange={navigate}
        collapsed={isSidebarCollapsed}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          breadcrumb={breadcrumb}
          role={role}
          userName={userName}
          sidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((s) => !s)}
        />

        <main className="flex-1 overflow-auto bg-slate-50/30 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
