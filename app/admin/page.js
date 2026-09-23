'use client';

import React, { useEffect, useMemo } from 'react';
import { StatsOverview } from '../../src/presentation/components/admin/StatsOverview';
import { OrderStatusChart } from '../../src/presentation/components/admin/OrderStatusChart';
import { useGabin } from '../../src/presentation/context/GabinContext';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

function filterToday(orders) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return orders.filter((o) => new Date(o.createdAt) >= startOfToday);
}

function filterLast7Days(orders) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return orders.filter((o) => new Date(o.createdAt) >= start);
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminDashboardPage() {
  const { orders, isLoadingOrders, loadOrders } = useGabin();

  useEffect(() => {
    loadOrders('all');
  }, []);

  const todayOrders = useMemo(() => filterToday(orders), [orders]);
  const last7DaysOrders = useMemo(() => filterLast7Days(orders), [orders]);
  const bookedOrders = todayOrders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  );
  const completedOrders = todayOrders.filter((o) => o.status === 'completed');

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white">Dashboard Hari Ini</h2>
        <p className="text-xs text-neutral-500">
          {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      <StatsOverview orders={todayOrders} />

      {/* Chart + Order Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        {/* Status Chart - takes 1 column */}
        <OrderStatusChart orders={last7DaysOrders} />

        {/* Booked / Perlu Diproses */}
        <div className="admin-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Perlu Diproses</h3>
            <Link href="/admin/pesanan" className="text-[11px] text-neutral-500 hover:text-white flex items-center gap-1 transition-colors">
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {bookedOrders.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-xs">
              Tidak ada pesanan yang perlu diproses.
            </div>
          ) : (
            <div className="divide-y divide-[#2a2a2a] max-h-72 overflow-y-auto">
              {bookedOrders.map((order) => (
                <div key={order.id || order.orderCode} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-white">#{order.orderCode}</span>
                      <span className="text-xs text-neutral-500 ml-2">{order.customerName}</span>
                    </div>
                    <span className="text-xs font-bold text-neutral-300">
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-neutral-500">{formatTime(order.createdAt)}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      order.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}>
                      {order.status === 'pending' ? 'Menunggu' : 'Diproses'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Done / Selesai */}
        <div className="admin-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Selesai Hari Ini</h3>
            <span className="text-[11px] text-neutral-500">{completedOrders.length} pesanan</span>
          </div>
          {completedOrders.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-xs">
              Belum ada pesanan selesai hari ini.
            </div>
          ) : (
            <div className="divide-y divide-[#2a2a2a] max-h-72 overflow-y-auto">
              {completedOrders.map((order) => (
                <div key={order.id || order.orderCode} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-white">#{order.orderCode}</span>
                      <span className="text-xs text-neutral-500 ml-2">{order.customerName}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-neutral-500">{formatTime(order.createdAt)}</span>
                    {order.expense > 0 && (
                      <span className="text-[11px] text-neutral-500">
                        · Pengeluaran: Rp {order.expense.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
