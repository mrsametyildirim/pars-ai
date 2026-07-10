# Sesli Komut Yönlendirme

## Komut Kategorileri

| Tetikleyici | Yönlendirme | Örnek |
|-------------|-------------|-------|
| "ARES..." | CEO-ARES | "ARES risk haritasını göster" |
| "Bilge..." | Bilge agent | "Bilge, geçen haftaki kararları özetle" |
| "Kaşif..." | Kaşif agent | "Kaşif, yeni AI araçlarını araştır" |
| "Yuva..." | Yuva council | "Yuva, XR projesini değerlendir" |
| "plan..." | Planning agent | "Plan, bu sprint'i oluştur" |
| Diğer | Börü (default) | Genel görev |

## Intent Parsing
OpenJarvis intent sistemi + Börü router kombinasyonu.
Belirsiz komutlar Börü'ye düşer, Börü bağlamdan agent seçer.

## Öncelik Kuralları
1. Açık agent adı → direkt yönlendir
2. Proje adı → ilgili CEO agent
3. Görev türü → team agent
4. Belirsiz → Börü karar verir
