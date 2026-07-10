---
name: seo
description: Universal SEO — teknik audit, E-E-A-T, schema markup, GEO (Generative Engine Optimization), sitemap. Alt komutlar: /seo audit, /seo page, /seo content, /seo schema, /seo sitemap.
---

# SEO Skill

## Alt Komutlar

| Komut | Açıklama |
|-------|---------|
| `/seo audit` | Tam teknik SEO denetimi |
| `/seo page` | Tek sayfa optimizasyonu |
| `/seo content` | İçerik SEO analizi |
| `/seo schema` | Schema.org markup ekleme |
| `/seo sitemap` | XML sitemap oluşturma |

---

## /seo audit — Teknik SEO Denetimi

### Core Web Vitals
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] TTFB (Time to First Byte) < 600ms

### Teknik Kontrol
- [ ] robots.txt doğru yapılandırılmış
- [ ] sitemap.xml mevcut ve geçerli
- [ ] Canonical tag'ler doğru
- [ ] Meta title: 50-60 karakter
- [ ] Meta description: 120-160 karakter
- [ ] H1 tag: her sayfada bir tane
- [ ] Alt text: tüm görsellerde
- [ ] HTTPS zorunlu
- [ ] Mobile-first responsive

### Yapısal
- [ ] URL yapısı temiz (slug tabanlı)
- [ ] 404 sayfası özel
- [ ] Redirect zinciri yok
- [ ] Sayfa hızı optimize

---

## /seo schema — Schema Markup

Proje türüne göre schema:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "[Proje Adı]",
  "description": "[Açıklama]",
  "applicationCategory": "[Kategori]",
  "operatingSystem": "Web Browser",
  "author": {
    "@type": "Organization",
    "name": "[Organizasyon]"
  }
}
```

---

## GEO — Generative Engine Optimization

AI arama motorları için içerik optimize etme:

- **Yapısal içerik:** Başlık → Alt başlık → Madde → Örnek
- **Otorite sinyalleri:** Kaynak atıf, tarih, yazar
- **Direkt yanıt formatı:** Soru + direkt yanıt paragrafı
- **Entite netliği:** Özgün isimler, yer adları, markalar açık
- **Faktuel doğruluk:** İddia = kanıt + kaynak

---

## E-E-A-T Kontrol Listesi
- **Experience:** Deneyim gösteren içerik var mı?
- **Expertise:** Uzmanlık sinyalleri var mı?
- **Authoritativeness:** Otoriter kaynaklar kullanılıyor mu?
- **Trustworthiness:** Güven sinyalleri var mı?

---

## Çıktı Formatı

```
SEO RAPORU
URL: [url]
Tarih: [tarih]

Teknik Skor: [0-100]
Kritik Sorunlar: [liste]
İyileştirme Fırsatları: [liste]
Aksiyon Planı: [öncelik sırası]
```
