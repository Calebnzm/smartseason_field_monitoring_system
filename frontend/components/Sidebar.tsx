'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  Settings, 
  LogOut, 
  ChevronDown,
  Menu,
  X,
  Leaf
} from 'lucide-react';

export function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/fields', label: 'Fields', icon: Map },
    ...(user.role === 'admin' ? [{ href: '/account', label: 'Account', icon: Settings }] : []),
    ...(user.role !== 'admin' ? [{ href: '/account', label: 'Account', icon: Settings }] : []),
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-40 btn btn-outline"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-[var(--color-primary)]">
            <Leaf size={24} />
            SmartSeason
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Admin Section */}
          {user.role === 'admin' && (
            <div className="pt-4 border-t border-[var(--color-border)] mt-4">
              <button
                onClick={() => setIsAdminOpen(!isAdminOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)] transition"
              >
                <div className="flex items-center gap-3">
                  <Users size={20} />
                  <span>Admin Panel</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${isAdminOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isAdminOpen && (
                <div className="ml-4 mt-2 space-y-2 border-l-2 border-[var(--color-border)]">
                  <Link
                    href="/admin/users"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-sm transition ${
                      isActive('/admin/users')
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text)] hover:bg-[var(--color-surface-secondary)]'
                    }`}
                  >
                    Manage Users
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-[var(--color-border)] p-4 space-y-4">
          <div className="px-4 py-3 bg-[var(--color-surface-secondary)] rounded-lg">
            <div className="text-sm font-medium text-[var(--color-text)]">
              {user.first_name} {user.last_name}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)] capitalize">
              {user.role}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full btn btn-danger flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
