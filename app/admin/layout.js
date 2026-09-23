'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '../../src/presentation/components/admin/Sidebar';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth') === 'true';
    if (!isAuth && !isLoginPage) {
      router.replace('/admin/login');
    } else {
      setChecked(true);
    }
  }, [pathname, isLoginPage, router]);

  if (!checked && !isLoginPage) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#111' }}>
        <div className="text-neutral-500 text-sm font-medium">Memuat...</div>
      </main>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="admin-body min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  );
}
