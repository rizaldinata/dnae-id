'use client';

import React from 'react';
import { Plus, Check, Star } from 'lucide-react';
import { useGabin } from '../context/GabinContext';

export function MenuCard({ item }) {
  const { addToCart, cart } = useGabin();

  const cartItem = cart.find((c) => c.id === item.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  return (
    <div className="glass-card flex flex-col justify-between overflow-hidden group">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-crimson-950">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=600&q=80'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-crimson-950/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.isBestSeller && (
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-yellow-900" /> Best Seller
            </span>
          )}
          {item.isNew && (
            <span className="bg-white/15 text-white border border-white/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
              Menu Baru
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-black/50 text-white/90 border border-white/20 backdrop-blur-md">
            {item.category}
          </span>
        </div>
      </div>

      {/* Info & Price */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white group-hover:text-yellow-300 transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div>
            <span className="text-[10px] text-white/50 font-bold block uppercase tracking-wider">Harga</span>
            <span className="text-base font-black text-yellow-300">
              Rp {item.price.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={() => addToCart(item, 1)}
            className={`px-3.5 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all ${
              qtyInCart > 0
                ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                : 'bg-white text-crimson-900 hover:bg-yellow-100 shadow-[0_4px_15px_rgba(255,255,255,0.2)]'
            }`}
          >
            {qtyInCart > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Ada {qtyInCart}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
