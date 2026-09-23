'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const PERIODS = [
  { key: 'today', label: 'Hari Ini' },
  { key: 'week', label: 'Minggu Ini' },
  { key: 'month', label: 'Bulan Ini' },
  { key: 'all', label: 'Semua' },
];

function filterByPeriod(orders, period) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return orders.filter((o) => {
    if (o.status !== 'completed') return false;
    const created = new Date(o.createdAt);
    switch (period) {
      case 'today':
        return created >= startOfToday;
      case 'week':
        return created >= startOfWeek;
      case 'month':
        return created >= startOfMonth;
      default:
        return true;
    }
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function FinanceReport({ orders = [] }) {
  const [activePeriod, setActivePeriod] = useState('all');

  const filtered = useMemo(
    () => filterByPeriod(orders, activePeriod),
    [orders, activePeriod]
  );

  const totalIncome = filtered.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalExpense = filtered.reduce((sum, o) => sum + (o.expense || 0), 0);
  const profit = totalIncome - totalExpense;
  const avgOrder = filtered.length > 0 ? Math.round(totalIncome / filtered.length) : 0;

  const stats = [
    {
      label: 'Pemasukan',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      accent: 'text-emerald-400',
      sub: `${filtered.length} pesanan`,
    },
    {
      label: 'Pengeluaran',
      value: formatCurrency(totalExpense),
      icon: TrendingDown,
      accent: 'text-red-400',
      sub: `Laba bersih: ${formatCurrency(profit)}`,
    },
    {
      label: 'Rata-rata/Order',
      value: formatCurrency(avgOrder),
      icon: BarChart3,
      accent: 'text-amber-400',
      sub: 'Pemasukan per pesanan',
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">Informasi Keuangan</h3>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setActivePeriod(p.key)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded transition-colors ${
                activePeriod === p.key
                  ? 'bg-white/10 text-white'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.accent}`} />
              <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className={`text-lg font-bold ${stat.accent}`}>{stat.value}</p>
            <p className="text-[11px] text-neutral-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
