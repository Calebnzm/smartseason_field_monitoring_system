'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  return (
    <header className="bg-[var(--color-primary)] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          SmartSeason
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="hover:opacity-80 transition">
            Dashboard
          </Link>
          <Link href="/fields" className="hover:opacity-80 transition">
            Fields
          </Link>
          <button
            onClick={handleLogout}
            className="bg-[var(--color-secondary)] px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
