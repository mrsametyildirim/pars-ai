import type { Metadata } from "next";
import Link from "next/link";
import SvgToPngLoader from "@/components/tools/image/SvgToPngLoader";

export const metadata: Metadata = {
  title: "SVG → PNG — Ücretsiz Online SVG Dönüştürücü | FormatJet",
  description: "SVG vektör dosyasını yüksek çözünürlüklü PNG görsel olarak dışa aktar. 1×, 2×, 4×, 8× ölçeklendirme desteği. Tarayıcında çalışır.",
  keywords: ["svg to png", "svg png", "vektör görsel", "svg dönüştür"],
};

export default function SvgToPngPage() {
  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-3xl">
        <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--color-text-3)" }}>
          <Link href="/" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Ana Sayfa</Link>
          <span>/</span>
          <Link href="/araclar" className="hover:underline" style={{ color: "var(--color-text-2)" }}>Araçlar</Link>
          <span>/</span>
          <span style={{ color: "#818CF8" }}>SVG → PNG</span>
        </nav>
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(129,140,248,0.15)", color: "#818CF8" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium mb-1" style={{ color: "var(--color-text)" }}>SVG → PNG</h1>
            <p className="text-sm" style={{ color: "var(--color-text-2)" }}>
              SVG vektör dosyasını yüksek çözünürlüklü PNG'ye dönüştür. 2×, 4× veya 8× ölçeklendirme ile netlik kaybı yok.
            </p>
          </div>
        </div>
        <SvgToPngLoader />
        <div className="mt-12 space-y-4">
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--color-text)" }}>SVG → PNG Hakkında</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "SVG nedir?", a: "SVG (Scalable Vector Graphics) matematiksel formüllere dayanan bir vektör formatıdır. Her boyuta ölçeklenebilir, boyut bozulması olmaz." },
              { q: "Neden PNG'ye dönüştürmeli?", a: "Bazı platformlar SVG desteklemez. PNG olarak dışa aktararak sosyal medya, e-posta ve eski yazılımlarda kullanabilirsin." },
              { q: "Hangi ölçek seçmeliyim?", a: "Çoğu kullanım için 2× yeterli. Baskı veya yüksek DPI ekranlar için 4× veya 8× önerilir." },
              { q: "İşlem nerede gerçekleşiyor?", a: "Tamamen tarayıcında. SVG dosyan sunucuya yüklenmez, gizliliğin korunur." },
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
