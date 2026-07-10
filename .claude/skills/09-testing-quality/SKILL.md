---
name: testing-quality
description: Vitest + Playwright ile kapsamlı test suite. Birim testler, E2E akışlar, görsel regresyon, smoke test ve kalite kapıları.
---

# Testing & Quality Skill

## Test Piramidi

```
        E2E (az, kritik yollar)
       /       \
    Integration  (API, DB)
   /               \
  Unit Tests (çok, hızlı)
```

---

## Vitest — Birim Testler

### Kurulum
```bash
npm install -D vitest @testing-library/react jsdom
```

### Test Şablonu
```typescript
import { describe, it, expect, vi } from 'vitest';

describe('RiskCalculator', () => {
  it('yüksek risk skoru döndürmeli', () => {
    const score = calculateRisk({ magnitude: 7.5, depth: 10 });
    expect(score).toBeGreaterThan(80);
  });

  it('geçersiz girdi için hata fırlatmalı', () => {
    expect(() => calculateRisk(null)).toThrow('Invalid input');
  });
});
```

### Coverage Hedefleri
- Kritik path: %100
- Genel: %80 minimum
- Yardımcı fonksiyonlar: %70

---

## Playwright — E2E Testler

### Kurulum
```bash
npm install -D @playwright/test
npx playwright install
```

### Temel Test
```typescript
import { test, expect } from '@playwright/test';

test('ARES dashboard yükleniyor', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Splash screen görünüyor mu?
  await expect(page.locator('.splash-screen')).toBeVisible();
  
  // Dashboard yüklendi mi?
  await expect(page.locator('.dashboard-grid')).toBeVisible();
});

test('risk haritası çalışıyor', async ({ page }) => {
  await page.goto('http://localhost:3000/map');
  await expect(page.locator('#risk-map')).toBeVisible();
  await expect(page.locator('.map-legend')).toBeVisible();
});
```

### Responsive Test
```typescript
const devices = [
  { width: 375, height: 812, name: 'Mobile' },
  { width: 768, height: 1024, name: 'Tablet' },
  { width: 1440, height: 900, name: 'Desktop' },
];

for (const device of devices) {
  test(`Responsive: ${device.name}`, async ({ page }) => {
    await page.setViewportSize(device);
    await page.goto('http://localhost:3000');
    await expect(page.locator('.nav')).toBeVisible();
  });
}
```

---

## Smoke Test Checklist

Her deployment sonrası:
- [ ] Splash screen açılıyor
- [ ] Ana sayfaya geçiş oluyor
- [ ] Kritik bileşenler görünüyor
- [ ] Console'da hata yok
- [ ] API mock yanıt veriyor
- [ ] Responsive kırılma yok

---

## Kalite Kapıları (Release Öncesi)

| Kriter | Eşik |
|--------|------|
| Unit test geçiş | %100 |
| Coverage | %80+ |
| E2E smoke | Tümü geçmeli |
| Lighthouse Perf | 70+ |
| Lighthouse A11y | 85+ |
| WCAG AA | Geçmeli |
| Secret tarama | TEMİZ |

---

## Test Çalıştırma

```bash
# Birim testler
npx vitest

# Coverage
npx vitest --coverage

# E2E
npx playwright test

# Belirli test
npx playwright test dashboard.spec.ts

# UI mode
npx playwright test --ui
```
