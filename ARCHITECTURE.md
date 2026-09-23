# ARCHITECTURE.md — Gabin Bar Web

> **Dokumen ini wajib dibaca oleh AI agent sebelum menulis kode di project ini.**
> Semua kode baru harus mengikuti aturan di bawah ini.

---

## 0. Gambaran Umum Project

Project **Gabin Bar Web** terdiri dari **dua area utama**:

### 0.1 Landing Page (Customer-Facing)

- Halaman publik yang dapat diakses oleh semua pengunjung
- Menampilkan menu, informasi bar, cara pemesanan, dan kontak
- Customer dapat **membuat pesanan** langsung dari landing page
- Ketika pesanan dibuat, sistem akan mengirim notifikasi otomatis ke nomor WhatsApp admin melalui **Fonnte WhatsApp API**
- Route: `/` (root)

### 0.2 Admin Dashboard (Admin-Facing)

- Dashboard khusus admin untuk mengelola operasional bar
- **Route bersifat hidden** — tidak ditampilkan di navigasi publik
- Admin akan diberi link khusus secara langsung untuk mengakses dashboard
- Pengguna awam yang tidak tahu URL tidak akan bisa menemukan halaman ini
- Route: `/admin` (dan sub-route di bawahnya)

#### Fitur Admin Utama (saat ini):

1. **Manajemen Stok**
   - Admin dapat melihat daftar barang/menu yang tersedia
   - Admin dapat mengupdate stok barang (menambah, mengurangi, menonaktifkan item)
   - Perubahan stok langsung tersinkron ke landing page customer

2. **Informasi Keuangan**
   - Admin dapat melihat rekap pesanan masuk
   - Statistik pendapatan dan ringkasan transaksi
   - Data diambil dari tabel `orders` di Supabase

### 0.3 Alur Pesanan via WhatsApp (Fonnte API)

```
Customer membuat pesanan di Landing Page
    │
    ▼
Sistem menyimpan pesanan ke Supabase (tabel: orders)
    │
    ▼
Sistem mengirim notifikasi otomatis ke WhatsApp Admin
    │  (menggunakan Fonnte WhatsApp API)
    ▼
Admin menerima pesan pesanan yang sudah terformat rapi
    │
    ▼
Admin mengkonfirmasi pesanan langsung via WhatsApp ke customer
    │
    ▼
Admin mengupdate status pesanan di Dashboard
```

> **Catatan Fonnte API**: Nomor WhatsApp admin akan dikonfigurasi di `.env.local`.
> Jangan pernah hardcode nomor WhatsApp atau API key Fonnte di dalam kode.
> Gunakan `process.env.FONNTE_API_TOKEN` dan `process.env.ADMIN_WHATSAPP_NUMBER`.

---

## 1. Overview

Project ini menggunakan **Clean Architecture** dengan 3 layer:

```
┌─────────────────────────────────────────────────────┐
│                PRESENTATION LAYER                   │
│  app/ (Next.js App Router)                          │
│  src/presentation/components/                       │
│  src/presentation/context/                          │
│  src/presentation/hooks/                            │
│  Kenali: Domain layer saja. TIDAK boleh import Data │
├─────────────────────────────────────────────────────┤
│                 DOMAIN LAYER                        │
│  src/domain/entities/                               │
│  src/domain/usecases/                               │
│  src/domain/repositories/ (interfaces)              │
│  Kenali: Tidak ada dependency external apapun       │
├─────────────────────────────────────────────────────┤
│                  DATA LAYER                         │
│  src/data/datasources/                              │
│  src/data/models/                                   │
│  src/data/repositories/ (implementations)           │
│  src/data/lib/                                      │
│  Kenali: Domain + External APIs (Supabase, etc.)   │
└─────────────────────────────────────────────────────┘
```

---

## 2. Dependency Rule (ATURAN PALING PENTING)

Ketergantungan harus mengarah ke **DALAM** (ke Domain).

