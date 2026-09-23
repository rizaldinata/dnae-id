import './globals.css';
import { GabinProvider } from '../src/presentation/context/GabinContext';

export const metadata = {
  title: 'Gabin Bar Indonesia | Biskuit Gabin Lumer & Gurih Premium',
  description:
    'Pesan varian Gabin Fla Susu, Coklat Keju Lumer, hingga Varian Gurih Spesial langsung via WhatsApp. Fresh setiap hari!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen bg-crimson-800 text-gray-100 selection:bg-white selection:text-crimson-900 relative overflow-x-hidden">
        {/* Tilted Buku Kotak Pattern with 20% opacity */}
        <div
          className="fixed -inset-40 pointer-events-none z-0 opacity-20 bg-buku-kotak -rotate-6 scale-125 origin-center"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <GabinProvider>{children}</GabinProvider>
        </div>
      </body>
    </html>
  );
}
