import type { Metadata } from "next";
import Link from "next/link";
import ImageConvertLoader from "@/components/tools/image/ImageConvertLoader";

export const metadata: Metadata = {
  title: "EXIF / Metadata Sil — Görsel Gizlilik Aracı",
  description:
    "Görseldeki GPS konumu, kamera modeli ve kişisel EXIF verilerini kalıcı olarak sil. Tarayıcıda çalışır, sunucuya yükleme gerekmez.",
  keywords: ["exif sil", "metadata sil", "konum sil", "gizlilik", "remove exif", "fotoğraf veri sil"],
};

export default function ExifSilPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Tüm Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#F05A28" }}>EXIF / Metadata Sil</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(240,90,40,0.15)", color: "#F05A28" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 4.3-5.411m5.437-1.478A9.966 9.966 0 0 1 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 0 1-2.49 3.578M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M3 3l18 18"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>EXIF / Metadata Sil</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Görseldeki GPS konumu, kamera bilgisi ve kişisel meta verileri kalıcı olarak temizle.
            </p>
          </div>
        </div>

        {/* Gizlilik uyarı bandı */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg border mb-6"
          style={{ borderColor: "rgba(240,90,40,0.3)", background: "rgba(240,90,40,0.05)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5" style={{ color: "#F05A28" }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <p className="text-xs" style={{ color: "var(--color-text-2)" }}>
            Sosyal medyaya yüklenen görseller çoğunlukla EXIF verisini otomatik siler — ancak e-posta, mesaj uygulaması veya doğrudan paylaşımda konum bilginiz görünebilir.
          </p>
        </div>

        <ImageConvertLoader
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          targetFormat="image/jpeg"
          targetExt="jpg"
          defaultQuality={92}
          accentColor="#F05A28"
        />

        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>EXIF Verisi Hakkında</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "EXIF nedir?", a: "Exchangeable Image File Format — fotoğraf makinesinin eklediği teknik ve konumsal veri. GPS koordinatları, tarih, kamera modeli içerir." },
              { q: "Nasıl silinir?", a: "Canvas API görseli yeniden render eder ve sadece piksel datasını yazar. EXIF bloğu hiç dahil edilmez." },
              { q: "Hangi veriler silinir?", a: "GPS koordinatı, kamera modeli, lens bilgisi, ISO, tarih-saat, kullanıcı yorumları ve tüm özel metadata." },
              { q: "Kalite etkileniyor mu?", a: "Minimal. Canvas %92 JPEG kalitesiyle yeniden kodlar. Görsel farkı gözle ayırt edilemez." },
            ].map(item => (
              <div key={item.q} className="p-4 rounded-lg border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>{item.q}</h3>
                <p className="text-sm" style={{ color: "var(--color-text-2)" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
