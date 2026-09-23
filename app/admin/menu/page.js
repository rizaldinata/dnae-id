'use client';

import React, { useState } from 'react';
import { useGabin } from '../../../src/presentation/context/GabinContext';
import { Plus, Trash2, CheckCircle, XCircle, Minus } from 'lucide-react';
import { MenuItem } from '../../../src/domain/entities/MenuItem';

export default function AdminMenuPage() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, updateMenuStock } = useGabin();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Manis',
    imageUrl: '',
    stock: '',
    isBestSeller: false,
    isNew: true,
  });

  const handleToggleAvailable = async (item) => {
    const updated = new MenuItem({
      ...item,
      isAvailable: !item.isAvailable,
    });
    await updateMenuItem(item.id, updated);
  };

  const handleUpdateStock = async (item, delta) => {
    const newStock = Math.max(0, item.stock + delta);
    await updateMenuStock(item.id, newStock);
  };

  const handleDeleteItem = async (id) => {
    if (confirm('Yakin ingin menghapus menu ini?')) {
      await deleteMenuItem(id);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const newItem = new MenuItem({
      id: `gabin-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      imageUrl:
        formData.imageUrl ||
        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      isBestSeller: formData.isBestSeller,
      isNew: formData.isNew,
      stock: Number(formData.stock) || 0,
    });

    await addMenuItem(newItem);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Manis',
      imageUrl: '',
      stock: '',
      isBestSeller: false,
      isNew: true,
    });
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Kelola Menu</h2>
          <p className="text-xs text-neutral-500">
            Tambah, edit, atau hapus varian menu.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="admin-btn-primary py-1.5 px-3 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Menu</span>
        </button>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {menuItems.map((item) => {
          const isLowStock = item.stock <= 5;
          return (
            <div key={item.id} className="admin-card p-3 flex gap-3 items-start">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover bg-neutral-800"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm truncate">{item.name}</h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Rp {item.price.toLocaleString('id-ID')}
                </p>
                <span className="text-[10px] text-neutral-500 bg-white/5 px-1.5 py-0.5 rounded mt-1 inline-block">
                  {item.category}
                </span>

                {/* Stock + Actions */}
                <div className="flex items-center gap-2 mt-2">
                  {/* Stock Control */}
                  <div className={`flex items-center gap-1 rounded border px-1.5 py-0.5 ${
                    isLowStock
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-white/5 border-[#2a2a2a]'
                  }`}>
                    <button
                      onClick={() => handleUpdateStock(item, -1)}
                      disabled={item.stock <= 0}
                      className="w-4 h-4 flex items-center justify-center rounded text-neutral-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className={`text-[11px] font-bold w-5 text-center ${
                      isLowStock ? 'text-red-400' : 'text-neutral-300'
                    }`}>
                      {item.stock}
                    </span>
                    <button
                      onClick={() => handleUpdateStock(item, 1)}
                      className="w-4 h-4 flex items-center justify-center rounded text-neutral-500 hover:text-white"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Availability Toggle */}
                  <button
                    onClick={() => handleToggleAvailable(item)}
                    className={`text-[11px] px-2 py-0.5 rounded font-medium flex items-center gap-1 ${
                      item.isAvailable
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-neutral-500 bg-white/5'
                    }`}
                  >
                    {item.isAvailable ? (
                      <><CheckCircle className="w-3 h-3" /> Ada</>
                    ) : (
                      <><XCircle className="w-3 h-3" /> Habis</>
                    )}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 rounded text-neutral-600 hover:text-red-400 hover:bg-red-500/10 ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tambah Menu */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg p-5 space-y-3" style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <div className="flex items-center justify-between pb-3 border-b border-[#2a2a2a]">
              <h3 className="font-bold text-white text-sm">Tambah Menu Baru</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1">Nama Menu</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Gabin Taro Melted"
                  className="admin-input w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="18000"
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Stok</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="25"
                    className="admin-input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="admin-input w-full"
                >
                  <option value="Manis">Manis</option>
                  <option value="Gurih">Gurih</option>
                  <option value="Premium">Premium</option>
                  <option value="Minuman">Minuman</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1">Deskripsi</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Penjelasan rasa dan isian..."
                  className="admin-input w-full resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-400 mb-1">URL Gambar</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="admin-input w-full"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full admin-btn-primary py-2.5 rounded-lg text-sm font-bold">
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
