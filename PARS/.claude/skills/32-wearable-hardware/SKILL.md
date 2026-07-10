---
name: 32-wearable-hardware
description: PARS Future Technologies — giyilebilir teknoloji ve donanım ekosistemi. AR gözlük entegrasyonu, WebXR cihaz optimizasyonu, Meta Quest/Apple Vision Pro/HoloLens hedefleri, haptic geribildirim (bHaptics), PARS hardware roadmap.
---

# Skill 32 — Wearable & Hardware

## Ne Zaman Kullanılır
- CEO-FUTURE tarafından çağrılır
- Yeni XR cihazı entegre edilirken
- WebXR performans optimizasyonu yapılırken
- Giyilebilir cihaz API'sı araştırılırken
- PARS hardware gereksinimleri belirlenirken

## Desteklenen Cihaz Platformları

| Cihaz | API/Platform | PARS Kullanımı | Öncelik |
|-------|-------------|----------------|---------|
| Meta Quest 3 | WebXR + OpenXR | PARAVERSE, TLOA VR | ★★★ |
| Apple Vision Pro | visionOS / RealityKit | PAR Media, spatial video | ★★★ |
| HoloLens 2 | Mixed Reality Toolkit | Kurumsal AR, iş çözümleri | ★★ |
| Snap Spectacles | Snap Lens Studio | Sosyal AR | ★★ |
| iPhone/Android | ARCore / ARKit | TLOA mobil AR, restaurant | ★★★ |
| Akıllı Saat | WearOS / watchOS | Bildirim, ödeme, sağlık | ★★ |
| bHaptics TactSuit | Unity plugin | TLOA dokunsal PvP | ★ |

## WebXR Temel Yapısı

```typescript
// Cihaz bağımsız XR oturumu başlatma
async function startXRSession(mode: 'immersive-vr' | 'immersive-ar' | 'inline') {
  if (!navigator.xr) {
    throw new Error('WebXR desteklenmiyor');
  }

  const isSupported = await navigator.xr.isSessionSupported(mode);
  if (!isSupported) {
    showFallback(mode);  // 2D alternatif sun
    return;
  }

  const session = await navigator.xr.requestSession(mode, {
    requiredFeatures: mode === 'immersive-ar'
      ? ['hit-test', 'dom-overlay']
      : ['local-floor', 'bounded-floor'],
    optionalFeatures: ['hand-tracking', 'mesh-detection', 'plane-detection'],
  });

  setupXRSession(session);
}
```

## Performans Hedefleri (XR)

```
Frame rate:  90 FPS (VR) / 60 FPS (AR) — asla düşürme
Latency:     < 20ms motion-to-photon
Draw calls:  < 100 per frame
Polygons:    < 200K per scene
Texture:     Max 1024x1024 per object
```

```typescript
// Performans profili
const XR_PERFORMANCE_BUDGET = {
  quest_3: {
    max_polygons: 200_000,
    max_draw_calls: 100,
    max_texture_size: 2048,
    target_fps: 90,
  },
  mobile_ar: {
    max_polygons: 50_000,
    max_draw_calls: 50,
    max_texture_size: 1024,
    target_fps: 60,
  },
};

function checkPerformanceBudget(deviceType: string, stats: RenderStats) {
  const budget = XR_PERFORMANCE_BUDGET[deviceType];
  if (stats.fps < budget.target_fps * 0.9) {
    reduceQuality(deviceType);
  }
}
```

## Haptic Geribildirim (bHaptics)

```typescript
// TLOA PvP için dokunsal efektler
import { HapticPlayer } from '@bhaptics/haptic-library';

const TLOA_HAPTICS = {
  attack_hit: 'pattern_attack_short',
  defense_block: 'pattern_block',
  card_played: 'pattern_card_tap',
  victory: 'pattern_victory',
  defeat: 'pattern_defeat',
  level_up: 'pattern_level_up',
};

async function triggerHaptic(event: keyof typeof TLOA_HAPTICS) {
  if (!HapticPlayer.isConnected()) return;
  await HapticPlayer.submitRegistered(TLOA_HAPTICS[event]);
}
```

## Apple Vision Pro Entegrasyonu

```swift
// visionOS — SwiftUI ile PARS uygulaması
import RealityKit
import SwiftUI

struct PARSVisionApp: App {
    var body: some Scene {
        WindowGroup {
            PARSMainView()
        }

        // Immersive Space — PARAVERSE için
        ImmersiveSpace(id: "PARAVERSE") {
            PARAVERSEView()
        }
        .immersionStyle(selection: .constant(.mixed), in: .mixed)
    }
}
```

## Akıllı Saat Entegrasyonu

```typescript
// WearOS / watchOS ortak API pattern
interface WearableNotification {
  title: string;
  body: string;
  action?: 'open_app' | 'approve' | 'dismiss';
  data?: Record<string, string>;
}

// PARGT ödeme — saatten onay
interface WearPaymentApproval {
  amount: number;
  currency: 'PARGT' | 'TRY';
  recipient: string;
  expires_at: string;   // 60 saniye
}
```

## PARS Hardware Gereksinimleri (Referans Doküman)

Kendi cihazı üretildiğinde:

```
Donanım:
- İşlemci: Snapdragon XR2+ Gen 2 veya eşdeğeri
- RAM: 12GB
- Depolama: 256GB (minimum)
- Pil: 8+ saat aktif AR kullanımı
- Kamera: RGB + depth + eye tracking
- Display: Micro-OLED, 4K per eye
- FOV: 90° horizontal minimum

Yazılım:
- PARAVERSE native client (önyüklü)
- PARGT wallet built-in
- Börü sesli asistan (yerel LLM — Ollama)
- Türkçe dil desteği (hardware seviyesi)
- Çevrimdışı mod: Temel özellikler internetsiz çalışır
- Over-the-air güncellemeler

Güvenlik:
- Biyometrik: iris/göz tarama
- PARGT ödeme: PIN + biyometrik onay
- End-to-end şifreleme tüm iletişimde
```

## Cihaz Tespit ve Fallback

```typescript
async function detectXRCapabilities() {
  return {
    hasWebXR: 'xr' in navigator,
    hasVRSupport: await navigator.xr?.isSessionSupported('immersive-vr'),
    hasARSupport: await navigator.xr?.isSessionSupported('immersive-ar'),
    hasHandTracking: false,  // Session başlayınca test edilir
    isMobile: /iPhone|iPad|Android/.test(navigator.userAgent),
    isQuest: /OculusBrowser/.test(navigator.userAgent),
    isVisionPro: /Apple Vision/.test(navigator.userAgent),
  };
}

function selectRenderMode(capabilities: XRCapabilities): RenderMode {
  if (capabilities.hasARSupport && capabilities.isMobile) return 'mobile-ar';
  if (capabilities.hasVRSupport && capabilities.isQuest) return 'quest-vr';
  if (capabilities.isVisionPro) return 'vision-pro';
  return 'web-3d';  // Three.js — XR yok ama 3D var
}
```

## Araştırma Takip Alanları (Sürekli İzle)

- Apple visionOS SDK yeni API'lar (her WWDC)
- Meta Connect açıklamaları (Quest yeni nesil)
- Samsung XR partnership (Google ile)
- Snap Spectacles gen 4 geliştirici sürümü
- Neuralink / Synchron klinik sonuçları
- Mojo Vision akıllı lens pre-production
