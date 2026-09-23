'use client';

import React from 'react';
import { useGabin } from '../context/GabinContext';
import { SignatureCard } from './SignatureCard';
import { UtensilsCrossed, Sparkles, ShieldCheck, Truck, Flame } from 'lucide-react';

export function MenuGrid() {
  const { menuItems, isLoadingMenu } = useGabin();

  const displayItems = menuItems.slice(0, 3);

  return (
    <section id="menu-section" className="py-20 px-4 lg:px-12 max-w-7xl mx-auto">
      {/* Header Title */}
      <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-white font-extrabold text-xs uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
          <UtensilsCrossed className="w-3.5 h-3.5 text-yellow-300" />
          <span>Menu Signature</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
          3 Varian Rasa{' '}
          <span className="font-poster text-yellow-300" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>Gabin Bar</span>
        </h2>
        <p className="text-white/60 text-xs sm:text-sm font-normal max-w-md mx-auto leading-relaxed">
          Varian unggulan yang jadi favorit pelanggan. Dibuat fresh setiap hari dengan bahan premium.
        </p>
      </div>

      {/* 3-Column Centered Layout */}
      {isLoadingMenu ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-96 rounded-3xl bg-crimson-900/40 animate-pulse border border-white/10"
            />
          ))}
        </div>
      ) : displayItems.length === 0 ? (
        <div className="text-center py-16 glass-card max-w-md mx-auto p-8">
          <Sparkles className="w-10 h-10 text-yellow-300 mx-auto mb-3 opacity-60" />
          <p className="text-white font-extrabold text-base">Menu belum tersedia</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {displayItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col ${
                index === 1 ? 'md:-translate-y-2' : ''
              }`}
            >
              <SignatureCard item={item} />
            </div>
          ))}
        </div>
      )}

      {/* Feature Strip */}
      <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center gap-3 hover:bg-white/10 transition-colors">
          <Flame className="w-5 h-5 text-yellow-300 shrink-0" />
          <span className="text-xs font-bold text-white/80">Dibuat Fresh Setiap Hari</span>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center gap-3 hover:bg-white/10 transition-colors">
          <ShieldCheck className="w-5 h-5 text-yellow-300 shrink-0" />
          <span className="text-xs font-bold text-white/80">Bahan Baku Premium</span>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center gap-3 hover:bg-white/10 transition-colors">
          <Truck className="w-5 h-5 text-yellow-300 shrink-0" />
          <span className="text-xs font-bold text-white/80">Siap Kirim &amp; Takeaway</span>
        </div>
      </div>
    </section>
  );
}
