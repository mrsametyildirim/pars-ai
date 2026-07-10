# PARS Güvenlik Sistemi — Kalkan Protokolü

## Temel İlkeler
- Güvenlik sonradan eklenmez; baştan tasarlanır.
- Hiçbir secret koda gömülmez. Asla. İstisna yok.
- Her production değişikliği Kalkan'dan geçer.
- Risk seviyesi "Yüksek" veya üstüyse insan onayı şarttır.

---

## Risk Seviyeleri

| Seviye | Kriter | Aksiyon |
|--------|--------|---------|
| Düşük | Statik içerik, UI metni, CSS değişikliği | Devam et |
| Orta | API endpoint ekleme, veri okuma | Uyar, logla, devam et |
| Yüksek | Auth değişikliği, DB şeması, yetki kontrolü | Bloke et, CEO onayı al |
| Kritik | Secret sızıntısı, RCE olasılığı, prod veri kaybı | Yuva aç, her şeyi durdur |

---

## OWASP Top 10 Kontrol Listesi

Her production-bound PR için:

1. **A01 Broken Access Control** — Yetki kontrolleri var mı? Kullanıcı başka kullanıcının verisine erişebilir mi?
2. **A02 Cryptographic Failures** — Hassas veri şifreleniyor mu? HTTP → HTTPS zorlanıyor mu?
3. **A03 Injection** — SQL/NoSQL/Command injection var mı? Parametreli sorgu kullanılıyor mu?
4. **A04 Insecure Design** — Threat model yapıldı mı? İş mantığı güvenli mi?
5. **A05 Security Misconfiguration** — Default credential var mı? Error mesajı hassas bilgi veriyor mu?
6. **A06 Vulnerable Components** — Bağımlılıklar güncel mi? CVE kontrolü yapıldı mı?
7. **A07 Auth Failures** — Brute force koruması var mı? Session güvenli mi?
8. **A08 Data Integrity** — CI/CD pipeline güvenli mi? Dependency integrity kontrolü var mı?
9. **A09 Logging Failures** — Güvenlik olayları loglanıyor mu? Log'a hassas veri düşüyor mu?
10. **A10 SSRF** — Kullanıcı girdisi URL olarak kullanılıyor mu? Allowlist var mı?

---

## Agentic AI Güvenlik Kontrolleri

PARS özelinde ek kontroller:

- **Prompt Injection:** Kullanıcı girdisi agent talimatına enjekte edilmez
- **Tool Boundary:** Her agent yalnızca yetkili araçlara erişir
- **Secret Handling:** API key, token, şifre hiçbir zaman log'a veya response'a girmez
- **MCP İzinleri:** Her MCP açıkça yetkilendirilmiş ve kapsamı sınırlı
- **Agent Escalation:** Alt agent üst agent yetkisini devralmaya çalışamaz

---

## Secret Kontrol Protokolü

Aşağıdakiler koda **asla** gömülmez:
- API anahtarları (OpenAI, Anthropic, Google, AWS...)
- Database şifreleri ve connection string'ler
- OAuth client secret'ları
- JWT signing key'leri
- SSH private key'ler
- Webhook token'ları

Bunun yerine:
```
.env dosyası (gitignore'da)
Environment variable
Secret manager (üretim için)
```

---

## MCP İzin Kontrolü

Aktif MCPler ve izin kapsamları:

| MCP | İzin | Kapsam |
|-----|------|--------|
| playwright | Tam erişim | UI test, browser otomasyon |
| context7 | Okuma | Dokümantasyon erişimi |
| filesystem | Kısıtlı | Belirli dizinler |
| instagram | Yayın | Sosyal medya |
| excel-mcp-server | Okuma/yazma | Excel dosyaları |
| ruflo | Aktif | Ruflo entegrasyonu |
| git/uvx | Commit/push | Versiyon kontrol |

Credential bekleyenler (devre dışı):
- stitch, nanobanana, gdrive

---

## Kalkan Denetim Raporu Formatı

```
[GÜVENLİK RAPORU]
Tarih: YYYY-MM-DD
Değişiklik: <ne değişti>
Risk Seviyesi: Düşük / Orta / Yüksek / Kritik
OWASP Bulguları: <liste>
Agentic Kontroller: <geçti/başarısız>
Secret Kontrolü: TEMİZ / SORUNLU
Karar: ONAY / BLOKE / YUVA
```
