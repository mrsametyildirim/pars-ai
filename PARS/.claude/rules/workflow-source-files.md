# Kaynak Dosya İş Akışı Kuralı

## Kesin Klasör Yolları
```
C:\Users\MSI-NB\.claude\claude-kaynak\           ← GİRİŞ (kullanıcı buraya koyar)
C:\Users\MSI-NB\.claude\claude-kaynak\halledilen\ ← ÇIKIŞ (asistan işi bitince buraya taşır)
```

## Temel Prensip
Bu klasör, kullanıcı ile asistan arasındaki tek ve sabit dosya alışveriş noktasıdır.
PDF, görsel, metin, veri, şema — her türlü materyal buraya gelir.

## İş Akışı
1. Kullanıcı dosyayı `C:\Users\MSI-NB\.claude\claude-kaynak\` klasörüne koyar
2. Asistan klasörü okur ve işlemi uygular
3. İşlem TAMAMEN bitince dosya `halledilen\` alt klasörüne taşınır
4. Kullanıcıya kısa özet verilir

## Uygulama Kuralları
- Her oturum başında `claude-kaynak\` klasörünü kontrol et; yeni dosya varsa önce onları işle
- Dosya taşıma yarım iş bittikten sonra yapılmaz — yalnızca tam tamamlandığında
- `halledilen\` klasörü arşivdir; manuel silinene kadar dokunulmaz
- Bu kural tüm PARS projeleri ve tüm oturumlar için geçerlidir; istisna yoktur
- Klasör yoksa oluştur (`halledilen\` dahil)
