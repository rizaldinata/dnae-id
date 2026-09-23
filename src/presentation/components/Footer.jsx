'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, Phone, Instagram, Music2, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer id="tentang" className="bg-crimson-900/80 backdrop-blur-md border-t border-white/10 py-12 px-4 lg:px-12 text-white/60 text-sm relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Brand info */}
        <div className="space-y-3">
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="Gabin Bar Logo"
              className="h-14 w-auto object-contain opacity-90"
            />
          </Link>
          <p className="text-xs text-white/50 leading-relaxed font-normal">
            Spesialis gabin bar es krim renyah dengan isian strawberry, coklat, & keju lumer. Dibuat fresh tanpa bahan pengawet.
          </p>
          {/* Social Links */}
          <div className="flex flex-col gap-2 pt-1">
            <a
              href="https://instagram.com/dnae_id"
              target="_blank"
              rel="noopener noreferrer"
              id="footer-instagram"
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>@dnae_id</span>
            </a>
            <a
              href="https://tiktok.com/@dnae.id"
              target="_blank"
              rel="noopener noreferrer"
              id="footer-tiktok"
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
            >
              <Music2 className="w-4 h-4" />
              <span>dnae.id</span>
            </a>
            <a
              href="https://wa.me/6289540292954"
              target="_blank"
              rel="noopener noreferrer"
              id="footer-whatsapp"
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>0895-4029-25954</span>
            </a>
          </div>
          <p className="text-[11px] text-white/30 pt-2 font-medium">
            © {new Date().getFullYear()} Gabin Bar Indonesia. All rights reserved.
          </p>
        </div>

        {/* Operating Hours */}
        <div className="space-y-3">
          <h4 className="text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-300" /> Jam Operasional
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">Senin - Sabtu</span>
              <span className="text-yellow-300 font-extrabold">07:00 - 21:00 WIB</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60">Minggu</span>
              <span className="text-yellow-300 font-extrabold">Car Free Day</span>
            </li>
            <li className="text-emerald-400 text-[11px] font-bold pt-1">
              • Melayani Takeaway &amp; Delivery Order
            </li>
          </ul>
        </div>

        {/* Contact & Location */}
        <div className="space-y-3">
          <h4 className="text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-yellow-300" /> Lokasi &amp; Kontak
          </h4>
          <p className="text-xs text-white/60 leading-relaxed">
            Jl. Ketidur (Car Free Day setiap hari Minggu)
          </p>
          <div className="flex items-center gap-2 text-xs text-yellow-300 font-extrabold pt-1">
            <Phone className="w-4 h-4" />
            <span>0895-4029-25954</span>
          </div>

          {/* CTA Order */}
          <a
            href="https://wa.me/6289540292954"
            target="_blank"
            rel="noopener noreferrer"
            id="footer-order-btn"
            className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-crimson-900 font-extrabold text-xs hover:bg-yellow-100 transition-all shadow-[0_4px_15px_rgba(255,255,255,0.15)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.25)]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Pesan via WhatsApp</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
