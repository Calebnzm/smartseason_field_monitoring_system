'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, LogOut } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-[var(--color-primary)]">
          SmartSeason
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/dashboard" className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition">
            Dashboard
          </Link>
          <Link href="/fields" className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition">
            Fields
          </Link>
          {user.role === 'admin' && (
            <Link href="/agents" className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition">
              Agents
            </Link>
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-[var(--color-text)]">
              {user.first_name} {user.last_name}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)]">{user.role}</div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm">
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden btn btn-ghost btn-sm"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-[var(--color-background)] transition">
              Dashboard
            </Link>
            <Link href="/fields" className="block px-4 py-2 rounded hover:bg-[var(--color-background)] transition">
              Fields
            </Link>
            {user.role === 'admin' && (
              <Link href="/agents" className="block px-4 py-2 rounded hover:bg-[var(--color-background)] transition">
                Agents
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-full btn btn-outline flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
