'use client';

import React, { useEffect } from 'react';
import { OrderTable } from '../../../src/presentation/components/admin/OrderTable';
import { useGabin } from '../../../src/presentation/context/GabinContext';
import { RefreshCw, Filter } from 'lucide-react';

export default function AdminPesananPage() {
  const { orders, isLoadingOrders, loadOrders, statusFilter, setStatusFilter } = useGabin();

  useEffect(() => {
    loadOrders(statusFilter);
  }, [statusFilter]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Pesanan</h2>
          <p className="text-xs text-neutral-500">
            Pantau dan perbarui status pesanan pelanggan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 admin-input py-1.5 px-2.5">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-neutral-300 focus:outline-none"
            >
              <option value="all">Semua</option>
              <option value="pending">Menunggu</option>
              <option value="processing">Diproses</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>

          <button
            onClick={() => loadOrders(statusFilter)}
            className="admin-btn py-1.5 px-2.5 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <OrderTable orders={orders} isLoading={isLoadingOrders} />
    </div>
  );
}
