---
name: remotion
description: React + Remotion ile programatik video üretimi. Reels, reklamlar, carousels. Export: MP4/GIF/PNG/ProRes. CEO-MEDIA'nın birincil video aracı.
---

# Remotion Video Skill

## Amaç
React bileşenleriyle video ve animasyon üretimi. Kod = video.

## Desteklenen Formatlar
- **MP4:** Sosyal medya, web
- **GIF:** Kısa animasyon, sosyal
- **PNG Sequence:** After Effects/Premiere için
- **ProRes:** Yüksek kalite prodüksiyon

---

## Proje Yapısı

```
remotion-project/
├── src/
│   ├── compositions/    ← Video bileşenleri
│   ├── components/      ← UI bileşenleri
│   ├── assets/          ← Ses, görsel
│   └── Root.tsx         ← Composition registry
├── remotion.config.ts
└── package.json
```

---

## Composition Şablonu

```tsx
import { Composition } from 'remotion';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Reel"
        component={ReelComponent}
        durationInFrames={150}  // 5 saniye @ 30fps
        fps={30}
        width={1080}
        height={1920}  // Dikey Reel formatı
      />
    </>
  );
};
```

---

## Format Boyutları

| Format | Boyut | FPS | Kullanım |
|--------|-------|-----|---------|
| Instagram Reel | 1080x1920 | 30 | Dikey video |
| Instagram Post | 1080x1080 | 30 | Kare |
| YouTube Short | 1080x1920 | 60 | Dikey |
| YouTube Video | 1920x1080 | 30 | Yatay |
| LinkedIn Post | 1200x628 | 30 | Yatay |
| Twitter/X | 1280x720 | 30 | Yatay |

---

## Animasyon Pattern'ları

### Fade In
```tsx
import { interpolate, useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 20], [0, 1]);
```

### Slide Up
```tsx
const translateY = interpolate(frame, [0, 30], [50, 0], {
  extrapolateRight: 'clamp'
});
```

### Scale
```tsx
const scale = interpolate(frame, [0, 20], [0.8, 1]);
```

---

## Export Komutları

```bash
# MP4 render
npx remotion render src/index.ts Reel output/reel.mp4

# Belirli frame aralığı
npx remotion render src/index.ts Reel output/clip.mp4 --frames=0-90

# GIF
npx remotion render src/index.ts Reel output/reel.gif --codec=gif

# PNG sequence
npx remotion render src/index.ts Reel output/frames/ --codec=png
```

---

## PARS Entegrasyonu
- CEO-MEDIA tüm video istekleri için bu skill'i kullanır
- instagram MCP ile doğrudan yayın
- `C:\PARS\projects\MEDIA\` altında video projeler
