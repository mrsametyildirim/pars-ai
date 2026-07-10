---
name: pars-review
description: Kod veya tasarım kalite incelemesi. 04-code-review veya 03-ui-ux-pro-max skill'ini aktive eder.
---

# PARS Review

## Kullanım
`/pars-review [dosya/klasör]` veya `/pars-review design`

## Çalıştığında

### Kod Review
1. Dosyayı oku
2. 04-code-review skill ile 4 fazlı inceleme
3. 05-owasp-security ile güvenlik kontrolü
4. Bulguları severity'e göre sırala
5. Çıktı: blocking → important → nit → praise

### Tasarım Review
1. Sayfayı veya bileşeni incele
2. 03-ui-ux-pro-max ile audit
3. WCAG kontrolü
4. Çıktı: KRİTİK → ÖNERİ → ONAY

## Çıktı Formatı

```
[PARS REVIEW — KOD]
Dosya: [dosya]
Risk: [Düşük/Orta/Yüksek]

[blocking] ... (varsa)
[important] ... (varsa)
[nit] ... (varsa)
[praise] ... (varsa)

Aksiyon: [en kritik 3 madde]
```
