'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useGabin } from '../context/GabinContext';

export function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, getCartTotal, submitOrder } = useGabin();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    orderType: 'pickup',
    paymentMethod: 'cod',
    address: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [fonnteStatus, setFonnteStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.startsWith('62')) {
      val = val;
    } else if (val.startsWith('0')) {
      val = '62' + val.slice(1);
    }
    setFormData({ ...formData, phone: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setErrorMessage('Nama wajib diisi');
      return;
    }
    if (!formData.phone) {
      setErrorMessage('Nomor WhatsApp wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const phone = formData.phone.startsWith('62') ? formData.phone : '62' + formData.phone;

    try {
      const result = await submitOrder({ ...formData, phone });
      setSuccessResult(result);

      try {
        const fonnteRes = await fetch('/api/send-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: result.order }),
        });
        const fonnteData = await fonnteRes.json();
        setFonnteStatus(fonnteData);
      } catch {
        setFonnteStatus({ success: false, message: 'Gagal mengirim notifikasi' });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses pesanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCheckoutOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/50 backdrop-blur-[2px] transition-all cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg glass-modal p-6 relative overflow-hidden max-h-[90vh] flex flex-col justify-between border border-crimson-600/40 cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-silver-800/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-crimson-950 text-crimson-400 border border-crimson-700/50">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-white">Buat Pesanan</h3>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setSuccessResult(null);
              setFonnteStatus(null);
            }}
            className="p-2 rounded-xl text-silver-400 hover:text-white hover:bg-obsidian-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successResult ? (
          <div className="py-8 text-center flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-white">Pesanan Berhasil Dibuat!</h4>
            <p className="text-xs text-silver-300 max-w-sm">
              Pesanan telah tersimpan dan notifikasi WhatsApp telah dikirim ke admin.
            </p>

            {fonnteStatus && (
              <div className={`w-full max-w-sm p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                fonnteStatus.success
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
              }`}>
                {fonnteStatus.success ? (
                  <>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Notifikasi WA terkirim ke admin & grup</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{fonnteStatus.message || 'Notifikasi gagal, gunakan tombol di bawah'}</span>
                  </>
                )}
              </div>
            )}

            <a
              href={successResult.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
              <span>Konfirmasi via WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setSuccessResult(null);
                setFonnteStatus(null);
                setIsCheckoutOpen(false);
              }}
              className="text-xs text-silver-400 underline hover:text-white pt-2"
            >
              Kembali ke Landing Page
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 overflow-y-auto pr-1">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Atas Nama */}
            <div>
              <label className="block text-xs font-bold text-silver-200 mb-1">
                Atas Nama <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Budi Santoso"
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-silver-800/60 text-white text-xs sm:text-sm focus:border-crimson-500 focus:outline-none transition-colors"
              />
            </div>

            {/* No WA */}
            <div>
              <label className="block text-xs font-bold text-silver-200 mb-1">
                Nomor WhatsApp <span className="text-red-400">*</span>
              </label>
              <div className="flex">
                <span className="px-3 py-2.5 rounded-l-xl bg-obsidian-900 border border-r-0 border-silver-800/60 text-xs font-bold text-neutral-400 flex items-center">
                  +62
                </span>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="81234567890"
                  className="w-full px-4 py-2.5 rounded-r-xl bg-obsidian-950 border border-silver-800/60 text-white text-xs sm:text-sm focus:border-crimson-500 focus:outline-none transition-colors"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Ketik nomor tanpa angka 0 di depan</p>
            </div>

            {/* Metode Pemesanan */}
            <div>
              <label className="block text-xs font-bold text-silver-200 mb-1">
                Metode Pemesanan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'pickup', label: 'Ambil di Toko' },
                  { id: 'delivery', label: 'Dikirim' },
                ].map((type) => (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setFormData({ ...formData, orderType: type.id })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border ${
                      formData.orderType === type.id
                        ? 'bg-crimson-950 text-crimson-300 border-crimson-600'
                        : 'bg-obsidian-950 text-silver-400 border-silver-800/60 hover:bg-obsidian-900'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Alamat */}
            {formData.orderType === 'delivery' && (
              <div>
                <label className="block text-xs font-bold text-silver-200 mb-1">
                  Alamat Pengiriman Lengkap
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Jalan, nomor rumah, patokan..."
                  className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-silver-800/60 text-white text-xs sm:text-sm focus:border-crimson-500 focus:outline-none transition-colors"
                />
              </div>
            )}

            {/* Metode Pembayaran */}
            <div>
              <label className="block text-xs font-bold text-silver-200 mb-1">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'cod', label: 'COD (Bayar di Tempat)' },
                  { id: 'qris', label: 'QRIS' },
                ].map((method) => (
                  <button
                    type="button"
                    key={method.id}
                    onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border ${
                      formData.paymentMethod === method.id
                        ? 'bg-crimson-950 text-crimson-300 border-crimson-600'
                        : 'bg-obsidian-950 text-silver-400 border-silver-800/60 hover:bg-obsidian-900'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
              {formData.paymentMethod === 'qris' && (
                <div className="mt-3 p-3 rounded-xl bg-white flex flex-col items-center gap-2">
                  <img
                    src="/qris.jpeg"
                    alt="QRIS Gabin Bar"
                    className="w-48 h-auto rounded-lg"
                  />
                  <p className="text-[10px] text-neutral-500 text-center">
                    Scan QRIS di atas untuk pembayaran
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="p-3.5 rounded-2xl bg-obsidian-950 border border-silver-800/60 space-y-1">
              <div className="flex justify-between text-xs text-silver-400">
                <span>Total Item</span>
                <span>{cart.reduce((s, i) => s + i.quantity, 0)} Porsi</span>
              </div>
              <div className="flex justify-between text-xs text-silver-400">
                <span>Metode Bayar</span>
                <span className="uppercase font-bold">{formData.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-crimson-400 pt-1 border-t border-silver-800/40">
                <span>Total Tagihan</span>
                <span>Rp {getCartTotal().toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-crimson-700 via-crimson-600 to-crimson-700 hover:from-crimson-600 hover:to-crimson-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-crimson-glow border border-crimson-500/40 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Memproses...' : 'Kirim Pesanan'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
