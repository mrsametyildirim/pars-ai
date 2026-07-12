import type { Metadata } from "next";
import Link from "next/link";
import BackgroundRemoveLoader from "@/components/tools/image/BackgroundRemoveLoader";

export const metadata: Metadata = {
  title: "Arka Plan Kaldır — Ücretsiz Online Arkaplan Silme | FormatJet",
  description: "Yapay zeka ile fotoğrafın arka planını otomatik olarak kaldır. Şeffaf PNG çıktı. Tarayıcıda çalışır.",
  keywords: ["arka plan kaldır", "remove background", "background remove", "arkaplan sil", "transparent background"],
};

export default function ArkaplanKaldirPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>Arka Plan Kaldır</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5zM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-2xl font-medium" style={{ color: "var(--color-text)" }}>Arka Plan Kaldır</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>YZ</span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              Yapay zeka modeli ile fotoğrafın arka planını otomatik algıla ve kaldır. Şeffaf PNG çıktı.
            </p>
          </div>
        </div>

        {/* Özellik önizleme */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: "🎯", title: "Otomatik Algılama", desc: "Nesne sınırlarını AI belirler" },
            { icon: "⚡", title: "Hızlı İşlem", desc: "Saniyeler içinde sonuç" },
            { icon: "🔒", title: "Gizli & Güvenli", desc: "Sunucuya gönderilmez" },
          ].map(f => (
            <div key={f.title} className="p-3 rounded-xl border text-center" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-xs font-medium mb-0.5" style={{ color: "var(--color-text)" }}>{f.title}</p>
              <p className="text-xs" style={{ color: "var(--color-text-3)" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <BackgroundRemoveLoader />
      </div>
    </div>
  );
}
