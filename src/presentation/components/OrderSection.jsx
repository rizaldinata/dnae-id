'use client';

import React from 'react';
import { useGabin } from '../context/GabinContext';
import { MenuCard } from './MenuCard';
import { ShoppingBag, Sparkles } from 'lucide-react';

const CATEGORIES = ['Semua', 'Signature', 'Manis', 'Gurih', 'Premium', 'Minuman'];

export function OrderSection() {
  const { menuItems, activeCategory, setActiveCategory, isLoadingMenu } = useGabin();

  const filteredItems = activeCategory === 'Semua'
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section id="order-section" className="py-20 px-4 lg:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-white font-extrabold text-xs uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
          <ShoppingBag className="w-3.5 h-3.5 text-yellow-300" />
          <span>Pesan Sekarang</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
          Pilih &amp;{' '}
          <span className="font-poster text-yellow-300" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}>Pesan</span>{' '}
          Favoritmu
        </h2>
        <p className="text-white/55 text-xs sm:text-sm font-normal max-w-md mx-auto leading-relaxed">
          Tambahkan ke keranjang, lalu langsung kirim pesanan via WhatsApp!
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeCategory === cat
                ? 'bg-white text-crimson-900 shadow-[0_4px_15px_rgba(255,255,255,0.25)]'
                : 'bg-white/10 text-white/70 border border-white/15 hover:text-white hover:bg-white/15'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {isLoadingMenu ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-80 rounded-3xl bg-crimson-900/40 animate-pulse border border-white/10"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 glass-card max-w-md mx-auto p-8">
          <Sparkles className="w-10 h-10 text-yellow-300 mx-auto mb-3 opacity-60" />
          <p className="text-white font-extrabold text-base">Menu belum tersedia</p>
          <p className="text-white/50 text-xs mt-2">Coba pilih kategori lain</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
