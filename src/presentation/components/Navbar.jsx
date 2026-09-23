'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 glass-nav px-4 lg:px-12 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group" id="navbar-logo">
          <img
            src="/logo.png"
            alt="Gabin Bar by dnaé"
            className="h-10 w-auto object-contain hover:scale-105 transition-transform drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-5 text-xs font-bold text-white/70">
          <a href="#menu-section" id="nav-menu" className="hover:text-white transition-colors tracking-wide">
            Menu
          </a>
          <a href="#tentang" id="nav-tentang" className="hover:text-white transition-colors tracking-wide">
            Tentang Kami
          </a>
          <a
            href="#order-section"
            id="nav-pesan"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pesan</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