```
Presentation → Domain ← Data
```

- Domain **TIDAK BOLEH** import dari Data atau Presentation
- Data **BOLEH** import dari Domain (entities, interfaces)
- Presentation **BOLEH** import dari Domain (entities, usecases, interfaces)
- Presentation **TIDAK BOLEH** import dari Data (repository impl, datasources, models)

**Contoh SALAH:**
```js
// ❌ DIpresentation/components/OrderTable.jsx
import OrderRepositoryImpl from '@/data/repositories/OrderRepositoryImpl'

// ❌ DIapp/admin/menu/page.js
const menuRepo = new MenuRepositoryImpl()
```

**Contoh BENAR:**
```js
// ✅ DIpresentation/components/OrderTable.jsx
import { useGabin } from '@/presentation/context/GabinContext'

// ✅ DIapp/admin/menu/page.js
const { menu, addMenuItem, deleteMenuItem } = useGabin()
```

---

## 3. Struktur Folder & File

```
src/
├── domain/
│   ├── entities/
│   │   └── [NamaEntity].js          # Class dengan property + method bisnis
│   ├── usecases/
│   │   └── [NamaAction]UseCase.js   # Class dengan method execute()
│   └── repositories/
│       └── I[NamaEntity]Repository.js  # Interface (abstract)
├── data/
│   ├── datasources/
│   │   ├── [Service][Entity]DataSource.js  # Implementasi API/DB
│   │   └── LocalStorageDataSource.js       # Fallback
│   ├── models/
│   │   └── [Entity]Model.js          # fromJson() / toJson() mapper
│   ├── repositories/
│   │   └── [Entity]RepositoryImpl.js # Implementasi interface dari Domain
│   └── lib/
│       └── [service]Client.js        # Singleton client (Supabase, dll)
└── presentation/
    ├── components/
    │   └── [NamaKomponen].jsx        # React component
    │   └── admin/
    │       └── [AdminKomponen].jsx
    ├── context/
    │   └── [Nama]Context.js          # React Context + Provider
    └── hooks/
        └── use[Nama].js              # Custom hooks
```

---

## 4. Aturan per Layer

### 4.1 Domain Layer

**Tidak boleh import apapun selain kode Domain sendiri.**

#### Entities
```js
// ✅ src/domain/entities/MenuItem.js
export default class MenuItem {
  constructor({ id, name, description, price, category, imageUrl, isAvailable, isBestseller, isNew }) {
    this.id = id
    this.name = name
    this.description = description
    this.price = price
    this.category = category
    this.imageUrl = imageUrl
    this.isAvailable = isAvailable
    this.isBestseller = isBestseller
    this.isNew = isNew
  }

  getFormattedPrice() {
    return `Rp ${this.price.toLocaleString('id-ID')}`
  }
}
```

- Entity hanya berisi **properties** dan **method bisnis murni**
- Tidak ada import dari library eksternal (React, Supabase, dll)
- Constructor menerima object (destructuring)

#### Use Cases
```js
// ✅ src/domain/usecases/GetMenuListUseCase.js
export default class GetMenuListUseCase {
  constructor(menuRepository) {
    this.menuRepository = menuRepository
  }

  async execute(category = null) {
    const items = await this.menuRepository.getMenuItems()
    if (category) {
      return items.filter(item => item.category === category)
    }
    return items
  }
}
```

- Satu class per use case
- Constructor menerima **interface** repository (dependency injection)
- Method utama bernama `execute()`
- Tidak boleh langsung instantiate repository — terima via constructor

#### Repository Interfaces
```js
// ✅ src/domain/repositories/IMenuRepository.js
export default class IMenuRepository {
  async getMenuItems() {
    throw new Error('Method not implemented')
  }

  async saveMenuItem(menuItem) {
    throw new Error('Method not implemented')
  }

  async updateMenuItem(id, menuItem) {
    throw new Error('Method not implemented')
  }

  async deleteMenuItem(id) {
    throw new Error('Method not implemented')
  }
}
```

