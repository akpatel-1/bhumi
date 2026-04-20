import {
  Bell,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  // Search,
} from 'lucide-react';

type Role = 'admin' | 'registrar' | 'user';

interface HeaderProps {
  breadcrumb?: string[];
  role: Role;
  userName?: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onNotificationClick?: () => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Header({
  breadcrumb = [],
  role,
  userName = 'User',
  sidebarCollapsed = false,
  onToggleSidebar,
  onNotificationClick,
}: HeaderProps) {
  const sidebarOpen = !sidebarCollapsed;
  const roleTag = role.toUpperCase();
  const roleTagClass =
    role === 'admin'
      ? 'border-violet-200 bg-violet-50 text-violet-700'
      : role === 'registrar'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-blue-200 bg-blue-50 text-blue-700';

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center gap-2 border-b border-slate-200 bg-white px-4">
      <div className="z-10 flex items-center gap-2">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </button>
        )}

        {breadcrumb.length > 0 && (
          <nav className="hidden items-center gap-1.5 font-mono text-xs text-slate-500 md:flex">
            {breadcrumb.map((crumb, i) => (
              <span key={`${crumb}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                <span
                  className={
                    i === breadcrumb.length - 1 ? 'text-slate-900' : ''
                  }
                >
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        )}
      </div>
      {/* 
      <div className="hidden min-w-0 flex-1 justify-center px-2 md:flex">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search records..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-14 text-sm text-slate-700 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 lg:inline-flex">
            ctrl + K
          </kbd>
        </div>
      </div> */}

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={onNotificationClick}
          className="relative rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="mx-2 h-6 w-px bg-slate-200" />

        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <span className="text-xs font-semibold">
              {getInitials(userName)}
            </span>
          </div>
          <div className="hidden text-left lg:block">
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${roleTagClass}`}
            >
              {roleTag}
            </span>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 lg:block" />
        </button>
      </div>
    </header>
  );
}
