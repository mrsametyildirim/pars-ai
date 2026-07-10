---
name: pars-security-audit
description: Tam güvenlik denetimi. 05-owasp-security skill, Kalkan protokolü, secret taraması ve risk raporu.
---

# PARS Security Audit

## Kullanım
`/pars-security-audit [dosya/klasör]`

## Çalıştığında

1. Kalkan devreye al
2. 05-owasp-security skill ile OWASP Top 10 kontrolü
3. Secret taraması (regex ile)
4. Agentic AI güvenlik kontrolleri
5. Risk seviyesi belirle
6. Rapor üret

## Kapsamı
- OWASP Top 10
- OWASP ASVS (seçili kontroller)
- Secret/credential taraması
- Prompt injection riski
- MCP izin kontrolü

## Çıktı

```
[PARS GÜVENLİK RAPORU]
Tarih: [tarih]
Kapsam: [dosya/klasör]
Risk Seviyesi: Düşük / Orta / Yüksek / Kritik

OWASP Bulguları:
  [A01]: [TEMİZ / SORUNLU]
  ...

Secret Taraması: TEMİZ / [SORUNLU: satır X]
Agentic Kontrol: GEÇTİ / [BAŞARISIZ]

Kritik Aksiyonlar:
1. [acil düzeltme]
2. [acil düzeltme]

Karar: ONAY / BLOKE / YUVA
```