- Interface = class dengan method yang throw error
- Definisikan **SEMUA** method yang dibutuhkan di sini
- Implementasi ada di `data/repositories/`

---

### 4.2 Data Layer

**Boleh import Domain, boleh import library eksternal.**

#### DataSources
```js
// ✅ src/data/datasources/SupabaseMenuDataSource.js
import supabaseClient from '../lib/supabaseClient'

export default class SupabaseMenuDataSource {
  async getMenuItems() {
    const { data, error } = await supabaseClient
      .from('menu_items')
      .select('*')
    if (error) throw error
    return data
  }

  async saveMenuItem(data) {
    const { error } = await supabaseClient
      .from('menu_items')
      .insert(data)
    if (error) throw error
  }
  // ... lainnya
}
```

- Satu DataSource per external service per entity
- Handle error di sini (throw atau return null)
- Bisa ada fallback strategy (Supabase → LocalStorage)

#### Models (Mappers)
```js
// ✅ src/data/models/MenuItemModel.js
import MenuItem from '@/domain/entities/MenuItem'

export default class MenuItemModel {
  static fromJson(json) {
    return new MenuItem({
      id: json.id,
      name: json.name,
      description: json.description,
      price: json.price,
      category: json.category,
      imageUrl: json.image_url,        // snake_case → camelCase
      isAvailable: json.is_available,
      isBestseller: json.is_bestseller,
      isNew: json.is_new
    })
  }

  static toJson(entity) {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      category: entity.category,
      image_url: entity.imageUrl,      // camelCase → snake_case
      is_available: entity.isAvailable,
      is_bestseller: entity.isBestseller,
      is_new: entity.isNew
    }
  }
}
```

- Static methods `fromJson()` dan `toJson()`
- Handle mapping snake_case (DB) ↔ camelCase (Entity)
- Import Entity dari Domain

#### Repository Implementations
```js
// ✅ src/data/repositories/MenuRepositoryImpl.js
import IMenuRepository from '@/domain/repositories/IMenuRepository'
import SupabaseMenuDataSource from '../datasources/SupabaseMenuDataSource'
import MenuItemModel from '../models/MenuItemModel'

export default class MenuRepositoryImpl extends IMenuRepository {
  constructor() {
    super()
    this.dataSource = new SupabaseMenuDataSource()
  }

  async getMenuItems() {
    const data = await this.dataSource.getMenuItems()
    return data.map(item => MenuItemModel.fromJson(item))
  }

  async saveMenuItem(menuItem) {
    const json = MenuItemModel.toJson(menuItem)
    await this.dataSource.saveMenuItem(json)
  }

  async updateMenuItem(id, menuItem) {
    const json = MenuItemModel.toJson(menuItem)
    await this.dataSource.updateMenuItem(id, json)
  }

  async deleteMenuItem(id) {
    await this.dataSource.deleteMenuItem(id)
  }
}
```

- **Extend** interface dari Domain
- Gunakan DataSource untuk fetch data
- Gunakan Model untuk mapping
- **Harus implementasi SEMUA method** yang didefinisikan di interface

---

### 4.3 Presentation Layer

**Boleh import Domain. TIDAK BOLEH import Data.**

#### Components
```jsx
// ✅ src/presentation/components/MenuCard.jsx
'use client'

import { useGabin } from '@/presentation/context/GabinContext'

export default function MenuCard({ item }) {
  const { addToCart } = useGabin()

  return (
    <div>
      <h3>{item.name}</h3>
      <p>{item.getFormattedPrice()}</p>
      <button onClick={() => addToCart(item)}>Tambah</button>
    </div>
  )
}
```

- Selalu gunakan `'use client'` directive
- Ambil data & actions dari Context via `useGabin()`
- **TIDAK** import repository, model, atau datasource langsung
- Terima data via props atau context

