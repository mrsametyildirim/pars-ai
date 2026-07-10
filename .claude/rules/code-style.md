# PARS Kod Stili Kuralları

## İsimlendirme
- Değişken/fonksiyon: `camelCase`
- CSS sınıfı: `kebab-case`
- Sabit: `UPPER_SNAKE_CASE`
- Dosya: `kebab-case.js` / `kebab-case.ts`
- React bileşeni: `PascalCase`
- Anlamlı isim; kısaltma sadece yaygın olanlar (`id`, `url`, `api`)

## Yasak
- Magic number: `if (score > 75)` değil, `const HIGH_RISK_THRESHOLD = 75`
- Dead code bırakma
- `any` tipi (TypeScript'te)
- `console.log` production'da
- Yorum satırı (kod açıklayıcı olmalı)
- `// TODO` production'a gönderme

## Fonksiyon
- Tek sorumluluk
- 20 satırı geçen fonksiyon → böl
- Parametreler 3'ten fazlaysa nesne al: `fn({ a, b, c })`

## Tekrar
- 3 kez aynı kod görülürse → ortak fonksiyona al

## Import Sırası
1. Node.js standart kütüphaneler
2. Harici (npm) paketler
3. Yerel modüller

## Kalite Kontrol Araçları

| Görev | Araç |
|-------|------|
| Kod inceleme | `04-code-review` skill |
| Sadeleştirme | `simplify` skill |
| Teknik borç | `tech-debt` skill |
| Büyük değişiklik | `code-reviewer-agent` |
| Performans profili | `perf-profile` skill |
| UI/görsel kontrol | `playwright` MCP |
