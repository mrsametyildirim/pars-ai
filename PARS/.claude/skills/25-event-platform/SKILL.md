---
name: event-platform
description: Etkinlik yönetim sistemleri — QR tabanlı fotoğraf paylaşımı, düğün/mezuniyet medya, organizasyon paneli, site yönetimi. CEO-EVENTS'in ana aracı.
---

# Skill: Event Platform

## QR Fotoğraf Sistemi — Flagship Ürün

### Akış
```
Organizatör giriş → Etkinlik oluştur → QR kodu al → Misafirlere dağıt
Misafir → QR tara → Tarayıcı açılır → Fotoğraf yükle
Galeri → Gerçek zamanlı güncelleme → Organizatör onaylar → Herkes görür
Son → Albüm indir (ZIP)
```

### Veri Modeli
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,               -- benim-dugunum-2026
  name TEXT NOT NULL,
  type TEXT,                      -- wedding/graduation/birthday/corporate
  owner_id UUID,
  cover_image TEXT,
  moderation BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,         -- etkinlik bitişi + 30 gün
  download_enabled BOOLEAN DEFAULT true,
  max_uploads INT DEFAULT 500
);

CREATE TABLE event_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  uploader_name TEXT,
  file_url TEXT,
  thumb_url TEXT,
  status TEXT DEFAULT 'pending',  -- pending/approved/rejected
  uploaded_at TIMESTAMPTZ DEFAULT now()
);
```

### QR Kodu Üretimi
```js
import QRCode from 'qrcode';

const generateEventQR = async (eventSlug) => {
  const url = `https://pars-events.app/e/${eventSlug}`;
  const qrSvg = await QRCode.toString(url, { type: 'svg', width: 256 });
  return qrSvg;
};
```

### Gerçek Zamanlı Galeri (Supabase Realtime)
```js
// Yeni fotoğraf gelince galeri anında güncellenir
const subscribeToPhotos = (eventId, onNewPhoto) => {
  return supabase
    .channel(`event-${eventId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'event_photos',
      filter: `event_id=eq.${eventId}`
    }, payload => onNewPhoto(payload.new))
    .subscribe();
};
```

## Düğün Medya Sistemi

### Özellikler
- Davetiye dijital tasarımı (Remotion ile animasyonlu)
- Misafir listesi yönetimi + RSVP
- Özel galeri linki (şifre korumalı)
- Masa planı
- Guestbook: misafirler not/video mesaj bırakır
- Countdown timer
- Düğün programı (interactive timeline)

### Davetiye Animasyonu (Remotion)
```jsx
const WeddingInvitation = () => (
  <AbsoluteFill style={{ background: '#f5e6d0' }}>
    <Sequence from={0} durationInFrames={60}>
      <Animated.Text fadeIn>Sevgili Misafirimiz</Animated.Text>
    </Sequence>
    <Sequence from={60} durationInFrames={90}>
      <Animated.Text scale>Ayşe & Mehmet</Animated.Text>
    </Sequence>
    <Sequence from={150}>
      <DateAndVenueCard />
    </Sequence>
  </AbsoluteFill>
);
```

## Site / Apartman Yönetim Paneli

### Modüller
```
├── Aidat Takibi
│   └── Kim ödedi? Kim gecikti? Otomatik hatırlatma
├── Duyurular
│   └── Tüm sakinlere SMS/WhatsApp/e-posta
├── Toplantı Yönetimi
│   └── Gündem, oy kullanma, karar arşivi
├── Gider Takibi
│   └── Ortak alan giderleri, faturalar
├── Talep/Şikayet
│   └── Sakin bildiriyor → Yönetim yanıtlıyor → Kapatılıyor
└── Ziyaretçi Takibi
    └── QR ile giriş/çıkış kaydı
```

## PARAVERSE Entegrasyonu
- Etkinlik mekânında AR filtreler (düğün/doğum günü teması)
- Dijital anı: etkinlik fotoğrafları PARAVERSE koleksiyonuna
- AR dans pisti efektleri

## Teknoloji Stack
- Next.js — etkinlik mikro-sitesi
- Supabase — realtime + storage
- Cloudinary — görsel optimizasyon + NSFW filter
- Remotion — animasyonlu davetiye/video
- QRCode.js — QR üretimi
- React Native — mobil kamera