#### Context
```js
// ✅ src/presentation/context/GabinContext.js
'use client'

import { createContext, useContext, useState, useMemo } from 'react'
import MenuRepositoryImpl from '@/data/repositories/MenuRepositoryImpl'
import GetMenuListUseCase from '@/domain/usecases/GetMenuListUseCase'
import CreateOrderUseCase from '@/domain/usecases/CreateOrderUseCase'

const GabinContext = createContext()

export function GabinProvider({ children }) {
  const [menu, setMenu] = useState([])

  // ✅ Gunakan useMemo agar tidak re-create setiap render
  const menuRepo = useMemo(() => new MenuRepositoryImpl(), [])
  const getMenuList = useMemo(() => new GetMenuListUseCase(menuRepo), [menuRepo])
  const createOrder = useMemo(() => new CreateOrderUseCase(menuRepo), [menuRepo])

  const fetchMenu = async (category = null) => {
    const items = await getMenuList.execute(category)
    setMenu(items)
  }

  // ... lainnya

  return (
    <GabinContext.Provider value={{ menu, fetchMenu, addToCart, ... }}>
      {children}
    </GabinContext.Provider>
  )
}

export const useGabin = () => useContext(GabinContext)
```

- Context adalah **satu-satunya tempat** yang boleh import dari Data layer
- `useMemo` untuk instantiate repository & use cases (hindari re-create)
- Export custom hook `useGabin()` untuk consuming components

---

## 5. Naming Convention

| Item | Format | Contoh |
|---|---|---|
| Entity class | PascalCase | `MenuItem`, `Order` |
| Entity file | PascalCase.js | `MenuItem.js`, `Order.js` |
| UseCase class | PascalCase + `UseCase` | `GetMenuListUseCase` |
| UseCase file | PascalCase + `UseCase.js` | `GetMenuListUseCase.js` |
| Repository interface | `I` + PascalCase + `Repository` | `IMenuRepository` |
| Repository impl | PascalCase + `RepositoryImpl` | `MenuRepositoryImpl` |
| DataSource | `[Service][Entity]DataSource` | `SupabaseMenuDataSource` |
| Model/Mapper | PascalCase + `Model` | `MenuItemModel` |
| React Component | PascalCase.jsx | `MenuCard.jsx`, `CartDrawer.jsx` |
| Context | PascalCase + `Context` | `GabinContext.js` |
| Custom Hook | `use` + PascalCase | `useGabin.js` |

---

## 6. Aturan Import

### Path Alias yang Tersedia
```js
// jsconfig.json
{
  "paths": {
    "@/*": ["./*"],
    "@/domain/*": ["src/domain/*"],
    "@/data/*": ["src/data/*"],
    "@/presentation/*": ["src/presentation/*"]
  }
}
```

### Import Rules
```js
// ✅ BENAR — Presentation import Domain
import MenuItem from '@/domain/entities/MenuItem'
import GetMenuListUseCase from '@/domain/usecases/GetMenuListUseCase'

// ❌ SALAH — Presentation import Data
import MenuRepositoryImpl from '@/data/repositories/MenuRepositoryImpl'
import SupabaseMenuDataSource from '@/data/datasources/SupabaseMenuDataSource'
import MenuItemModel from '@/data/models/MenuItemModel'

// ✅ BENAR — Data import Domain
import IMenuRepository from '@/domain/repositories/IMenuRepository'
import MenuItem from '@/domain/entities/MenuItem'

// ❌ SALAH — Domain import Data atau Presentation
import MenuRepositoryImpl from '@/data/repositories/MenuRepositoryImpl'
import { useGabin } from '@/presentation/context/GabinContext'
```

---

## 7. Data Flow Pattern

