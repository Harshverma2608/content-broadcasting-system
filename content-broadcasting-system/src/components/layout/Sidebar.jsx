import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Upload, FileText, CheckSquare,
  List, LogOut, Radio, BookOpen, X,
} from 'lucide-react';

const teacherLinks = [
  { to: '/teacher/dashboard',  label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/teacher/upload',     label: 'Upload Content',  icon: Upload },
  { to: '/teacher/my-content', label: 'My Content',      icon: FileText },
];

const principalLinks = [
  { to: '/principal/dashboard',   label: 'Dashboard',         icon: LayoutDashboard },
  { to: '/principal/pending',     label: 'Pending Approvals', icon: CheckSquare },
  { to: '/principal/all-content', label: 'All Content',       icon: List },
];

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const links = user?.role === 'principal' ? principalLinks : teacherLinks;

  return (
    <aside
      className="w-64 h-full min-h-screen flex flex-col"
      style={{ background: 'var(--navy-900)', borderRight: '1px solid var(--navy-800)' }}
    >
      {/* Logo row */}
      <div className="px-5 py-4 border-b border-[var(--navy-800)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--navy-700)]">
            <Radio className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight" style={{ fontFamily: 'var(--font-oswald)' }}>
              ContentBroadcast
            </p>
            <p className="text-xs capitalize" style={{ color: 'var(--navy-300)' }}>
              {user?.role} Portal
            </p>
          </div>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--navy-800)] text-[var(--navy-300)] hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="px-5 py-3.5 border-b border-[var(--navy-800)]">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
            style={{ background: 'var(--navy-600)', color: 'var(--navy-100)', fontFamily: 'var(--font-oswald)' }}
          >
            {user?.name?.[0] ?? '?'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate leading-tight">{user?.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--navy-300)' }}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--navy-700)] text-white'
                  : 'text-[var(--navy-200)] hover:bg-[var(--navy-800)] hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[var(--navy-800)] space-y-0.5">
        <a
          href="/live/u1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--navy-200)] hover:bg-[var(--navy-800)] hover:text-white transition-colors"
        >
          <BookOpen className="h-4 w-4 shrink-0" />
          Live Page (Demo)
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
