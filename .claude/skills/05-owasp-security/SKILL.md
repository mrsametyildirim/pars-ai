---
name: owasp-security
description: OWASP Top 10 + ASVS + Agentic AI güvenlik denetimi. Prompt injection savunması, tool boundary kontrolü, secret taraması ve risk değerlendirmesi.
---

# OWASP Security Skill

## Kapsamı
- OWASP Top 10 (Web güvenliği)
- OWASP ASVS (Uygulama güvenlik doğrulama)
- Agentic AI güvenlik kontrolleri (PARS özgün)

---

## OWASP Top 10 — Kontrol Listesi

### A01: Broken Access Control
```
✓ Her endpoint yetki kontrol ediyor mu?
✓ Kullanıcı başka kullanıcının kaynağına erişebilir mi?
✓ Admin endpoint'leri korumalı mı?
✓ CORS politikası wildcard (*) değil mi?
```

### A02: Cryptographic Failures
```
✓ HTTPS zorunlu mu?
✓ Hassas veri şifreleniyor mu?
✓ Zayıf algoritma kullanılmıyor mu? (MD5, SHA1 yasak)
✓ TLS 1.2+ kullanılıyor mu?
```

### A03: Injection
```
✓ SQL → parametreli sorgu
✓ NoSQL → query builder veya sanitize
✓ Command injection → input sanitize
✓ XSS → output encoding
✓ Template injection → güvenli render
```

### A04: Insecure Design
```
✓ Threat model yapıldı mı?
✓ Rate limiting var mı?
✓ İş mantığı bypass riski var mı?
```

### A05: Security Misconfiguration
```
✓ Default credential değiştirildi mi?
✓ Error mesajı stack trace veriyor mu?
✓ Debug modu production'da kapalı mı?
✓ Gereksiz port/servis kapalı mı?
```

### A06: Vulnerable Components
```
✓ npm audit / pip audit çalıştırıldı mı?
✓ Bilinen CVE'leri olan bağımlılık var mı?
✓ Bağımlılıklar güncel mi?
```

### A07: Identification and Authentication Failures
```
✓ Brute force koruması var mı?
✓ Session timeout var mı?
✓ Güçlü şifre politikası var mı?
✓ MFA destekleniyor mu?
```

### A08: Software and Data Integrity Failures
```
✓ Dependency integrity check var mı?
✓ CI/CD pipeline güvenli mi?
✓ Serialization güvenli mi?
```

### A09: Security Logging and Monitoring Failures
```
✓ Auth olayları loglanıyor mu?
✓ Log'a hassas veri girmiyor mu?
✓ Merkezi log sistemi var mı?
```

### A10: Server-Side Request Forgery (SSRF)
```
✓ Kullanıcı girdisi URL olarak kullanılıyor mu?
✓ URL allowlist var mı?
✓ Internal IP'lere erişim engelleniyor mu?
```

---

## Agentic AI Kontrolleri (PARS Özgün)

### Prompt Injection
```
✓ Kullanıcı girdisi sistem prompt'una enjekte edilemez
✓ Tool çıktıları agent talimatına enjekte edilemez
✓ Harici içerik (web, dosya) sandbox'ta işlenir
```

### Tool Boundary
```
✓ Her agent yalnızca yetki aldığı araçlara erişir
✓ Filesystem erişimi kısıtlı dizinlerle sınırlı
✓ Network istekleri allowlist ile kontrol edilir
```

### Secret Handling
```
✓ API key response'a girmez
✓ Token log'a basılmaz
✓ Credential context'te gösterilmez
```

---

## Secret Tarama Regex

```
API key: (sk-|api_key|apikey|API_KEY)\s*[:=]\s*\S+
Token: (token|TOKEN|secret|SECRET)\s*[:=]\s*\S+
Password: (password|PASSWORD|passwd)\s*[:=]\s*\S+
Private key: -----BEGIN [A-Z]+ PRIVATE KEY-----
AWS: AKIA[0-9A-Z]{16}
```

---

## Risk Değerlendirme Çıktısı

```
[OWASP GÜVENLİK RAPORU]
Risk: Düşük / Orta / Yüksek / Kritik
Top 10 Bulguları: [liste veya "TEMİZ"]
Agentic Kontrol: GEÇTİ / [BAŞARISIZ: sebep]
Secret Tarama: TEMİZ / [SORUNLU: satır X]
Öncelikli Aksiyon: [en kritik düzeltme]
```
