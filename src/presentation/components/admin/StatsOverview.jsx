'use client';

import React from 'react';
import { TrendingUp, TrendingDown, CheckCircle2, Clock } from 'lucide-react';

export function StatsOverview({ orders = [] }) {
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const bookedOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing');

  const totalIncome = completedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalExpense = completedOrders.reduce((sum, o) => sum + (o.expense || 0), 0);
  const profit = totalIncome - totalExpense;

  const stats = [
    {
      label: 'Pemasukan',
      value: `Rp ${totalIncome.toLocaleString('id-ID')}`,
      icon: TrendingUp,
      accent: 'text-emerald-400',
      sub: `${completedOrders.length} pesanan selesai`,
    },
    {
      label: 'Pengeluaran',
      value: `Rp ${totalExpense.toLocaleString('id-ID')}`,
      icon: TrendingDown,
      accent: 'text-red-400',
      sub: `Laba: Rp ${profit.toLocaleString('id-ID')}`,
    },
    {
      label: 'Done / Selesai',
      value: completedOrders.length,
      icon: CheckCircle2,
      accent: 'text-emerald-400',
      sub: `Rp ${totalIncome.toLocaleString('id-ID')}`,
    },
    {
      label: 'Booked / Belum Dikirim',
      value: bookedOrders.length,
      icon: Clock,
      accent: 'text-amber-400',
      sub: 'Perlu diproses',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="admin-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`w-4 h-4 ${stat.accent}`} />
            <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider">{stat.label}</span>
          </div>
          <p className={`text-xl font-bold ${stat.accent}`}>{stat.value}</p>
          <p className="text-[11px] text-neutral-500 mt-1">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