```
User Action (click, submit)
    │
    ▼
Component (src/presentation/components/)
    │  calls useGabin() hook
    ▼
Context (src/presentation/context/)
    │  calls useCase.execute()
    ▼
UseCase (src/domain/usecases/)
    │  calls repository interface method
    ▼
RepositoryImpl (src/data/repositories/)
    │  calls dataSource method
    ▼
DataSource (src/data/datasources/)
    │  calls Supabase / localStorage
    ▼
External Service (Supabase, WhatsApp API)
    │
    ▼  returns raw data
DataSource
    │  maps via Model.fromJson()
    ▼
RepositoryImpl
    │  returns Entity objects
    ▼
UseCase
    │  processes business logic
    ▼
Context
    │  updates React state
    ▼
Component re-renders with new data
```

---

## 8. Checklist untuk AI Agent

Sebelum menulis kode, tanyakan pada diri sendiri:

- [ ] Layer mana yang akan saya tulis? (Domain / Data / Presentation)
- [ ] Apakah import saya sesuai layer? (Presentation tidak import Data)
- [ ] Apakah saya menggunakan path alias `@/domain/*`, `@/data/*`, `@/presentation/*`?
- [ ] Jika menulis UseCase: apakah saya terima repository via constructor?
- [ ] Jika menulis Repository: apakah saya extend interface dari Domain?
- [ ] Jika menulis Component: apakah saya pakai `useGabin()` untuk akses data?
- [ ] Jika menulis Context: apakah saya pakai `useMemo` untuk repo/usecase?
- [ ] Apakah semua method di interface repository sudah diimplementasi?
- [ ] Apakah naming saya sesuai convention?
- [ ] Apakah saya menggunakan `'use client'` di component?

---

## 9. Common Mistakes & How to Fix

### Mistake 1: Component langsung instantiate Repository
```js
// ❌ SALAH
const menuRepo = new MenuRepositoryImpl()

// ✅ BENAR — ambil dari context
const { menu, fetchMenu } = useGabin()
```

### Mistake 2: Context tidak pakai useMemo
```js
// ❌ SALAH — re-create setiap render
const menuRepo = new MenuRepositoryImpl()

// ✅ BENAR
const menuRepo = useMemo(() => new MenuRepositoryImpl(), [])
```

### Mistake 3: Repository tidak implement semua method interface
```js
// ❌ SALAH — interface punya 4 method, cuma implement 2
export default class MenuRepositoryImpl extends IMenuRepository {
  async getMenuItems() { ... }
  async saveMenuItem() { ... }
  // updateMenuItem dan deleteMenuItem tidak ada!
}

// ✅ BENAR — implement SEMUA method
export default class MenuRepositoryImpl extends IMenuRepository {
  async getMenuItems() { ... }
  async saveMenuItem() { ... }
  async updateMenuItem(id, data) { ... }
  async deleteMenuItem(id) { ... }
}
```

### Mistake 4: UseCase langsung instantiate Repository
```js
// ❌ SALAH
export default class GetMenuListUseCase {
  constructor() {
    this.menuRepository = new MenuRepositoryImpl() // hardcode!
  }
}

// ✅ BENAR — dependency injection
export default class GetMenuListUseCase {
  constructor(menuRepository) {
    this.menuRepository = menuRepository
  }
}
```

### Mistake 5: Domain layer import dari Data/Presentation
```js
// ❌ SALAH — di domain/entities/Order.js
import OrderRepositoryImpl from '@/data/repositories/OrderRepositoryImpl'

// ✅ BENAR — domain tidak import apapun dari luar domain
```

---

## 10. Technology Stack Reference

| Layer | Technology | Keterangan |
|---|---|---|
| Framework | Next.js 14 (App Router) | File-based routing di `app/` |
| UI Library | React 18 | Client components |
| Styling | Tailwind CSS 3 | Utility-first CSS |
| Database | Supabase (PostgreSQL) | BaaS dengan Realtime |
| Icons | Lucide React | Icon components |
| State | React Context API | Single global context |
| WhatsApp API | Fonnte | Notifikasi pesanan ke admin via WA |

