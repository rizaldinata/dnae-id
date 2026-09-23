'use client';

import React from 'react';
import { Phone, Calendar, MapPin, FileText, CreditCard, Store } from 'lucide-react';
import { useGabin } from '../../context/GabinContext';

const ORDER_TYPE_LABELS = {
  pickup: 'Ambil di Toko',
  delivery: 'Dikirim',
};

const PAYMENT_METHOD_LABELS = {
  cod: 'COD',
  qris: 'QRIS',
};

export function OrderTable({ orders = [], isLoading = false }) {
  const { changeOrderStatus } = useGabin();

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      processing: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
    };
    const labels = {
      pending: 'Menunggu',
      processing: 'Diproses',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${styles[status] || 'bg-neutral-500/10 text-neutral-400 border-neutral-500/30'}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="admin-card p-8 text-center">
        <div className="w-6 h-6 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-neutral-500">Memuat data...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="admin-card p-12 text-center">
        <p className="text-sm font-medium text-neutral-300">Belum Ada Pesanan</p>
        <p className="text-xs text-neutral-500 mt-1">Pesanan pelanggan akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider border-b border-[#2a2a2a]">
            <tr>
              <th className="px-4 py-3">Kode</th>
              <th className="px-4 py-3">Pemesan</th>
              <th className="px-4 py-3">Detail</th>
              <th className="px-4 py-3">Metode</th>
              <th className="px-4 py-3">Bayar</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a] text-neutral-300">
            {orders.map((order) => (
              <tr key={order.id || order.orderCode} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 align-top">
                  <div className="font-bold text-white text-sm">#{order.orderCode}</div>
                  <div className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-white text-sm">{order.customerName}</div>
                  <a
                    href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 mt-0.5"
                  >
                    <Phone className="w-3 h-3" />
                    <span>+{order.customerPhone}</span>
                  </a>
                  {order.address && (
                    <p className="text-[11px] text-neutral-500 mt-1 flex items-start gap-1 max-w-[200px]">
                      <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>{order.address}</span>
                    </p>
                  )}
                </td>

                <td className="px-4 py-3 align-top">
                  <div className="space-y-0.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-[11px] flex justify-between gap-4">
                        <span>
                          <strong className="text-neutral-200">{item.quantity}x</strong> {item.name}
                        </span>
                        <span className="text-neutral-500 font-mono">
                          {(item.price * item.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                  </div>
                  {order.notes && (
                    <div className="text-[11px] text-neutral-400 bg-white/5 px-2 py-1 rounded mt-2 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{order.notes}</span>
                    </div>
                  )}
                </td>

                <td className="px-4 py-3 align-top">
                  <span className="text-xs text-neutral-400">
                    {ORDER_TYPE_LABELS[order.orderType] || order.orderType}
                  </span>
                </td>

                <td className="px-4 py-3 align-top">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    order.paymentMethod === 'qris'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
                  </span>
                </td>

                <td className="px-4 py-3 align-top font-bold text-white text-sm">
                  Rp {order.totalPrice.toLocaleString('id-ID')}
                </td>

                <td className="px-4 py-3 align-top">{getStatusBadge(order.status)}</td>

                <td className="px-4 py-3 align-top text-right">
                  <select
                    value={order.status}
                    onChange={(e) => changeOrderStatus(order.id || order.orderCode, e.target.value)}
                    className="admin-input text-[11px] py-1 px-2"
                  >
                    <option value="pending">Menunggu</option>
                    <option value="processing">Diproses</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
