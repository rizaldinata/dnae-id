'use client';

import React from 'react';
import { ClipboardList, MousePointerClick, ShoppingCart, MessageCircle } from 'lucide-react';

const STEPS = [
  {
    number: 1,
    icon: ClipboardList,
    title: 'Pilih Menu',
    description: 'Lihat daftar menu dan pilih varian favoritmu.',
  },
  {
    number: 2,
    icon: ShoppingCart,
    title: 'Tambah ke Keranjang',
    description: 'Klik tombol "Tambah" pada menu yang diinginkan.',
  },
  {
    number: 3,
    icon: MousePointerClick,
    title: 'Checkout',
    description: 'Klik ikon keranjang di pojok bawah, lalu pilih "Checkout".',
  },
  {
    number: 4,
    icon: MessageCircle,
    title: 'Kirim via WhatsApp',
    description: 'Isi nama & nomor WA, pilih metode, lalu kirim pesanan.',
  },
];

export function HowToOrder() {
  return (
    <section className="py-16 px-4 lg:px-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Cara{' '}
          <span className="font-poster text-yellow-300" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.2)' }}>Pesan</span>
        </h2>
        <p className="text-white/55 text-xs sm:text-sm max-w-md mx-auto">
          Hanya 4 langkah mudah untuk menikmati gabin favoritmu.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((step, index) => (
          <div
            key={step.number}
            className="relative p-5 rounded-2xl bg-white/[0.06] border border-white/15 flex flex-col items-center text-center gap-3 group hover:bg-white/10 hover:border-white/25 transition-all"
          >
            {/* Step Number */}
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-yellow-300 font-black text-sm shrink-0">
              {step.number}
            </div>

            {/* Icon */}
            <step.icon className="w-6 h-6 text-white/60 group-hover:text-yellow-300 transition-colors" />

            {/* Text */}
            <h3 className="text-sm font-extrabold text-white">{step.title}</h3>
            <p className="text-xs text-white/50 leading-relaxed">{step.description}</p>

            {/* Connector Arrow */}
            {index < STEPS.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-px bg-white/20">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-transparent border-l-white/20" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
