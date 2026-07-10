---
name: research-kasif
description: Repo, benchmark, trend araştırması. Ne zaman çağrılır/çağrılmaz kuralları kesin. Kaşif bilinen bilgiyi araştırma olarak paketlemez. Trigger: /pars-research
---

# Research Kaşif Skill

## Kritik Kural
**Bilinen bilgiyi araştırma olarak sunma.** Claude'un zaten bildiği bir şeyi "araştırıyorum" diye web'e bakma. Bu token ve zaman israfıdır.

---

## Ne Zaman Kullan

Gerçek araştırma gerektiren durumlar:
- Yeni çıkan bir kütüphane veya araç hakkında bilgi
- Spesifik repo'nun içeriği ve API'si
- Benchmark karşılaştırması (gerçek sayılar)
- Piyasada en iyi alternatif nedir sorusu
- Yeni bir CVE veya güvenlik açığı
- Kaşif'e özellikle yönlendirme yapıldı

---

## Ne Zaman Kullanma

```
✗ "React nedir?" → Claude zaten biliyor
✗ "REST API nasıl tasarlanır?" → Claude zaten biliyor
✗ "OWASP Top 10 neler?" → Claude zaten biliyor
✗ "TypeScript syntax" → Claude zaten biliyor
```

---

## Araştırma Hiyerarşisi

```
1. bilge-vault → daha önce öğrenilmiş mi?
2. PARS docs → zaten dokümante mi?
3. İlgili repolar → C:\Users\MSI-NB\.claude\claude-kaynak\repos\
4. context7 → kütüphane dokümantasyonu
5. WebSearch → son çare, gerçekten bilinmiyor
```

---

## Repo Araştırma Protokolü

```
Repo: C:\Users\MSI-NB\.claude\claude-kaynak\repos\<repo-adı>\

1. README.md oku (amaç ve özellikler)
2. Temel dosyaları tara (kaynak yapısı)
3. Örnek/demo klasörüne bak
4. package.json / requirements.txt (bağımlılıklar)
5. Özet çıkar
```

---

## Benchmark Araştırma Formatı

```
ARAŞTIRMA: [konu]
Yöntem: [nasıl araştırıldı]
Sonuçlar:
  A: [değer/özellik]
  B: [değer/özellik]
  C: [değer/özellik]
PARS Önerisi: [hangisi, neden]
Kaynak: [referans]
```

---

## Trend Araştırma

```
Konu: [teknoloji/alan]
Trend Durumu: Yükselen / Stabil / Düşen
Kanıt: [somut gösterge]
PARS Etkisi: [ilgili ise]
Aksiyon: [ne yapılmalı / yapılmamalı]
```

---

## Çıktı Standardı
Araştırma çıktısı maksimum 1 sayfa. Bullet point. Kısa. Aksiyon odaklı.
Kullanıcı "araştırmaya" değil sonuca ihtiyaç duyar.
