'use client';

import React from 'react';
import { Star } from 'lucide-react';

export function SignatureCard({ item }) {
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

      {/* Info Only */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-extrabold text-white group-hover:text-yellow-300 transition-colors">
          {item.name}
        </h3>
        <p className="text-xs text-white/50 mt-2 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
}
