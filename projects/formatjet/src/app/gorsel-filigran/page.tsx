import type { Metadata } from "next";
import Link from "next/link";
import ImageWatermarkLoader from "@/components/tools/image/ImageWatermarkLoader";

export const metadata: Metadata = {
  title: "Görsel Filigranı — Ücretsiz Online Filigran Ekle | FormatJet",
  description: "Görsele metin filigranı ekle. Yazı boyutu, opaklık, renk ve konum seçenekleri. Tarayıcında çalışır.",
  keywords: ["filigran ekle", "watermark", "görsel filigran", "watermark image"],
};

export default function GoruselFiligranPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>Görsel Filigranı</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Görsel Filigranı</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Görsele metin filigranı ekle. Yazı, renk, boyut, opaklık ve konumu özelleştir.
            </p>
          </div>
        </div>
        <ImageWatermarkLoader />
        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>Filigran Hakkında</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "Neden filigran eklenir?", a: "Fotoğraflarının izinsiz kullanımını önlemek için filigran ekleyebilirsin. İsim, telif hakkı sembolü veya web sitenin adını kullan." },
              { q: "Hangi pozisyonlar var?", a: "Sol üst, orta üst, sağ üst, sol orta, orta, sağ orta, sol alt, orta alt, sağ alt — 9 konum seçeneği." },
              { q: "Opaklık ne işe yarar?", a: "Düşük opaklık (%30-50) filigranın arka planla kaynaşmasını sağlar. Yüksek opaklık (%80-100) daha belirgin görünür." },
              { q: "Görsellerim güvende mi?", a: "Evet. Tüm işlem tarayıcında gerçekleşir. Görselin sunucumuza gönderilmez." },
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
