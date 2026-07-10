# Frontend Standartları — PARS

## Temel İlke
Frontend kullanıcıyla ilk temas noktasıdır. Her arayüz:
- İlk bakışta güven vermelidir
- Premium ve modern görünmelidir
- Projenin kendine özgü görsel kimliğini taşımalıdır
- Standart şablonlar ve generic AI estetiği kesinlikle yasaktır

## Zorunlu Özellikler

### Görsel Kalite
- Etkileyici açılış (splash) ekranı — her projede zorunlu
- Responsive: mobil önce, tablet, masaüstü
- Koyu / aydınlık tema desteği
- Çoklu dil altyapısı (en az TR + EN)
- Erişilebilirlik (WCAG 2.1 AA minimum)
- Projeye özgü tasarım sistemi — renk, tipografi, bileşen seti

### UX Kalitesi
- Karmaşık özellikleri sade sunum
- Boş durum ekranları (empty states) tasarlanmış
- Hata ekranları tasarlanmış ve bilgilendirici
- Yükleme durumları (skeleton screen / spinner) mevcut
- Kullanıcıya göre kişiselleştirilmiş ekranlar

### Bileşen Gereksinimleri (projeye göre seçilir)
| Bileşen | Ne Zaman |
|---------|---------|
| Dinamik kartlar | Her liste/içerik ekranında |
| Akıllı arama + filtreleme | 20+ öğe olan her listede |
| Grafikler ve veri görselleştirme | Dashboard ve analitik ekranlarında |
| Harita tabanlı ekranlar | Konum bazlı her özellikte |
| Sürükle-bırak | Sıralama/düzenleme işlemlerinde |
| Gerçek zamanlı bildirimler | Canlı veri ekranlarında |
| Canlı ön izleme | İçerik oluşturma akışlarında |

### Animasyon Kuralları
- Her animasyonun bir amacı olmalı — dekoratif animasyon yasak
- 300ms altında geçiş süresi (kullanıcı algısı)
- Performansı yavaşlatan animasyon → kaldır
- `prefers-reduced-motion` desteği zorunlu

## Tasarım Sistemi Zorunlulukları

Her projede tanımlanmalı:
```css
/* Renk sistemi */
--color-primary: ...     /* Proje ana rengi */
--color-secondary: ...
--color-accent: ...
--color-danger: ...
--color-bg: ...
--color-surface: ...
--color-text-primary: ...
--color-text-secondary: ...

/* Tipografi */
--font-display: ...      /* Başlık */
--font-body: ...         /* Gövde */
--font-mono: ...         /* Kod/veri */

/* Spacing */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 48px;
--space-2xl: 96px;
```

## Performans Hedefleri
- First Contentful Paint: < 1.5sn
- Time to Interactive: < 3sn
- Core Web Vitals: tümü yeşil
- Görsel optimizasyon: WebP, lazy load zorunlu
- Bundle size: her route < 200KB

## Yasak
- Generic mor/mavi gradient hero
- Neon glow efektleri
- "AI ürünü" sinyal rengi (mor)
- Simetrik 12-kolon her yerde
- Her şeyi kart içine koymak
- Tailwind varsayılan renk paleti değiştirilmemişse
- Loading olmadan veri bekletmek

## Geliştirme Sırası
1. Tasarım sistemi (renk + tipografi + spacing) önce kurulur
2. Bileşenler tasarım sistemine göre geliştirilir
3. Sayfa şablonları bileşenlerden oluşturulur
4. Animasyon en sona eklenir
