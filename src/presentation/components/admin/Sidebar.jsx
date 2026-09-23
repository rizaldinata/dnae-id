'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, DollarSign, Utensils, ClipboardList, LogOut, ArrowLeft } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/keuangan', label: 'Keuangan', icon: DollarSign },
    { href: '/admin/pesanan', label: 'Pesanan', icon: ClipboardList },
    { href: '/admin/menu', label: 'Menu', icon: Utensils },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 flex flex-col border-r border-[#2a2a2a]" style={{ backgroundColor: '#141414' }}>
      {/* Brand */}
      <div className="px-4 py-4 border-b border-[#2a2a2a]">
        <h1 className="text-sm font-bold text-white tracking-wide">ADMIN</h1>
        <p className="text-[10px] text-neutral-500 mt-0.5">Gabin Bar Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-[#2a2a2a] space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Landing Page</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
