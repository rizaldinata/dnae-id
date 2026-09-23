'use client';

import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useGabin } from '../context/GabinContext';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    setIsCheckoutOpen,
  } = useGabin();

  if (!isCartOpen) return null;

  const total = getCartTotal();

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCartOpen(false);
      }}
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[2px] transition-all cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-crimson-950 border-l border-white/10 h-full flex flex-col justify-between shadow-2xl p-6 overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/10 text-white border border-white/15">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Keranjang Pesanan</h3>
              <p className="text-[11px] text-white/50">{cart.length} varian menu dipilih</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {cart.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-white/20 mb-3" />
              <p className="text-white font-extrabold text-base">Keranjang masih kosong</p>
              <p className="text-xs text-white/40 mt-1 max-w-xs">
                Pilih varian Gabin favoritmu untuk melanjutkan ke checkout.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.06] border border-white/10"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover bg-crimson-900 border border-white/10"
                />

                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-yellow-300 font-extrabold mt-0.5">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-black/30 border border-white/15 rounded-xl p-1">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="p-1 text-white/50 hover:text-white transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-extrabold text-white px-2.5">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="p-1 text-white/50 hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Subtotal Tagihan</span>
              <span className="text-xl font-black text-white">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={handleProceedCheckout}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-yellow-100 text-crimson-900 font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all active:scale-95"
            >
              <span>Lanjut Isian Data Pemesan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
