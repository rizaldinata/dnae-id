'use client';

import React from 'react';
import { ArrowRight, Instagram, MessageCircle, Music2 } from 'lucide-react';

export function Hero() {
  const scrollToMenu = () => {
    const el = document.getElementById('order-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center pt-20 pb-16 px-4 lg:px-12">
      <div className="max-w-7xl mx-auto w-full">
        {/* Desktop: 2-column | Mobile: stacked */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left max-w-xl lg:max-w-none">

            {/* Headline */}
            <h1 className="font-poster text-white leading-[0.9] tracking-tight">
              <span className="block" style={{ fontSize: 'clamp(52px, 10vw, 96px)' }}>
                GABIN
              </span>
              <span className="block -mt-1 sm:-mt-2" style={{ fontSize: 'clamp(52px, 10vw, 96px)' }}>
                BAR
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="font-display italic text-yellow-300 mt-3"
              style={{
                fontSize: 'clamp(24px, 5vw, 48px)',
                textShadow: '1px 1px 0 rgba(0,0,0,0.2)',
              }}
            >
              ice cream
            </p>

            {/* Tagline */}
            <p className="text-white/60 text-sm sm:text-base font-normal mt-4 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Es krim sandwich gabin premium dengan cita rasa autentik.
              Dibuat fresh setiap hari, hanya <span className="text-yellow-300 font-bold">Rp 10.000</span>.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 justify-center lg:justify-start">
              <button
                id="hero-pesan-btn"
                onClick={scrollToMenu}
                className="px-8 py-3.5 rounded-xl bg-white text-crimson-900 font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>Pesan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#menu-section"
                className="px-8 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm flex items-center gap-2 transition-all hover:bg-white/15 hover:border-white/30"
              >
                Lihat Menu
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-8 text-white/50 text-xs font-bold justify-center lg:justify-start">
              <a href="https://instagram.com/dnae_id" target="_blank" rel="noopener noreferrer"
                id="social-instagram"
                className="flex items-center gap-1 hover:text-white transition-colors">
                <Instagram className="w-3.5 h-3.5" />
                <span>@dnae_id</span>
              </a>
              <a href="https://tiktok.com/@dnae.id" target="_blank" rel="noopener noreferrer"
                id="social-tiktok"
                className="flex items-center gap-1 hover:text-white transition-colors">
                <Music2 className="w-3.5 h-3.5" />
                <span>dnae.id</span>
              </a>
              <a href="https://wa.me/6289540292954" target="_blank" rel="noopener noreferrer"
                id="social-whatsapp"
                className="flex items-center gap-1 hover:text-white transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WA</span>
              </a>
            </div>
          </div>

          {/* Right: Product Image */}
          <div className="flex-1 flex justify-center lg:justify-end w-full max-w-md lg:max-w-lg">
            <div className="relative">
              {/* Background glow */}
              <div className="absolute inset-0 rounded-full bg-yellow-300/10 blur-3xl scale-110" />

              {/* Image */}
              <img
                src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=90"
                alt="Gabin Bar Ice Cream — es krim sandwich gabin premium"
                className="relative w-full h-auto object-contain animate-float-product"
                style={{ maxHeight: '420px', filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.5))' }}
              />

              {/* Price tag */}
              <div className="absolute -bottom-2 right-4 sm:right-8 bg-white rounded-xl px-4 py-2 shadow-lg">
                <span className="text-crimson-900 font-black text-lg">10K</span>
                <span className="text-crimson-900/60 text-xs font-bold ml-1">IDR</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
