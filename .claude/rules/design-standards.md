# PARS Tasarım Standartları

## Renk Sistemi
Her proje 3 renk: zemin, birincil vurgu, kritik vurgu.
Proje design system'ından alınır. Kural dışı renk kullanılmaz.

## Tipografi
- Başlık: ağırlık 600-700, büyük punto, birincil vurgu veya beyaz
- Gövde: ağırlık 400, gri, kompakt satır aralığı
- Veri etiketi: monospace, küçük punto
- Tek font ailesi (max 2: başlık serif + gövde sans)

## Bileşenler
- Kartlar: ince kenarlık, 8px radius, hafif arka plan
- Paneller: bölümlü, başlıklı, ikonlu
- Uyarı bantları: soldan renkli çizgi (risk seviyesine göre)
- Skor göstergeleri: büyük rakam, küçük etiket, renk kodlu

## Premium Tasarım Zorunluluğu
Her çıktı o sektörün en iyi ustası tarafından yapılmış gibi görünmeli.
"AI yaptı" hissi kesinlikle yasak. Müşteriye giden her şey premium seviyede.
Referans: `~/.claude/rules/premium-design.md`

## Yasak
- Gradient aşırı kullanımı
- Gölge yığılması
- Gereksiz animasyon veya geçiş efekti
- Clipart, stok ikon karışımı
- Birden fazla font ailesi
- Mor/mavi hero gradient ("AI görünümü")
- Neon glow / parlayan bileşenler
- Generic Tailwind / Material varsayılan renk paleti

## WCAG Minimum
- Normal metin: 4.5:1 kontrast
- Büyük metin (18px+): 3:1 kontrast
- UI bileşenleri: 3:1 kontrast

## Boşluk
Whitespace tasarımın parçası. Doldurmaya çalışma.
Spacing scale: 4px bazlı (4, 8, 12, 16, 24, 32, 48, 64)
