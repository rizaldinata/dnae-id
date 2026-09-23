'use client';

import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useGabin } from '../context/GabinContext';

export function FloatingCart() {
  const { cart, setIsCartOpen, getCartTotal } = useGabin();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={() => setIsCartOpen(true)}
        className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-crimson-700 via-crimson-600 to-crimson-700 hover:from-crimson-600 hover:to-crimson-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-3 shadow-crimson-glow-lg transition-all active:scale-95 border border-crimson-500/40"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-white" />
          <span className="absolute -top-2 -right-2 bg-white text-crimson-900 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {totalCount}
          </span>
        </div>
        <span>Lihat Keranjang</span>
        <span className="bg-black/30 px-2.5 py-1 rounded-lg text-xs font-black text-silver-100">
          Rp {getCartTotal().toLocaleString('id-ID')}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
