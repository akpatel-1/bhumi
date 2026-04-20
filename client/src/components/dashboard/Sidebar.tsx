import { useState } from 'react';

import { Landmark, LogOut, type LucideIcon } from 'lucide-react';

type Role = 'admin' | 'registrar' | 'user';

export interface NavTab {
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'warn';
  children?: Array<{
    label: string;
    path: string;
    badge?: string | number;
    badgeVariant?: 'default' | 'warn';
  }>;
}

interface SidebarProps {
  tabs: NavTab[];
  activePathname: string;
  activeSearch: string;
  role: Role;
  userName: string;
  userEmail: string;
  onTabChange: (path: string) => void;
  collapsed?: boolean;
  onLogout?: () => void;
}

export default function Sidebar({
  tabs,
  activePathname,
  activeSearch,
  onTabChange,
  collapsed = false,
  onLogout,
}: SidebarProps) {
  const isOpen = !collapsed;
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  const currentSearchParams = new URLSearchParams(activeSearch);

  const isSubTabActive = (subPath: string) => {
    if (typeof window === 'undefined') return false;
    const targetUrl = new URL(subPath, window.location.origin);
    if (activePathname !== targetUrl.pathname) return false;

    const targetStatus = targetUrl.searchParams.get('status');
    if (!targetStatus) return activeSearch === targetUrl.search;

    const currentStatus = currentSearchParams.get('status') ?? 'pending';
    return currentStatus === targetStatus;
  };

  const isTabActive = (tab: NavTab) => {
    if (typeof window === 'undefined') return false;
    const tabUrl = new URL(tab.path, window.location.origin);

    if (tab.children?.length) {
      if (tab.children.some((c) => isSubTabActive(c.path))) return true;
      return activePathname === tabUrl.pathname;
    }

    return activePathname === tabUrl.pathname;
  };

  return (
    <nav
      className={`fixed z-40 flex h-full flex-col border-r border-slate-200/90 bg-white shadow-sm transition-all duration-300 ease-in-out md:relative ${
        isOpen ? 'w-60' : 'w-20'
      }`}
    >
      <div
        className={`flex h-14 items-center border-b border-slate-200/80 ${
          isOpen ? 'px-6' : 'justify-center'
        }`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
          <Landmark className="h-5 w-5 text-white" />
        </div>
        {isOpen && (
          <span className="ml-3 text-xl font-bold tracking-tight text-slate-800">
            Bhumi<span className="text-blue-600">.</span>
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        {isOpen && (
          <div className="mb-4 px-6">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Navigation
            </span>
          </div>
        )}

        <ul className={`space-y-1.5 ${isOpen ? 'px-4' : 'px-3'}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = isTabActive(tab);
            const isGroup = Boolean(tab.children?.length);

            const isExpanded =
              isOpen &&
              (openDropdowns[tab.path] ??
                (isGroup
                  ? tab.children!.some((c) => isSubTabActive(c.path))
                  : false));

            const activeClass =
              'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200';
            const inactiveClass =
              'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700';

            return (
              <li key={tab.path}>
                <button
                  onClick={() => {
                    if (!tab.children?.length || !isOpen) {
                      onTabChange(tab.path);
                      return;
                    }

                    setOpenDropdowns((prev) => ({
                      ...prev,
                      [tab.path]: !(prev[tab.path] ?? isExpanded),
                    }));

                    if (!isActive) {
                      onTabChange(tab.path);
                    }
                  }}
                  title={!isOpen ? tab.label : undefined}
                  className={`group flex w-full items-center rounded-xl transition-all duration-200 ${
                    isOpen ? 'px-4 py-3' : 'justify-center p-3'
                  } ${isActive ? activeClass : inactiveClass}`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-slate-500 group-hover:text-blue-600'
                    }`}
                  />

                  {isOpen && (
                    <span className="ml-3 text-sm font-medium">
                      {tab.label}
                    </span>
                  )}

                  {isOpen && isGroup && (
                    <span className="ml-auto text-xs font-semibold text-slate-400 select-none">
                      {isExpanded ? '▾' : '▸'}
                    </span>
                  )}

                  {isOpen && tab.badge !== undefined && (
                    <span
                      className={`ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded-full border ${
                        tab.badgeVariant === 'warn'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>

                {isOpen && tab.children?.length && isExpanded && (
                  <ul className="mt-1 space-y-1 pl-4">
                    {tab.children.map((child) => {
                      const childActive = isSubTabActive(child.path);

                      const childActiveClass =
                        'bg-blue-50 text-blue-700 ring-1 ring-blue-200';
                      const childInactiveClass =
                        'text-slate-600 hover:bg-blue-50/80 hover:text-blue-700';

                      return (
                        <li key={child.path}>
                          <button
                            type="button"
                            onClick={() => onTabChange(child.path)}
                            className={`flex w-full items-center rounded-xl px-4 py-2 text-sm transition-all duration-200 ${
                              childActive
                                ? childActiveClass
                                : childInactiveClass
                            }`}
                          >
                            <span className="text-[0.85em] font-medium">
                              {child.label}
                            </span>

                            {child.badge !== undefined && (
                              <span
                                className={`ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded-full border ${
                                  child.badgeVariant === 'warn'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                              >
                                {child.badge}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-slate-200/80 bg-slate-50/60 p-4 space-y-2">
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            aria-label="Logout"
            className={`group flex min-h-11 w-full items-center rounded-xl text-rose-600 transition-all duration-200 hover:bg-rose-50 hover:text-rose-700 ${
              isOpen ? 'px-4' : 'justify-center px-0'
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" strokeWidth={2} />
            {isOpen && (
              <span className="ml-3 text-sm font-semibold">Sign Out</span>
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
