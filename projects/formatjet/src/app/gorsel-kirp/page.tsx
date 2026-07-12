import type { Metadata } from "next";
import Link from "next/link";
import ImageCropLoader from "@/components/tools/image/ImageCropLoader";

export const metadata: Metadata = {
  title: "Görsel Kırp — Ücretsiz Online Resim Kırpma | FormatJet",
  description: "Görseli özgürce kırp veya 1:1, 4:3, 16:9, 9:16 gibi sabit en-boy oranlarıyla kırp. Tarayıcında çalışır.",
  keywords: ["görsel kırp", "resim kırp", "crop image", "crop photo", "fotoğraf kırp"],
};

export default function GoruselKirpPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>Görsel Kırp</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 2v14a2 2 0 0 0 2 2h14M6 2H4a2 2 0 0 0-2 2v14"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>Görsel Kırp</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Kırp alanını sürükleyerek belirle. 1:1, 4:3, 16:9, 9:16 ve diğer en-boy oranları desteklenir.
            </p>
          </div>
        </div>
        <ImageCropLoader />
        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>Görsel Kırpma Hakkında</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "Serbest kırpma nedir?", a: "En-boy oranı kilidi olmadan istediğin bölgeyi seçebilirsin. Kırp noktalarını köşelerden sürükle." },
              { q: "Hangi oranları destekliyor?", a: "1:1 (kare), 4:3 (klasik fotoğraf), 16:9 (geniş ekran), 9:16 (dikey/hikaye), 3:4, 2:3, 3:2 desteklenir." },
              { q: "Çıktı formatı ne?", a: "JPG veya PNG olarak indirebilirsin. PNG şeffaflık destekler." },
              { q: "Görsellerim güvende mi?", a: "Evet. Kırpma işlemi tamamen tarayıcında gerçekleşir. Sunucuya hiçbir şey gönderilmez." },
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
