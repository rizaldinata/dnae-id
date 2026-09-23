'use client';

import React from 'react';
import { Navbar } from '../src/presentation/components/Navbar';
import { Hero } from '../src/presentation/components/Hero';
import { MenuGrid } from '../src/presentation/components/MenuGrid';
import { HowToOrder } from '../src/presentation/components/HowToOrder';
import { OrderSection } from '../src/presentation/components/OrderSection';
import { CartDrawer } from '../src/presentation/components/CartDrawer';
import { CheckoutModal } from '../src/presentation/components/CheckoutModal';
import { FloatingCart } from '../src/presentation/components/FloatingCart';
import { Footer } from '../src/presentation/components/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <Hero />
        <MenuGrid />
        <HowToOrder />
        <OrderSection />
      </div>

      <Footer />

      {/* Floating Cart Button & Modals */}
      <FloatingCart />
      <CartDrawer />
      <CheckoutModal />
    </main>
  );
}

