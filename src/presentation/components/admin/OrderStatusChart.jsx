'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', color: '#f59e0b' },
  processing: { label: 'Diproses', color: '#3b82f6' },
  completed: { label: 'Selesai', color: '#10b981' },
  cancelled: { label: 'Dibatalkan', color: '#ef4444' },
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
      <p className="text-white font-bold mb-1">{label}</p>
      <p className="text-neutral-400">
        {payload[0].value} pesanan
      </p>
    </div>
  );
}

export function OrderStatusChart({ orders = [] }) {
  const data = useMemo(() => {
    const counts = { pending: 0, processing: 0, completed: 0, cancelled: 0 };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) counts[o.status]++;
    });
    return Object.entries(counts).map(([key, value]) => ({
      name: STATUS_CONFIG[key].label,
      value,
      color: STATUS_CONFIG[key].color,
    }));
  }, [orders]);

  const total = orders.length;

  if (total === 0) {
    return (
      <div className="admin-card p-4">
        <h3 className="text-sm font-bold text-white mb-3">Status Pesanan</h3>
        <div className="h-48 flex items-center justify-center text-neutral-500 text-xs">
          Belum ada data
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card p-4">
      <h3 className="text-sm font-bold text-white mb-3">Status Pesanan</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#737373', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#737373', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] text-neutral-400">{item.name}</span>
            <span className="text-[11px] font-bold text-neutral-300">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
