'use client';

import React, { useEffect } from 'react';
import { FinanceReport } from '../../../src/presentation/components/admin/FinanceReport';
import { RevenueTrendChart } from '../../../src/presentation/components/admin/RevenueTrendChart';
import { useGabin } from '../../../src/presentation/context/GabinContext';

export default function AdminKeuanganPage() {
  const { orders, loadOrders } = useGabin();

  useEffect(() => {
    loadOrders('all');
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white">Keuangan</h2>
        <p className="text-xs text-neutral-500">
          Rekap pendapatan dan ringkasan transaksi.
        </p>
      </div>

      <FinanceReport orders={orders} />
      <RevenueTrendChart orders={orders} />
    </div>
  );
}
