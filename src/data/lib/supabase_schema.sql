-- ========================================================
-- SCHEMA SUPABASE UNTUK GABIN BAR (100% FREE TIER)
-- Copy & Paste script ini ke Supabase SQL Editor
-- ========================================================

-- 1. Tabel Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    category TEXT DEFAULT 'Manis',
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    is_bestseller BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabel Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_code TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    order_type TEXT DEFAULT 'pickup',
    payment_method TEXT DEFAULT 'cod',
    address TEXT,
    notes TEXT,
    items JSONB NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Realtime untuk Tabel Orders (agar status & order baru berbunyi/muncul di Admin secara instan)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Data Awal Menu (Optional Initial Data)
INSERT INTO menu_items (id, name, description, price, category, image_url, is_available, is_bestseller, is_new) VALUES
('gabin-1', 'Gabin Fla Susu Original', 'Biskuit gabin renyah dipadu fla susu vanila lembut, manis pas dan bikin nagih.', 15000, 'Manis', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80', true, true, false),
('gabin-2', 'Gabin Coklat Keju Lumer', 'Double keju kraft parut dan saus coklat Belgian lumer di setiap gigitan.', 18000, 'Manis', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', true, true, false),
('gabin-3', 'Gabin Matcha Caramel Crumble', 'Fla Matcha khas Jepang bertabur saus salted caramel & renyahnya biskuit.', 20000, 'Premium', 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', true, false, true),
('gabin-4', 'Gabin Daging Ayam Gurih', 'Varian gurih isi olahan daging ayam cincang cincang & wortel berbumbu rempah rahasia.', 18000, 'Gurih', 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80', true, true, false),
('gabin-5', 'Gabin Red Velvet Cheese', 'Fla Red Velvet lembut berpadu cream cheese melted khas Gabin Bar.', 22000, 'Premium', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80', true, false, true),
('gabin-6', 'Es Kopi Susu Gabin Bar', 'Kopi espresso robusta blend pilihan diseduh dengan susu segar & gula aren murni.', 15000, 'Minuman', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80', true, true, false)
ON CONFLICT (id) DO NOTHING;
