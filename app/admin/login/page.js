'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('admin_auth', 'true');
        router.push('/admin');
      } else {
        setError(data.error || 'Login gagal');
      }
    } catch {
      setError('Tidak bisa terhubung ke server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#111' }}>
      <div className="w-full max-w-sm p-6 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
        <Link href="/" className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-300 mb-6 transition-colors">
          <ArrowLeft className="w-3 h-3" />
          <span>Kembali ke website</span>
        </Link>

        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-white">Admin Login</h2>
          <p className="text-[11px] text-neutral-500 mt-1">Masuk ke dashboard admin</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">Username</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="admin-input w-full pl-8"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="admin-input w-full pl-8"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full admin-btn-primary py-2.5 rounded-lg text-sm font-bold disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </main>
  );
}
