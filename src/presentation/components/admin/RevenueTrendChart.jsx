'use client';

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
      <p className="text-white font-bold mb-1">{label}</p>
      <p className="text-emerald-400">
        Pemasukan: Rp {payload[0]?.value?.toLocaleString('id-ID') || 0}
      </p>
      {payload[1] && (
        <p className="text-red-400">
          Pengeluaran: Rp {payload[1]?.value?.toLocaleString('id-ID') || 0}
        </p>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

export function RevenueTrendChart({ orders = [] }) {
  const data = useMemo(() => {
    const now = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      const dayOrders = orders.filter((o) => {
        if (o.status !== 'completed') return false;
        const created = new Date(o.createdAt);
        return created >= d && created <= endOfDay;
      });

      const income = dayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const expense = dayOrders.reduce((sum, o) => sum + (o.expense || 0), 0);

      days.push({
        date: d.toISOString(),
        label: formatDate(d.toISOString()),
        pemasukan: income,
        pengeluaran: expense,
      });
    }

    return days;
  }, [orders]);

  const hasData = data.some((d) => d.pemasukan > 0 || d.pengeluaran > 0);

  if (!hasData) {
    return (
      <div className="admin-card p-4">
        <h3 className="text-sm font-bold text-white mb-3">Tren Pendapatan 7 Hari</h3>
        <div className="h-56 flex items-center justify-center text-neutral-500 text-xs">
          Belum ada data 7 hari terakhir
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card p-4">
      <h3 className="text-sm font-bold text-white mb-3">Tren Pendapatan 7 Hari</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#737373', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#737373', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="pemasukan"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="pengeluaran"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#colorExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-neutral-400">Pemasukan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[11px] text-neutral-400">Pengeluaran</span>
        </div>
      </div>
    </div>
  );
}
