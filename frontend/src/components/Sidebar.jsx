import { BarChart3, BriefcaseBusiness, CheckSquare, LayoutDashboard, Settings, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { canAccessSettings } from '../utils/permissions';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Contacts', path: '/contacts', icon: Users },
  { label: 'Deals', path: '/deals', icon: BriefcaseBusiness },
  { label: 'Tasks', path: '/tasks', icon: CheckSquare },
  { label: 'Settings', path: '/settings', icon: Settings, adminOnly: true }
];

export default function Sidebar() {
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || canAccessSettings());

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-white/60 bg-ink px-5 py-6 text-cream lg:block">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-clay text-cream shadow-soft">
          <BarChart3 size={24} />
        </div>
        <div>
          <p className="font-display text-xl font-bold">Cedar CRM</p>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cream/45">Revenue OS</p>
        </div>
      </div>

      <nav className="space-y-2">
        {visibleNavItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                isActive ? 'bg-cream text-ink shadow-soft' : 'text-cream/65 hover:bg-white/10 hover:text-cream'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
        <p className="font-display text-lg font-bold">Automation live</p>
        <p className="mt-2 text-sm leading-6 text-cream/60">Follow-ups, high-value notes, and completion logs run quietly in the background.</p>
      </div>
    </aside>
  );
}
