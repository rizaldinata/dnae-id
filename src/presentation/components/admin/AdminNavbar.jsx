'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Utensils, LogOut } from 'lucide-react';

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  return (
    <header className="border-b border-[#2a2a2a] px-4 lg:px-8 py-3 mb-6" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xs text-neutral-500 font-medium hover:text-neutral-300 transition-colors">
            ← Kembali
          </Link>
          <h1 className="text-sm font-bold text-white tracking-wide">
            ADMIN DASHBOARD
          </h1>
        </div>

        <nav className="flex items-center gap-1">
          <Link
            href="/admin"
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              pathname === '/admin'
                ? 'bg-white/10 text-white'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Pesanan</span>
          </Link>

          <Link
            href="/admin/menu"
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              pathname === '/admin/menu'
                ? 'bg-white/10 text-white'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Menu</span>
          </Link>

          <div className="w-px h-4 bg-[#2a2a2a] mx-2" />

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