### 10.1 Fonnte WhatsApp API

Fonnte digunakan untuk mengirim pesan WhatsApp otomatis ke admin ketika customer membuat pesanan.

```
Endpoint : https://api.fonnte.com/send
Method   : POST
Auth     : Header 'Authorization: <FONNTE_API_TOKEN>'
Payload  :
  {
    "target": "<ADMIN_WHATSAPP_NUMBER>",
    "message": "<formatted order message>"
  }
```

**Environment Variables yang dibutuhkan** (di `.env.local`):
```env
FONNTE_API_TOKEN=your_fonnte_token_here
ADMIN_WHATSAPP_NUMBER=628xxxxxxxxxx
```

**Catatan implementasi:**
- Pengiriman WA dilakukan dari **Next.js API Route** (`app/api/send-order/route.js`) agar token tidak terekspos ke client
- Format pesan dihasilkan oleh `FormatWhatsAppMessageUseCase` di domain layer
- Jika Fonnte gagal, pesanan tetap tersimpan ke Supabase (fallback graceful)
- Rate limit Fonnte harus diperhatikan jika ada pesanan bersamaan

---

## 11. File yang Tidak Boleh Diubah Tanpa Pertimbangan

| File | Alasan |
|---|---|
| `src/domain/entities/*.js` | Core business entities — perubahan berdampak ke semua layer |
| `src/domain/repositories/*.js` | Interface contract — perubahan wajib update implementasi |
| `jsconfig.json` | Path alias — perubahan berdampak ke semua import |
| `next.config.js` | Framework config |
| `.env.local` | Secrets — jangan commit ke repo |

---

## 12. Adding New Feature (Step-by-Step)

1. **Definisikan Entity** di `src/domain/entities/`
2. **Definisikan Repository Interface** di `src/domain/repositories/`
3. **Buat Use Case** di `src/domain/usecases/`
4. **Buat DataSource** di `src/data/datasources/`
5. **Buat Model/Mapper** di `src/data/models/`
6. **Buat Repository Implementation** di `src/data/repositories/`
7. **Update Context** di `src/presentation/context/`
8. **Buat/Update Component** di `src/presentation/components/`
9. **Buat Page** di `app/` jika perlu route baru

---

---

## 13. Route Structure

```
app/
├── page.js                   # Landing page (customer-facing, PUBLIC)
├── layout.js                 # Root layout (shared)
├── globals.css               # Global styles
└── admin/                    # Admin area (HIDDEN — tidak ada link publik)
    ├── page.js               # Admin dashboard utama
    ├── login/
    │   └── page.js           # Halaman login admin
    └── menu/
        └── page.js           # Manajemen menu/stok
```

**Strategi Hidden Route:**
- Route `/admin` tidak ditautkan di navbar atau footer landing page
- Tidak ada redirect otomatis ke `/admin` dari halaman manapun
- Admin akan mendapatkan URL langsung: `https://yourdomain.com/admin`
- Pertimbangkan menambahkan proteksi session/auth di masa depan untuk keamanan lebih

---

## 14. Admin Feature Roadmap

### Saat Ini (v1)
- [x] Melihat daftar pesanan masuk
- [x] Update status pesanan
- [x] Statistik pesanan (StatsOverview)
- [ ] **Manajemen stok** — update ketersediaan item menu
- [ ] **Informasi keuangan** — rekap pendapatan harian/mingguan/bulanan
- [ ] **Integrasi Fonnte** — notifikasi WA otomatis saat pesanan masuk

### Masa Depan (v2+)
- [ ] Autentikasi admin (login dengan username/password)
- [ ] Export laporan keuangan (PDF/Excel)
- [ ] Manajemen kategori menu
- [ ] Push notification

---

*Document version: 1.1 — Created: 2026-09-09 — Last updated: 2026-09-23*
*Untuk pertanyaan, lihat struktur folder atau tanyakan ke tim.*
