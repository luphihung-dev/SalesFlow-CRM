import { BarChart3, BriefcaseBusiness, CheckSquare, LayoutDashboard, Settings, Users, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { canAccessSettings } from '../utils/permissions';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Contacts', path: '/contacts', icon: Users },
  { label: 'Deals', path: '/deals', icon: BriefcaseBusiness },
  { label: 'Tasks', path: '/tasks', icon: CheckSquare },
  { label: 'Settings', path: '/settings', icon: Settings, adminOnly: true }
];

export default function Sidebar({ open = false, onClose }) {
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || canAccessSettings());

  const content = (
    <>
      <div className="mb-10 flex items-center justify-between gap-3 px-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-clay text-cream shadow-soft">
            <BarChart3 size={24} />
          </div>
          <div className="min-w-0">
            <p className="font-display text-xl font-bold">Cedar CRM</p>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cream/45">Revenue OS</p>
          </div>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-cream lg:hidden" type="button" onClick={onClose} aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <nav className="space-y-2">
        {visibleNavItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                isActive ? 'bg-cream text-ink shadow-soft' : 'text-cream/65 hover:bg-white/10 hover:text-cream'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/10 p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cream/40">Automation</p>
        <p className="mt-2 font-display text-lg font-bold">Workflow active</p>
        <p className="mt-2 text-sm leading-6 text-cream/60">Follow-ups, approval flags, and activity logs are generated from backend events.</p>
      </div>
    </>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-white/10 bg-ink px-5 py-6 text-cream lg:block">
        {content}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 z-0 h-full w-full bg-ink/45 backdrop-blur-sm" type="button" onClick={onClose} aria-label="Close navigation" />
          <aside className="relative z-10 h-full w-[min(20rem,86vw)] overflow-y-auto bg-ink px-5 py-6 text-cream shadow-soft">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
