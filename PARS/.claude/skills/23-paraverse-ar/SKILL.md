---
name: paraverse-ar
description: PARAVERSE ekosistemi ve AR/XR geliştirme. TLOA oyun mimarisi, PARGT token entegrasyonu, PARS Engine API, çok kullanıcılı AR sahneler, fiziksel dünya katmanlama. CEO-PARAVERSE ve CEO-XR'ın ana aracı.
---

# Skill: PARAVERSE AR

## PARAVERSE Mimarisi

```
┌─────────────────────────────────────────────────────┐
│                   PARAVERSE                          │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │  TLOA       │  │  PAR Media  │  │ PARSVille  │  │
│  │  AR Kart    │  │  XR Sosyal  │  │ Dijital    │  │
│  │  Oyunu      │  │  Medya      │  │ Gayrimenkul│  │
│  └─────────────┘  └─────────────┘  └────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  PARS Engine — Geliştirici Platformu        │   │
│  │  AR SDK + API + Asset Store + Marketplace   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌───────────────┐  ┌──────────────────────────┐   │
│  │  AR Layer     │  │  PARGT Token             │   │
│  │  Fiziksel Dünya│  │  Utility + Governance   │   │
│  │  Üstü Katman  │  │  Gate.io → Binance       │   │
│  └───────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## TLOA Teknik Detaylar

### Kart Sistemi
```js
// Kart veri yapısı
{
  id: "TLOA-001",
  name: "Dede Korkut",
  rarity: "legendary",        // common/rare/epic/legendary
  attack: 8, defense: 6,
  ability: "Hikaye Anlatıcısı",
  ar_model: "dede_korkut.glb",
  pargt_value: 150,           // PARGT cinsinden değer
  nft_mint: "0x..."           // Blockchain adresi
}
```

### AR Sahne Yapısı (A-Frame)
```html
<a-scene>
  <a-entity id="ar-card-arena">
    <!-- Zemin tespit -->
    <a-plane class="ground-detector" />
    
    <!-- Kart 3D modeli -->
    <a-gltf-model src="#dede-korkut" 
                  position="0 0 -1"
                  animation="property: rotation; to: 0 360 0" />
    
    <!-- Çarpışma efekti -->
    <a-particle-system preset="dust" />
  </a-entity>
</a-scene>
```

### Çok Kullanıcılı PvP
```js
// WebSocket ile gerçek zamanlı
const ws = new WebSocket('wss://pars-engine.io/tloa/match');
ws.on('card_played', (data) => updateArena(data));
ws.on('battle_result', (data) => showVFX(data));
```

## PARGT Token Entegrasyonu

| Aksiyon | PARGT |
|---------|-------|
| Kart satın alma | 10-500 |
| PvP giriş ücreti | 5 |
| PvP kazanma ödülü | 8 (net +3) |
| Günlük keşif ödülü | 1-3 |
| Turnuva birincisi | 1000 |
| Kart NFT listing | Pazar bedeli |

## AR Fiziksel Dünya Katmanı

### Konum Bazlı AR
```js
// GPS + AR overlay
navigator.geolocation.getCurrentPosition(pos => {
  const arLayer = createARLayer({
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    radius: 100  // metre
  });
  renderNearbyContent(arLayer);
});
```

### İçerik Türleri
- TLOA kart spawns (belirli mekânlarda nadir kartlar)
- Restoran menü overlay
- Etkinlik AR kapısı
- Tarihi yapı canlandırma
- Dijital reklam panelleri

## PARS Engine API

```
POST /api/v1/engine/scene      → AR sahne oluştur
GET  /api/v1/engine/assets     → Asset kütüphanesi
POST /api/v1/engine/publish    → Sahneyi yayınla
GET  /api/v1/engine/analytics  → Sahne analitik
```

## Platform Hedefleri

| Platform | Yaklaşım | Zaman Çizelgesi |
|----------|----------|----------------|
| Mobil (iOS/ARKit) | React Native + ViroAR | Prototype 2027 |
| Mobil (Android/ARCore) | React Native + ViroAR | Prototype 2027 |
| Web | WebXR + A-Frame | Beta 2027 |
| AR Gözlük | Native Unity | 2028+ |
| VR Kulaklık | Unity + OpenXR | 2028+ |

## Performans Kuralları
- 3D model: max 50k polygon (mobil), 500k (masaüstü)
- Texture: WebP, max 1024×1024 mobil
- Scene load time: < 3 saniye hedef
- AR frame rate: 60fps hedef, min 30fps
- Draco compression: GLTF için zorunlu
