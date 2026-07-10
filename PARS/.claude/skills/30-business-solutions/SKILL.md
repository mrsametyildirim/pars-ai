---
name: 30-business-solutions
description: PARS Business Solutions B2B platform mimarisi. Restoran çözümleri (QR menü, AR menü, sipariş, paylaşımlı ödeme, analitik), gayrimenkul (360° tur, VR ev, AR mobilyalama, CRM), site/apartman yönetimi (aidat, duyuru, şikayet, toplantı).
---

# Skill 30 — Business Solutions

## Ne Zaman Kullanılır
- CEO-BUSINESS tarafından çağrılır
- Restoran dijital çözümü eklenirken
- Gayrimenkul sanal tur sistemi kurulurken
- Apartman / site yönetim paneli yapılırken

## Restoran Sistemi

### DB Şeması

```sql
-- Restoranlar
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  logo_url TEXT,
  qr_code_url TEXT,
  settings JSONB DEFAULT '{}',   -- tema rengi, dil, para birimi
  subscription_plan VARCHAR(20) DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menü kategorileri
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  position INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Menü öğeleri
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  photo_url TEXT,
  ar_model_url TEXT,           -- PARAVERSE AR için 3D model
  allergens TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  position INT DEFAULT 0
);

-- Masalar
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number INT NOT NULL,
  qr_code_url TEXT,
  capacity INT DEFAULT 4
);

-- Siparişler
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  table_id UUID REFERENCES tables(id),
  items JSONB NOT NULL,         -- [{item_id, quantity, price, notes}]
  total DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending',  -- pending|preparing|ready|served|paid
  payment_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### QR Menü Flow
```
Müşteri masaya oturur
→ QR kodu okur (kameradan)
→ Menü sayfası açılır (slug: pars.menu/{restaurant-slug}?table={id})
→ Kategoriler görünür
→ Ürün seçer → AR görüntüle butonu (3D model)
→ Sipariş verir
→ Ödeme: tek ödeme veya paylaşımlı ödeme seç
→ Her kişi kendi payını öder (Iyzico link)
```

### AR Menü Entegrasyonu (PARAVERSE ile)
```typescript
// Ürün AR görüntüleme
async function viewItemInAR(itemId: string) {
  const item = await getMenuItem(itemId);
  if (!item.ar_model_url) {
    showToast('Bu ürün için AR görsel henüz yok');
    return;
  }
  // PARAVERSE AR viewer'ı aç
  openARViewer({ modelUrl: item.ar_model_url, itemName: item.name });
}
```

## Gayrimenkul Sistemi

### 360° Tur Yapısı
```typescript
// Pannellum ile 360° görüntü
interface VirtualTour {
  id: string;
  property_id: string;
  scenes: Array<{
    id: string;
    title: string;            // "Salon", "Yatak Odası", "Mutfak"
    image_url: string;        // equirectangular panorama
    hotspots: Array<{
      pitch: number;
      yaw: number;
      target_scene_id: string;
      text: string;
    }>;
  }>;
  default_scene: string;
}
```

### Gayrimenkul CRM
```sql
CREATE TABLE property_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  lead_name VARCHAR(200),
  lead_phone VARCHAR(20),
  lead_email VARCHAR(200),
  source VARCHAR(50),          -- 'qr_scan' | 'website' | 'referral'
  status VARCHAR(20) DEFAULT 'new',  -- new|contacted|tour_scheduled|offer|closed
  notes TEXT,
  agent_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Site/Apartman Yönetimi

### DB Şeması
```sql
-- Siteler/apartmanlar
CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  address TEXT,
  manager_id UUID REFERENCES auth.users(id),
  unit_count INT,
  settings JSONB DEFAULT '{}'
);

-- Daireler/birimler
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  unit_number VARCHAR(20) NOT NULL,
  floor INT,
  owner_id UUID REFERENCES auth.users(id),
  resident_id UUID REFERENCES auth.users(id),
  is_rented BOOLEAN DEFAULT FALSE
);

-- Aidat / ödemeler
CREATE TABLE dues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES buildings(id),
  unit_id UUID REFERENCES units(id),
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  payment_method VARCHAR(30),
  period VARCHAR(7) NOT NULL,   -- '2026-07' formatı
  status VARCHAR(10) DEFAULT 'pending'
);

-- Duyurular
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES buildings(id),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Şikayetler / talepler
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID REFERENCES buildings(id),
  unit_id UUID REFERENCES units(id),
  requester_id UUID REFERENCES auth.users(id),
  category VARCHAR(50),         -- 'sikayet' | 'bakim' | 'oneri' | 'bilgi'
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'open',
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Aidat Hatırlatma (n8n ile)
```json
{
  "n8n_workflow": "dues_reminder",
  "trigger": "Cron - Her ayın 1'i saat 09:00",
  "steps": [
    "Vadesi 5 gün içinde olan aidatları sorgula",
    "Her sakin için Telegram mesajı hazırla",
    "Toplu bildirim gönder",
    "Ödeme link'i ekle (Iyzico)"
  ]
}
```

## SaaS Fiyatlandırma Modeli

```typescript
const PLANS = {
  free: {
    price: 0,
    restaurants: 1,
    menu_items: 50,
    ar_menu: false,
    analytics: false,
  },
  basic: {
    price: 299,  // TL/ay
    restaurants: 1,
    menu_items: 500,
    ar_menu: false,
    analytics: true,
  },
  pro: {
    price: 799,  // TL/ay
    restaurants: 5,
    menu_items: -1,  // sınırsız
    ar_menu: true,
    analytics: true,
    priority_support: true,
  },
};
```
