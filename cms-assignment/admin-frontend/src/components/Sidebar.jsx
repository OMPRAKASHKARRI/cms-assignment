import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/pages', label: 'Pages', icon: '📄' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={onClose} />}

      <aside
        className={`fixed md:static z-30 inset-y-0 left-0 w-64 bg-gray-900 text-gray-100 flex flex-col transform transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-800">
          <span className="text-2xl">🌱</span>
          <span className="font-semibold text-lg tracking-tight">RenewCred CMS</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span aria-hidden>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 text-xs text-gray-500 border-t border-gray-800">v1.0.0 — Admin Panel</div>
      </aside>
    </>
  );
}
