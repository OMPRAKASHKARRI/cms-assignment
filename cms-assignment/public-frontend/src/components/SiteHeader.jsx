'use client';

import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileNav, closeMobileNav } from '../store/uiSlice';

export default function SiteHeader({ siteName, navLinks = [] }) {
  const open = useSelector((s) => s.ui.mobileNavOpen);
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <span>🌱</span>{siteName}
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-gray-600 hover:text-brand-600">{l.label}</a>
          ))}
        </nav>
        <button className="md:hidden text-2xl" onClick={() => dispatch(toggleMobileNav())} aria-label="Toggle navigation">
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-gray-100 px-6 py-3 flex flex-col gap-3">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => dispatch(closeMobileNav())} className="text-sm font-medium text-gray-700">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
