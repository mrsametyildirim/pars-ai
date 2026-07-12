import type { Metadata } from "next";
import Link from "next/link";
import BackgroundChangeLoader from "@/components/tools/image/BackgroundChangeLoader";

export const metadata: Metadata = {
  title: "Arka Plan Değiştir — Yapay Zeka ile Arkaplan Değiştirme | FormatJet",
  description: "Fotoğrafın arka planını AI ile kaldır, istediğin renk veya görselle değiştir. Tarayıcıda çalışır, ücretsiz.",
  keywords: ["arka plan değiştir", "change background", "background change", "fotoğraf arkaplan değiştir", "arka plan renk"],
};

export default function ArkaplanDegistirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>Arka Plan Değiştir</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M7 4V20M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-2xl font-medium" style={{ color: "var(--color-text)" }}>Arka Plan Değiştir</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>YZ</span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>Arka planı otomatik kaldır, yeni arka plan görseli veya renk ekle.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: "🎨", title: "Renk veya Görsel", desc: "Preset renkler veya kendi görseliniz" },
            { icon: "🤖", title: "AI Destekli", desc: "U2Net modeli nesne sınırlarını algılar" },
            { icon: "⚡", title: "2 Adımda Biter", desc: "Kaldır → Yeni arka plan seç" },
          ].map(f => (
            <div key={f.title} className="p-3 rounded-xl border text-center" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "var(--color-text)" }}>{f.title}</p>
              <p className="text-xs" style={{ color: "var(--color-text-3)" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <BackgroundChangeLoader />
      </div>
    </div>
  );
}
