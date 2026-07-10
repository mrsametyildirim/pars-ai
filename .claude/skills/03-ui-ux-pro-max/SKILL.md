---
name: ui-ux-pro-max
description: Mevcut arayüzü premium kaliteye yükseltir. WCAG uyumu, renk paleti denetimi, tipografi iyileştirmesi, bileşen kalitesi, etkileşim tutarlılığı.
---

# UI/UX Pro Max Skill

## Amaç
Mevcut arayüzü tespit edilmiş sorunlar üzerinden premium seviyeye çıkar.

---

## Faz 1: Hızlı Audit (5 dakika)

### Görsel Kontrol
- [ ] Renk paleti proje design-system'a uyuyor mu?
- [ ] Kontrast WCAG AA (4.5:1) karşılanıyor mu?
- [ ] Font boyut hiyerarşisi mantıklı mı?
- [ ] İkonlar tutarlı mı? (aynı kütüphaneden)
- [ ] Boşluk (padding/margin) tutarlı mı?

### Etkileşim Kontrol
- [ ] Hover state'ler var mı?
- [ ] Focus görünür mü? (klavye erişimi)
- [ ] Loading durumları var mı?
- [ ] Hata durumları var mı?

### Premium Kalite Kontrol
- [ ] Amatör görünen element var mı?
- [ ] Aşırı gradient kullanımı var mı?
- [ ] Gereksiz gölge/efekt var mı?
- [ ] Clipart veya stok ikon karışımı var mı?

---

## Faz 2: Öncelikli Düzeltmeler

**Kritik (hemen):**
- Renk tutarsızlıkları
- Kontrast ihlalleri
- Kırık layout

**Önemli (bu sprint):**
- Tipografi hiyerarşisi
- Bileşen tutarlılığı
- Boşluk sistemi

**İsteğe Bağlı:**
- Mikro-animasyonlar
- İleri WCAG iyileştirmeleri

---

## Faz 3: Uygulama

### Renk Sistemi
```css
:root {
  --color-bg-primary: [zemin ana];
  --color-bg-secondary: [zemin ikincil];
  --color-accent-primary: [vurgu ana];
  --color-accent-critical: [kritik/alarm];
  --color-text-primary: [metin ana];
  --color-text-secondary: [metin ikincil];
  --color-border: [kenarlık];
}
```

### Tipografi Hiyerarşisi
```css
:root {
  --text-hero: clamp(2.5rem, 5vw, 4rem);
  --text-h1: clamp(2rem, 4vw, 3rem);
  --text-h2: clamp(1.5rem, 3vw, 2rem);
  --text-h3: 1.25rem;
  --text-body: 1rem;
  --text-small: 0.875rem;
  --text-label: 0.75rem;
}
```

### WCAG Kontrol
- Normal metin: 4.5:1 min kontrast
- Büyük metin (18px+): 3:1 min
- UI bileşenleri: 3:1 min
- Araç: webaim.org/resources/contrastchecker/

---

## Faz 4: Son Kontrol
- Playwright ile görsel test
- Responsive: 375px / 768px / 1440px
- Dark mode kontrolü (varsa)
