---
name: marketplace
description: Pazar yeri mimarisi — ilan sistemi, arama/filtreleme, alıcı-satıcı mesajlaşma, ödeme entegrasyonu, güven skoru, konum bazlı listeleme, müzayede motoru. CEO-MARKETPLACE'in ana aracı.
---

# Skill: Marketplace

## Çekirdek Mimari

```
┌────────────┐     ┌─────────────┐     ┌────────────┐
│  Frontend  │────▶│   API GW    │────▶│  Services  │
│ Next.js    │     │ (Auth+Rate) │     │            │
└────────────┘     └─────────────┘     ├────────────┤
                                       │ Listing    │
┌────────────┐     ┌─────────────┐     │ Search     │
│  Mobile    │────▶│   Realtime  │────▶│ Messaging  │
│ Flutter    │     │ (Supabase)  │     │ Payment    │
└────────────┘     └─────────────┘     │ Review     │
                                       └────────────┘
```

## Veri Modeli

### Ürün/İlan
```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL,
  category_id INT,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2),
  price_type TEXT DEFAULT 'fixed', -- fixed/negotiable/free/auction
  condition TEXT,                  -- new/like_new/good/fair
  images TEXT[],                   -- Supabase Storage URL'leri
  location POINT,                  -- lat/lng
  city TEXT,
  status TEXT DEFAULT 'active',    -- active/sold/paused/deleted
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ           -- 30-90 gün
);
```

### Güven Skoru
```sql
CREATE TABLE user_trust_scores (
  user_id UUID PRIMARY KEY,
  score INT DEFAULT 50,           -- 0-100
  total_sales INT DEFAULT 0,
  positive_reviews INT DEFAULT 0,
  negative_reviews INT DEFAULT 0,
  verified_phone BOOLEAN,
  verified_id BOOLEAN,
  member_since TIMESTAMPTZ
);
```

## Arama ve Filtreleme

### Supabase Fulltext Search
```js
const searchListings = async ({ query, category, minPrice, maxPrice, city, condition }) => {
  let q = supabase
    .from('listings')
    .select('*')
    .textSearch('title', query)
    .eq('status', 'active');
  
  if (category) q = q.eq('category_id', category);
  if (minPrice) q = q.gte('price', minPrice);
  if (maxPrice) q = q.lte('price', maxPrice);
  if (city) q = q.eq('city', city);
  if (condition) q = q.eq('condition', condition);
  
  return q.order('created_at', { ascending: false }).limit(24);
};
```

### Konum Bazlı Arama
```sql
-- PostGIS ile mesafe hesaplama
SELECT *, 
  ST_Distance(location::geography, ST_MakePoint(28.97, 41.01)::geography) AS distance_meters
FROM listings
WHERE ST_DWithin(location::geography, ST_MakePoint(28.97, 41.01)::geography, 10000)
ORDER BY distance_meters
LIMIT 20;
```

## Müzayede Motoru

### Teklif Sistemi
```js
const placeBid = async (auctionId, userId, amount) => {
  const auction = await getAuction(auctionId);
  
  if (amount <= auction.current_bid) {
    throw new Error('Teklif mevcut en yüksek teklifin üzerinde olmalı');
  }
  
  // Optimistic lock ile race condition önleme
  const { data, error } = await supabase.rpc('place_bid', {
    p_auction_id: auctionId,
    p_user_id: userId,
    p_amount: amount
  });
  
  // Önceki en yüksek teklif sahibine bildirim
  await notifyOutbid(auction.highest_bidder, auctionId, amount);
};
```

## Ödeme Entegrasyonu

### Iyzico (Türkiye)
```js
const createPayment = async ({ buyer, listing, amount }) => {
  const request = {
    locale: 'tr',
    price: amount.toString(),
    paidPrice: amount.toString(),
    currency: 'TRY',
    basketItems: [{
      id: listing.id,
      name: listing.title,
      category1: listing.category,
      itemType: 'PHYSICAL',
      price: amount.toString()
    }]
  };
  return iyzipay.payment.create(request);
};
```

### Emanet Sistemi (Escrow)
```
Alıcı ödeme yapar → Para emanette bekler →
Satıcı kargo gönderir → Alıcı teslim alır → Para satıcıya gider
Anlaşmazlık → PARS moderasyon
```

## Moderation Pipeline
```
Yeni ilan → Otomatik kontrol (yasaklı kelime, sahte fiyat) →
Görsel analiz (NSFW kontrolü) →
Güven skoru < 20 → Manuel inceleme →
Yayınla / Reddet
```

## AR Entegrasyonu (PARAVERSE)
```js
// Ürünü AR'da görüntüle
const viewInAR = (listing) => {
  if (!listing.ar_model_url) return showMessage('Bu ürün için AR görüntüleme mevcut değil');
  
  launchARViewer({
    model: listing.ar_model_url,
    scale: listing.ar_scale || 1.0,
    placement: 'floor'
  });
};
```
